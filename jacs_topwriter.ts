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
        constructor(private parent: TopWriter, public name: string, lst: Procedure[]) {
            this.index = lst.length
            lst.push(this)
            this.writer = new OpWriter(this.parent, this.name, this.index)
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
            const r = Buffer.create(BinFmt.ROLE_HEADER_SIZE)
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
        private stringLiterals: (string | Buffer)[] = []

        writer: OpWriter
        proc: Procedure
        hasErrors: boolean
        resolverPC: number
        globals: Variable[] = []
        procs: Procedure[] = []
        roles: Role[] = []
        currPage: Variable
        currAnimation: Variable
        currMelody: Variable
        currRuleId = 0
        currPageId = 0
        pageProcs: Procedure[] = []

        pageStartCondition: Role

        constructor() {}

        addString(str: string | Buffer) {
            if (typeof str == "string") {
                for (let i = 0; i < this.stringLiterals.length; ++i)
                    if (str == this.stringLiterals[i]) return i
            } else {
                for (let i = 0; i < this.stringLiterals.length; ++i)
                    if (
                        typeof this.stringLiterals[i] != "string" &&
                        str.equals(this.stringLiterals[i] as Buffer)
                    )
                        return i
            }

            this.stringLiterals.push(str)
            return this.stringLiterals.length - 1
        }

        addFloat(f: number): number {
            return addUnique(this.floatLiterals, f)
        }

        describeCell(ff: string, idx: number): string {
            switch (ff) {
                case "R":
                    return this.roles[idx] ? this.roles[idx].name : ""
                case "S":
                    return this.describeString(idx)
                case "P":
                    return "" // param
                case "L":
                    return "" // local
                case "G":
                    return this.globals[idx] ? this.globals[idx].name : ""
                case "D":
                    return this.floatLiterals[idx] + ""
                case "F":
                    return this.procs[idx] ? this.procs[idx].name : ""
                default:
                    return ""
            }
        }

        private serialize() {
            const fixHeader = new SectionWriter(BinFmt.FIX_HEADER_SIZE)
            const sectDescs = new SectionWriter()
            const sections: SectionWriter[] = [fixHeader, sectDescs]

            const hd = Buffer.create(BinFmt.FIX_HEADER_SIZE)
            hd.write(
                0,
                Buffer.pack("IIIH", [
                    BinFmt.MAGIC0,
                    BinFmt.MAGIC1,
                    BinFmt.IMG_VERSION,
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

            funDesc.size = BinFmt.FUNCTION_HEADER_SIZE * this.procs.length

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

            const descs = this.stringLiterals.map((str, idx) => {
                let buf: Buffer
                let len: number
                if (typeof str == "string") {
                    buf = Buffer.fromUTF8(str + "\u0000")
                    len = buf.length - 1
                } else {
                    buf = str as Buffer
                    len = buf.length
                }
                const desc = Buffer.create(8)
                write32(desc, 0, strData.currSize) // initially use offsets in strData section
                write32(desc, 4, len)
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
            const mask = BinFmt.BINARY_SIZE_ALIGN - 1
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
            assert(0 <= left && left < BinFmt.BINARY_SIZE_ALIGN)

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
            for (let idx = 0; idx < this.stringLiterals.length; ++idx) {
                console.log(idx + ": " + this.describeString(idx))
            }
        }

        describeString(idx: number) {
            const s = this.stringLiterals[idx]
            if (s == null) return "NULL"
            if (typeof s == "string") return JSON.stringify(s)
            else return (s as Buffer).toHex()
        }

        get mainProc() {
            return this.procs[0]
        }

        addProc(name: string) {
            return new Procedure(this, name, this.procs)
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
            if (sensor && sensor.eventCode != undefined) {
                let evCode = sensor.eventCode
                for (const m of rule.filters) {
                    if (m.eventCode !== undefined) evCode = m.eventCode
                }
                return evCode
            }
            return null
        }

        private emitLoadBuffer(buf: string | Buffer) {
            let len = 0
            if (typeof buf == "string")
                len = Buffer.fromUTF8(buf as string).length
            else len = (buf as Buffer).length
            const wr = this.writer
            wr.emitStmt(OpStmt.STMT2_SETUP_BUFFER, [literal(len), literal(0)])
            wr.emitStmt(OpStmt.STMT2_MEMCPY, [
                literal(this.addString(buf)),
                literal(0),
            ])
        }

        private emitSequance(
            rule: microcode.RuleDefn,
            lockvar: Variable,
            delay: number
        ) {
            const actuator = rule.actuators[0]
            const wr = this.writer
            const params = rule.modifiers
                .map(m => m.serviceCommandArg())
                .filter(a => !!a)
            if (params.length == 0) params.push(Buffer.create(6))
            if (lockvar) lockvar.write(wr, literal(this.currRuleId))
            for (let i = 0; i < params.length; ++i) {
                const role = this.lookupActuatorRole(rule)
                this.emitLoadBuffer(params[i])
                wr.emitStmt(OpStmt.STMT2_SEND_CMD, [
                    literal(role.index),
                    literal(actuator.serviceCommand),
                ])
                if (i != params.length - 1) {
                    wr.emitStmt(OpStmt.STMT1_SLEEP_MS, [literal(delay)])
                    if (lockvar)
                        wr.emitIf(
                            wr.emitExpr(OpExpr.EXPR2_NE, [
                                lockvar.read(wr),
                                literal(this.currRuleId),
                            ]),
                            () => {
                                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
                            }
                        )
                }
            }
        }

        private emitRoleCommand(rule: microcode.RuleDefn) {
            const actuator = rule.actuators.length ? rule.actuators[0] : null
            const wr = this.writer
            if (actuator == null) return // do nothing
            if (actuator.tid == microcode.TID_ACTUATOR_PAINT) {
                this.emitSequance(rule, this.currAnimation, 400)
            } else if (actuator.tid == microcode.TID_ACTUATOR_MUSIC) {
                this.emitSequance(rule, this.currMelody, 400)
            } else if (actuator.tid == microcode.TID_ACTUATOR_SWITCH_PAGE) {
                let targetPage = 1
                for (const m of rule.modifiers)
                    if (m.category == "page") targetPage = m.jdParam

                wr.emitCall(this.pageProc(targetPage).index, [])
            } else if (actuator.serviceArgFromModifier) {
                const role = this.lookupActuatorRole(rule)
                let jdParam: any = null
                for (const m of rule.modifiers) {
                    if (m.jdParam !== undefined) jdParam = m.jdParam
                }
                const buf = actuator.serviceArgFromModifier(jdParam)
                this.emitLoadBuffer(buf)
                wr.emitStmt(OpStmt.STMT2_SEND_CMD, [
                    literal(role.index),
                    literal(actuator.serviceCommand),
                ])
                this.emitLogString("send: " + role.name)
            } else {
                this.error(`can't map act role for ${JSON.stringify(actuator)}`)
            }
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
            if (!role) {
                console.log("TID:" + rule.sensors[0].tid)
                return
            }
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

        emitLogString(str: string) {
            this.writer.emitStmt(OpStmt.STMT3_LOG_FORMAT, [
                literal(this.addString(str)),
                literal(0),
                literal(0),
            ])
        }

        emitProgram(prog: microcode.ProgramDefn) {
            this.currPage = this.addGlobal("page")
            this.currAnimation = this.addGlobal("anim")
            this.currMelody = this.addGlobal("melody")

            this.pageStartCondition = this.addRole(
                "pageStart",
                SRV_JACSCRIPT_CONDITION
            )

            const mainProc = this.addProc("main")
            this.withProcedure(mainProc, wr => {
                this.emitLogString("MicroCode start!")
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
        // m:b
        button: 0x1473a263,
        dotMatrix: 0x110d154b,
        bitRadio: 0x1ac986cf,
        soundLevel: 0x14ad1a5d,
        temperature: 0x1421bac7,
        soundPlayer: 0x1403d338,
        buzzer: 0x1b57b1d7,
        // Kit-A
        potentiometer: 0x1f274746,
        lightLevel: 0x17dc9a1c,
        magneticFieldLevel: 0x12fe180f,
        rotaryEncoder: 0x10fa29c9,
        led: 0x1609d4f0,
    }

    export const SRV_JACSCRIPT_CONDITION = 0x1196796d

    export const CMD_GET_REG = 0x1000
    export const CMD_SET_REG = 0x2000
}
