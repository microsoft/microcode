namespace jacs {
    export function addUnique<T>(arr: T[], v: T) {
        let idx = arr.indexOf(v)
        if (idx < 0) {
            idx = arr.length
            arr.push(v)
        }
        return idx
    }

    export interface SMap<T> {
        [k: string]: T
    }

    class Variable {
        index: number
        constructor(
            lst: Variable[],
            public kind: CellKind,
            public name: string
        ) {
            this.index = lst.length
            lst.push(this)
        }
        read(wr: OpWriter) {
            return wr.emitExpr(loadExpr(this.kind), [literal(this.index)])
        }
        write(wr: OpWriter, val: Value) {
            wr.emitStmt(storeStmt(this.kind), [literal(this.index), val])
        }
    }

    class Procedure {
        writer: OpWriter
        locals: Variable[] = []
        params: Variable[] = []
        index: number
        constructor(private parent: TopWriter, public name: string) {
            this.writer = new OpWriter(this.parent, this.name)
        }
        finalize() {
            this.writer.patchLabels()
        }
        toString() {
            return this.writer.getAssembly()
        }
        addLocal(name: string) {
            return new Variable(this.locals, CellKind.LOCAL, name)
        }
    }

    class Role {
        stringIndex: number
        index: number
        private dispatcher: Procedure

        constructor(
            private parent: TopWriter,
            public classIdentifier: number,
            public name: string
        ) {
            this.stringIndex = this.parent.addString(this.name)
            this.index = this.parent.roles.length
            this.parent.roles.push(this)
        }

        serialize() {
            const r = Buffer.create(BinFmt.RoleHeaderSize)
            write32(r, 0, this.classIdentifier)
            write16(r, 4, this.stringIndex)
            return r
        }

        finalize() {
            if (!this.dispatcher) return

            this.parent.withProcedure(this.dispatcher, wr => {
                wr.emitJump(wr.top)
            })
            this.parent.withProcedure(this.parent.mainProc, wr => {
                wr.emitCall(this.dispatcher.index, [], OpCall.BG_MAX1)
            })
        }

        getDispatcher() {
            if (!this.dispatcher) {
                this.dispatcher = this.parent.addProc(this.name + "_disp")
                this.parent.withProcedure(this.dispatcher, wr => {
                    wr.emitStmt(OpStmt.STMT1_WAIT_ROLE, [literal(this.index)])
                })
            }
            return this.dispatcher
        }
    }

    export class TopWriter implements TopOpWriter {
        private floatLiterals: number[] = []
        private stringLiterals: string[] = []

        writer: OpWriter
        proc: Procedure
        hasErrors: boolean
        resolverPC: number
        globals: Variable[] = []
        procs: Procedure[] = []
        roles: Role[] = []
        currPage: Variable
        currAnimation: Variable
        currRuleId = 0
        currPageId = 0
        pageProcs: Procedure[] = []

        pageStartCondition: Role

        constructor() {}

        addString(str: string | Buffer) {
            if (typeof str != "string") {
                let tmp = ""
                for (let i = 0; i < str.length; ++i)
                    tmp += String.fromCharCode(str[i])
                str = tmp
            }
            return addUnique(this.stringLiterals, str)
        }

        addFloat(f: number): number {
            return addUnique(this.floatLiterals, f)
        }

        describeCell(t: CellKind, idx: number): string {
            switch (t) {
                case CellKind.FLOAT_CONST:
                    return this.floatLiterals[idx] + ""
                case CellKind.GLOBAL:
                    return this.globals[idx].name
                default:
                    return undefined
            }
        }
        funName(idx: number): string {
            const p = this.procs[idx]
            return p ? p.name : undefined
        }
        roleName(idx: number): string {
            const r = this.roles[idx]
            return r ? r.name : undefined
        }

        private serialize() {
            const fixHeader = new SectionWriter(BinFmt.FixHeaderSize)
            const sectDescs = new SectionWriter()
            const sections: SectionWriter[] = [fixHeader, sectDescs]

            const hd = Buffer.create(BinFmt.FixHeaderSize)
            hd.write(
                0,
                Buffer.pack("IIIH", [
                    BinFmt.Magic0,
                    BinFmt.Magic1,
                    BinFmt.ImgVersion,
                    this.globals.length,
                ])
            )

            fixHeader.append(hd)

            const funDesc = new SectionWriter()
            const funData = new SectionWriter()
            const floatData = new SectionWriter()
            const roleData = new SectionWriter()
            const strDesc = new SectionWriter()
            const strData = new SectionWriter()
            const bufferDesc = new SectionWriter()

            for (const s of [
                funDesc,
                funData,
                floatData,
                roleData,
                strDesc,
                strData,
                bufferDesc,
            ]) {
                sectDescs.append(s.desc)
                sections.push(s)
            }

            funDesc.size = BinFmt.FunctionHeaderSize * this.procs.length

            for (const proc of this.procs) {
                funDesc.append(proc.writer.desc)
                proc.writer.offsetInFuncs = funData.currSize
                funData.append(proc.writer.serialize())
            }

            const floatBuf = Buffer.create(this.floatLiterals.length * 8)
            for (let i = 0; i < this.floatLiterals.length; ++i) {
                const f = this.floatLiterals[i]
                if ((f | 0) == f) {
                    // nan-box it
                    floatBuf.setNumber(NumberFormat.Int32LE, i << 3, f)
                    floatBuf.setNumber(NumberFormat.Int32LE, 4 + (i << 3), -1)
                } else {
                    floatBuf.setNumber(NumberFormat.Float64LE, i << 3, f)
                }
            }

            floatData.append(floatBuf)

            for (const r of this.roles) {
                roleData.append(r.serialize())
            }

            /*
            for (const b of this.buffers) {
                bufferDesc.append(b.serialize())
            }
            */

            const descs = this.stringLiterals.map(str => {
                const buf = Buffer.fromUTF8(str + "\u0000")
                const desc = Buffer.create(8)
                write32(desc, 0, strData.currSize) // initially use offsets in strData section
                write32(desc, 4, buf.length - 1)
                strData.append(buf)
                strDesc.append(desc)
                return desc
            })
            strData.align()

            let off = 0
            for (const s of sections) {
                s.finalize(off)
                off += s.size
            }
            const mask = BinFmt.BinarySizeAlign - 1
            off = (off + mask) & ~mask
            const outp = Buffer.create(off)

            // shift offsets from strData-local to global
            for (const d of descs) {
                write32(d, 0, read32(d, 0) + strData.offset)
            }

            for (const proc of this.procs) {
                proc.writer.finalizeDesc(
                    funData.offset + proc.writer.offsetInFuncs,
                    proc.locals.length,
                    proc.params.length
                )
            }

            off = 0
            for (const s of sections) {
                for (const d of s.data) {
                    outp.write(off, d)
                    off += d.length
                }
            }

            const left = outp.length - off
            assert(0 <= left && left < BinFmt.BinarySizeAlign)

            return outp
        }

        withProcedure<T>(proc: Procedure, f: (wr: OpWriter) => T) {
            assert(!!proc)
            const prevProc = this.proc
            let r: T
            try {
                this.proc = proc
                this.writer = proc.writer
                r = f(proc.writer)
            } finally {
                this.proc = prevProc
                if (prevProc) this.writer = prevProc.writer
            }
            return r
        }

        private finalize() {
            for (const r of this.roles) r.finalize()
            this.withProcedure(this.mainProc, wr => {
                // wait for autobind to finish
                wr.emitStmt(OpStmt.STMT1_SLEEP_MS, [literal(1000)])
                wr.emitCall(this.pageProc(1).index, [])
                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
            })
            this.finalizePageProcs()
            for (const p of this.procs) p.finalize()

            for (const p of this.procs) {
                console.log(p.toString())
            }
            let idx = 0
            for (const s of this.stringLiterals) {
                console.log(idx + ": " + JSON.stringify(s))
                idx++
            }
        }

        get mainProc() {
            return this.procs[0]
        }

        addProc(name: string) {
            const proc = new Procedure(this, name)
            proc.index = this.procs.length
            this.procs.push(proc)
            return proc
        }

        addGlobal(name: string) {
            return new Variable(this.globals, CellKind.GLOBAL, name)
        }

        addRole(name: string, classId: number) {
            return new Role(this, classId, name)
        }

        error(msg: string) {
            this.hasErrors = true
            console.error("Error: " + msg)
        }

        lookupServiceClass(name: string) {
            const id = serviceClasses[name]
            if (id === undefined) {
                this.error(`service '${name}' not defined`)
                return 0
            }
            return id
        }

        lookupRole(name: string, idx: number) {
            const id = this.lookupServiceClass(name)
            if (!id) return this.pageStartCondition
            let ptr = 0
            for (const r of this.roles) {
                if (r.classIdentifier == id) {
                    if (ptr == idx) return r
                    ptr++
                }
            }
            let r: Role
            while (ptr <= idx) {
                r = this.addRole(name + "_" + ptr, id)
                ptr++
            }
            return r
        }

        lookupActuatorRole(rule: microcode.RuleDefn) {
            const act = rule.actuators.length ? rule.actuators[0] : null
            if (!act) return this.pageStartCondition
            return this.lookupRole(
                act.serviceClassName,
                act.serviceInstanceIndex
            )
        }

        lookupSensorRole(rule: microcode.RuleDefn) {
            const sensor = rule.sensors.length ? rule.sensors[0] : null
            if (!sensor) return this.pageStartCondition
            let idx = sensor.serviceInstanceIndex
            if (sensor.tid == microcode.TID_SENSOR_PRESS)
                for (const f of rule.filters)
                    if (typeof f.jdParam == "number") idx = f.jdParam
            return this.lookupRole(sensor.serviceClassName, idx)
        }

        lookupEventCode(role: Role, rule: microcode.RuleDefn) {
            const sensor = rule.sensors.length ? rule.sensors[0] : null
            if (sensor && sensor.eventCode != undefined) return sensor.eventCode
            return null
        }

        private emitRoleCommand(rule: microcode.RuleDefn) {
            const actuator = rule.actuators.length ? rule.actuators[0] : null
            const wr = this.writer
            if (actuator == null) return // do nothing
            if (actuator) {
                if (actuator.tid == microcode.TID_ACTUATOR_PAINT) {
                    const params = rule.modifiers
                        .map(m => m.serviceCommandArg())
                        .filter(a => !!a)
                    if (params.length == 0) params.push(Buffer.create(5))
                    this.currAnimation.write(wr, literal(this.currRuleId))
                    for (let i = 0; i < params.length; ++i) {
                        const role = this.lookupActuatorRole(rule)
                        wr.emitStmt(OpStmt.STMT2_SETUP_BUFFER, [
                            literal(5),
                            literal(0),
                        ])
                        wr.emitStmt(OpStmt.STMT2_MEMCPY, [
                            literal(this.addString(params[i])),
                            literal(0),
                        ])
                        wr.emitStmt(OpStmt.STMT2_SEND_CMD, [
                            literal(role.index),
                            literal(actuator.serviceCommand),
                        ])
                        if (i != params.length - 1) {
                            wr.emitStmt(OpStmt.STMT1_SLEEP_MS, [literal(400)])
                            wr.emitIf(
                                wr.emitExpr(OpExpr.EXPR2_NE, [
                                    this.currAnimation.read(wr),
                                    literal(this.currRuleId),
                                ]),
                                () => {
                                    wr.emitStmt(OpStmt.STMT1_RETURN, [
                                        literal(0),
                                    ])
                                }
                            )
                        }
                    }
                    return
                } else if (actuator.tid == microcode.TID_ACTUATOR_SWITCH_PAGE) {
                    let targetPage = 1
                    for (const m of rule.modifiers)
                        if (m.category == "page") targetPage = m.jdParam

                    wr.emitCall(this.pageProc(targetPage).index, [])
                    return
                }
            }
            this.error(`can't map act role for ${JSON.stringify(actuator)}`)
        }

        private emitRuleActuator(name: string, rule: microcode.RuleDefn) {
            const body = this.addProc(name)
            this.withProcedure(body, wr => {
                this.emitRoleCommand(rule)
                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
            })
            return body
        }

        private ifCurrPage(then: () => void) {
            const wr = this.writer
            wr.emitIf(
                wr.emitExpr(OpExpr.EXPR2_EQ, [
                    this.currPage.read(wr),
                    literal(this.currPageId),
                ]),
                then
            )
        }

        private pageProc(pageIdx: number) {
            if (!this.pageProcs[pageIdx]) {
                this.pageProcs[pageIdx] = this.addProc("startPage" + pageIdx)
                this.withProcedure(this.pageProcs[pageIdx], wr => {
                    this.currPage.write(wr, literal(pageIdx))
                })
            }
            return this.pageProcs[pageIdx]
        }

        private finalizePageProcs() {
            for (const proc of this.pageProcs) {
                if (proc)
                    this.withProcedure(proc, wr => {
                        wr.emitStmt(OpStmt.STMT2_SEND_CMD, [
                            literal(this.pageStartCondition.index),
                            literal(0x80),
                        ])
                        wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
                    })
            }
        }

        private emitRule(name: string, rule: microcode.RuleDefn) {
            const body = this.emitRuleActuator(name, rule)

            if (
                rule.sensors[0] &&
                rule.sensors[0].tid == microcode.TID_SENSOR_TIMER
            ) {
                const timer = this.addProc(name + "_timer")
                let period = 0
                for (const m of rule.filters) {
                    if (typeof m.jdParam == "number") period += m.jdParam
                }
                if (period == 0) period = 1000 // reasonable default
                this.withProcedure(this.pageProc(this.currPageId), wr => {
                    // first, terminate any previous one
                    wr.emitStmt(OpStmt.STMT1_TERMINATE_FIBER, [
                        wr.emitExpr(OpExpr.EXPR1_GET_FIBER_HANDLE, [
                            literal(timer.index),
                        ]),
                    ])
                    // then start a new one
                    wr.emitCall(timer.index, [], OpCall.BG_MAX1)
                })
                this.withProcedure(timer, wr => {
                    wr.emitStmt(OpStmt.STMT1_SLEEP_MS, [literal(period)])
                    this.ifCurrPage(() => {
                        wr.emitCall(body.index, [], OpCall.BG_MAX1)
                    })
                    wr.emitJump(wr.top)
                })
                return
            }

            const role = this.lookupSensorRole(rule)
            name += "_" + role.name

            this.withProcedure(role.getDispatcher(), wr => {
                this.ifCurrPage(() => {
                    const code = this.lookupEventCode(role, rule)
                    if (code != null) {
                        wr.emitIf(
                            wr.emitExpr(OpExpr.EXPR2_EQ, [
                                wr.emitExpr(OpExpr.EXPR0_PKT_EV_CODE, []),
                                literal(code),
                            ]),
                            () => {
                                wr.emitCall(body.index, [], OpCall.BG_MAX1)
                            }
                        )
                    } else if (
                        role.classIdentifier == SRV_JACSCRIPT_CONDITION
                    ) {
                        // event code not relevant
                        wr.emitCall(body.index, [], OpCall.BG_MAX1)
                    } else {
                        this.error("can't handle role")
                    }
                })
            })
        }

        emitProgram(prog: microcode.ProgramDefn) {
            jdc.start() // TODO move

            this.currPage = this.addGlobal("page")
            this.currAnimation = this.addGlobal("anim")

            this.pageStartCondition = this.addRole(
                "pageStart",
                SRV_JACSCRIPT_CONDITION
            )

            const mainProc = this.addProc("main")
            this.withProcedure(mainProc, wr => {
                wr.emitStmt(OpStmt.STMT3_LOG_FORMAT, [
                    literal(this.addString("micro:start!")),
                    literal(0),
                    literal(0),
                ])
            })

            this.currPageId = 0
            for (const page of prog.pages) {
                this.currPageId++
                let ruleIdx = 0
                for (const rule of page.rules) {
                    this.currRuleId++
                    this.emitRule("r" + this.currPageId + "_" + ruleIdx++, rule)
                }
            }

            this.finalize()

            if (this.hasErrors) {
                console.error("errors; not deploying")
            } else {
                const bin = this.serialize()
                console.log(bin.toHex())
                jdc.deploy(bin)
            }
        }
    }

    export const serviceClasses: SMap<number> = {
        button: 0x1473a263,
        dotMatrix: 0x110d154b,
    }

    export const SRV_JACSCRIPT_CONDITION = 0x1196796d

    export const CMD_GET_REG = 0x1000
    export const CMD_SET_REG = 0x2000
}
