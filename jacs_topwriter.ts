namespace jacs {
    let debugOut = true

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
        constructor(
            private parent: TopWriter,
            public name: string,
            lst: Procedure[]
        ) {
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
        lookupLocal(name: string) {
            let v = this.locals.find(v => v.name == name)
            if (!v) v = this.addLocal(name)
            return v
        }
    }

    class Role {
        stringIndex: number
        index: number
        top: Label
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
                wr.emitJump(this.top)
            })
            this.parent.withProcedure(this.parent.mainProc, wr => {
                wr.emitCall(this.dispatcher.index, [], OpCall.BG_MAX1)
            })
        }

        getDispatcher() {
            if (!this.dispatcher) {
                this.dispatcher = this.parent.addProc(this.name + "_disp")
                this.parent.withProcedure(this.dispatcher, wr => {
                    if (needsWakeup.indexOf(this.classIdentifier) >= 0) {
                        wr.emitStmt(OpStmt.STMT3_QUERY_REG, [
                            literal(this.index),
                            literal(JD_REG_STREAMING_SAMPLES),
                            literal(1000),
                        ])
                        this.parent.ifEq(
                            wr.emitExpr(OpExpr.EXPR0_RET_VAL, []),
                            0,
                            () => {
                                this.parent.emitLoadBuffer(hex`0a`)
                                this.parent.emitSendCmd(
                                    this,
                                    CMD_SET_REG | JD_REG_STREAMING_SAMPLES
                                )
                            }
                        )
                    }
                    if (needsEnable.indexOf(this.classIdentifier) >= 0) {
                        this.parent.emitLoadBuffer(hex`01`)
                        this.parent.emitSendCmd(
                            this,
                            CMD_SET_REG | JD_REG_INTENSITY
                        )
                        if (this.classIdentifier == serviceClasses["radio"]) {
                            // set group to 1
                            this.parent.emitLoadBuffer(hex`01`)
                            this.parent.emitSendCmd(
                                this,
                                CMD_SET_REG | 0x80
                            )
                        }
                    }
                    this.top = wr.mkLabel("tp")
                    wr.emitLabel(this.top)
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

        printAssembly() {
            for (const p of this.procs) {
                console.log(p.toString())
            }
            for (let idx = 0; idx < this.stringLiterals.length; ++idx) {
                console.log(idx + ": " + this.describeString(idx))
            }
        }

        private finalize() {
            for (const r of this.roles) r.finalize()
            this.withProcedure(this.mainProc, wr => {
                this.emitClearScreen()
                wr.emitCall(this.pageProc(1).index, [])
                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
            })
            this.finalizePageProcs()
            for (const p of this.procs) p.finalize()
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
            const r = new Role(this, classId, name)
            if (needsEnable.indexOf(classId) >= 0) r.getDispatcher()
            return r
        }

        addOrGetRole(name: string, classId: number) {
            const r = this.roles.find(r => r.name == name)
            if (r) return r
            return this.addRole(name, classId)
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
            if (
                sensor.tid == microcode.TID_SENSOR_PRESS ||
                sensor.tid === microcode.TID_SENSOR_RELEASE
            )
                for (const f of rule.filters)
                    if (typeof f.jdParam == "number") idx = f.jdParam
            if (!sensor.serviceClassName)
                this.error(`can't emit ${sensor.name} ${sensor.tid}`)
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

        emitLoadBuffer(buf: string | Buffer) {
            let len = 0
            if (buf == null) {
                buf = ""
                this.error("no buffer")
            }
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

        private ruleParams(rule: microcode.RuleDefn, bufSize: number) {
            const fn = rule.actuators[0].serviceArgFromModifier
            const params = rule.modifiers
                .map(m => (fn ? fn(m.jdParam) : m.serviceCommandArg()))
                .filter(a => !!a)
            if (params.length == 0) {
                if (fn) params.push(fn(undefined))
                else params.push(Buffer.create(bufSize))
            }
            return params
        }

        private emitSequance(
            rule: microcode.RuleDefn,
            lockvar: Variable,
            delay: number,
            bufSize = 0
        ) {
            const params = this.ruleParams(rule, bufSize)
            const actuator = rule.actuators[0]
            const wr = this.writer
            if (lockvar) lockvar.write(wr, literal(this.currRuleId))
            for (let i = 0; i < params.length; ++i) {
                const role = this.lookupActuatorRole(rule)
                this.emitLoadBuffer(params[i])
                this.emitSendCmd(role, actuator.serviceCommand)
                if (i != params.length - 1) {
                    this.emitSleep(delay)
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

        private lookupGlobal(n: string) {
            let g = this.globals.find(v => v.name == n)
            if (!g) g = this.addGlobal(n)
            return g
        }

        private pipeVar(id: number) {
            return this.lookupGlobal("pipe" + (id || 0))
        }

        private pipeRole(id: number) {
            return this.addOrGetRole("pipe_cond_" + id, SRV_JACSCRIPT_CONDITION)
        }

        private currValue() {
            return this.proc.lookupLocal("currVal")
        }

        emitSendCmd(r: Role, cmd: number) {
            this.writer.emitStmt(OpStmt.STMT2_SEND_CMD, [
                literal(r.index),
                literal(cmd),
            ])
        }

        private modExpr(mod: microcode.ModifierDefn) {
            const wr = this.writer
            switch (mod.jdKind) {
                case microcode.JdKind.Literal:
                    return literal(mod.jdParam)
                case microcode.JdKind.Variable:
                    return this.pipeVar(mod.jdParam).read(wr)
                case microcode.JdKind.Radio:
                    return this.lookupGlobal("radio").read(wr)
                default:
                    this.error("can't emit kind: " + mod.jdKind)
                    return literal(0)
            }
        }

        private constantFold(mods: microcode.ModifierDefn[], defl = 0) {
            if (mods.length == 0) return defl
            let v = 0
            for (const m of mods) {
                if (m.jdKind != microcode.JdKind.Literal) return undefined
                v += m.jdParam
            }
            return v
        }

        private emitAddSeq(
            mods: microcode.ModifierDefn[],
            target: Variable,
            defl: number = 0,
            clear = true
        ) {
            const wr = this.writer
            const addOrSet = (vv: Value) => {
                target.write(
                    wr,
                    clear
                        ? vv
                        : wr.emitExpr(OpExpr.EXPR2_ADD, [target.read(wr), vv])
                )
                clear = false
            }

            if (mods.length == 0) target.write(wr, literal(defl))
            else {
                if (mods[0].jdKind == microcode.JdKind.RandomToss) {
                    mods = mods.slice(1)
                    let rnd: Value
                    let folded = this.constantFold(mods, 5)
                    if (folded != undefined) {
                        if (folded <= 2) folded = 2
                        rnd = this.emitRandomInt(folded - 1)
                    } else {
                        const bndVar = this.proc.lookupLocal("rndBnd")
                        this.emitAddSeq(mods, bndVar, 5)
                        wr.emitIf(
                            // !(2<wr) == 2>=wr == wr<=2, but use negation because of 'bndVar' being possibly nan
                            wr.emitExpr(OpExpr.EXPR1_NOT, [
                                wr.emitExpr(OpExpr.EXPR2_LT, [
                                    literal(2),
                                    bndVar.read(wr),
                                ]),
                            ]),
                            () => {
                                bndVar.write(wr, literal(2))
                            }
                        )
                        rnd = wr.emitExpr(OpExpr.EXPR1_RANDOM_INT, [
                            this.emitAdd(bndVar.read(wr), -1),
                        ])
                    }
                    addOrSet(this.emitAdd(rnd, 1))
                } else {
                    const folded = this.constantFold(mods, defl)
                    if (folded != undefined) {
                        addOrSet(literal(folded))
                    } else {
                        for (let i = 0; i < mods.length; ++i)
                            addOrSet(this.modExpr(mods[i]))
                    }
                }
            }
        }

        private breaksValSeq(mod: microcode.ModifierDefn) {
            switch (mod.jdKind) {
                case microcode.JdKind.RandomToss:
                    return true
                default:
                    return false
            }
        }

        private emitValueOut(rule: microcode.RuleDefn, defl: number) {
            let currSeq: microcode.ModifierDefn[] = []
            let first = true

            for (const m of rule.modifiers) {
                if (m.category == "value_out" || m.category == "constant") {
                    if (this.breaksValSeq(m) && currSeq.length) {
                        this.emitAddSeq(currSeq, this.currValue(), 0, first)
                        currSeq = []
                        first = false
                    }
                    currSeq.push(m)
                }
            }

            if (currSeq.length) {
                this.emitAddSeq(currSeq, this.currValue(), 0, first)
                first = false
            }

            if (first) {
                this.currValue().write(this.writer, literal(defl))
            }
        }

        private getValueIn(rule: microcode.RuleDefn) {
            let v = undefined
            for (const m of rule.filters) {
                if (m.category == "value_in" || m.category == "constant") {
                    if (v === undefined) v = 0
                    v += m.jdParam
                }
            }
            return v
        }

        // 0-max inclusive
        private emitRandomInt(max: number) {
            if (max <= 0) return literal(0)
            return this.writer.emitExpr(OpExpr.EXPR1_RANDOM_INT, [literal(max)])
        }

        private emitAdd(a: Value, off: number) {
            if (a.op == OpExpr.EXPRx_LITERAL && a.numValue == 0)
                return literal(off)
            return this.writer.emitExpr(OpExpr.EXPR2_ADD, [a, literal(off)])
        }

        private emitRoleCommand(rule: microcode.RuleDefn) {
            const actuator = rule.actuators.length ? rule.actuators[0] : null
            const wr = this.writer
            if (actuator == null) return // do nothing
            if (actuator.tid == microcode.TID_ACTUATOR_PAINT) {
                this.emitSequance(rule, this.currAnimation, 400, 5)
            } else if (actuator.tid == microcode.TID_ACTUATOR_MUSIC) {
                this.emitSequance(rule, this.currMelody, 400, 6)
            } else if (actuator.tid == microcode.TID_ACTUATOR_SWITCH_PAGE) {
                let targetPage = 1
                for (const m of rule.modifiers)
                    if (m.category == "page") targetPage = m.jdParam

                wr.emitCall(this.pageProc(targetPage).index, [])
            } else if (actuator.jdKind == microcode.JdKind.Variable) {
                this.emitValueOut(rule, 1)
                const pv = this.pipeVar(actuator.jdParam)
                pv.write(wr, this.currValue().read(wr))
                this.emitSleep(ANTI_FREEZE_DELAY)
                this.emitSendCmd(
                    this.pipeRole(actuator.jdParam),
                    CMD_CONDITION_FIRE
                )
            } else if (actuator.jdKind == microcode.JdKind.Radio) {
                this.emitValueOut(rule, 1)
                wr.emitStmt(OpStmt.STMT2_SETUP_BUFFER, [literal(8), literal(0)])
                wr.emitStmt(OpStmt.STMT4_STORE_BUFFER, [
                    literal(NumFmt.F64),
                    literal(0),
                    literal(0),
                    this.currValue().read(wr),
                ])
                this.emitSendCmd(this.lookupActuatorRole(rule), 0x81)
            } else if (actuator.jdKind == microcode.JdKind.NumFmt) {
                this.emitValueOut(rule, 1)
                const fmt: NumFmt = actuator.jdParam
                const sz = bitSize(fmt) >> 3
                wr.emitStmt(OpStmt.STMT2_SETUP_BUFFER, [
                    literal(sz),
                    literal(0),
                ])
                wr.emitStmt(OpStmt.STMT4_STORE_BUFFER, [
                    literal(fmt),
                    literal(0),
                    literal(0),
                    this.currValue().read(wr),
                ])
                this.emitSendCmd(
                    this.lookupActuatorRole(rule),
                    actuator.serviceCommand
                )
            } else if (actuator.serviceArgFromModifier) {
                const role = this.lookupActuatorRole(rule)
                this.emitSequance(
                    rule,
                    actuator.jdKind == microcode.JdKind.Sequance
                        ? this.lookupGlobal("lock_" + role.name)
                        : null,
                    400
                )
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

        ifEq(v: Value, val: number, then: () => void) {
            const wr = this.writer
            wr.emitIf(wr.emitExpr(OpExpr.EXPR2_EQ, [v, literal(val)]), then)
        }

        private ifCurrPage(then: () => void) {
            this.ifEq(this.currPage.read(this.writer), this.currPageId, then)
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
                        this.emitSendCmd(
                            this.pageStartCondition,
                            CMD_CONDITION_FIRE
                        )
                        wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
                    })
            }
        }

        private emitRule(name: string, rule: microcode.RuleDefn) {
            const body = this.emitRuleActuator(name, rule)
            const emitBody = () =>
                this.writer.emitCall(body.index, [], OpCall.BG_MAX1)

            const filterValueIn = (f: () => Value) => {
                const v = this.getValueIn(rule)
                if (v !== undefined) {
                    this.ifEq(f(), v, emitBody)
                } else {
                    emitBody()
                }
            }

            if (
                rule.sensors[0] &&
                rule.sensors[0].tid == microcode.TID_SENSOR_TIMER
            ) {
                const timer = this.addProc(name + "_timer")
                let period = 0
                let randomPeriod = 0
                for (const m of rule.filters) {
                    if (typeof m.jdParam == "number") {
                        if (m.jdParam >= 0) period += m.jdParam
                        else randomPeriod += -m.jdParam
                    }
                }
                if (period == 0 && randomPeriod == 0) period = 1000 // reasonable default
                if (period == 0) period = ANTI_FREEZE_DELAY
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
                    const tm = this.emitAdd(
                        this.emitRandomInt(randomPeriod),
                        period
                    )
                    wr.emitStmt(OpStmt.STMT1_SLEEP_MS, [tm])
                    this.ifCurrPage(emitBody)
                    wr.emitJump(wr.top)
                })
                return
            }

            if (
                rule.sensors[0] &&
                rule.sensors[0].jdKind == microcode.JdKind.Variable
            ) {
                const pipeId = rule.sensors[0].jdParam
                const role = this.pipeRole(pipeId)
                this.withProcedure(role.getDispatcher(), wr => {
                    this.ifCurrPage(() => {
                        filterValueIn(() => this.pipeVar(pipeId).read(wr))
                    })
                })
                return
            }

            const role = this.lookupSensorRole(rule)
            name += "_" + role.name

            this.withProcedure(role.getDispatcher(), wr => {
                this.ifCurrPage(() => {
                    const code = this.lookupEventCode(role, rule)
                    if (
                        rule.sensors[0] &&
                        rule.sensors[0].serviceClassName == "radio"
                    ) {
                        const loadVal = () =>
                            wr.emitExpr(OpExpr.EXPR3_LOAD_BUFFER, [
                                literal(NumFmt.F64),
                                literal(12),
                                literal(0),
                            ])

                        this.ifEq(
                            wr.emitExpr(OpExpr.EXPR0_PKT_REPORT_CODE, []),
                            code,
                            () => filterValueIn(loadVal)
                        )
                    } else if (code != null) {
                        this.ifEq(
                            wr.emitExpr(OpExpr.EXPR0_PKT_EV_CODE, []),
                            code,
                            emitBody
                        )
                    } else if (
                        role.classIdentifier == SRV_JACSCRIPT_CONDITION
                    ) {
                        // event code not relevant
                        emitBody()
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

        emitSleep(ms: number) {
            this.writer.emitStmt(OpStmt.STMT1_SLEEP_MS, [literal(ms)])
        }

        private emitClearScreen() {
            const scr = this.lookupRole("dotMatrix", 0)
            this.emitLoadBuffer(hex`00 00 04 00 00`)
            this.emitSendCmd(scr, jacs.CMD_SET_REG | 0x2)
            this.emitSleep(50)
            this.emitLoadBuffer(hex`00 00 00 00 00`)
            this.emitSendCmd(scr, jacs.CMD_SET_REG | 0x2)
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

                const mic = this.lookupRole("soundLevel", 0)
                wr.emitIf(
                    wr.emitExpr(OpExpr.EXPR1_ROLE_IS_CONNECTED, [
                        literal(mic.index),
                    ]),
                    () => {
                        this.emitLogString("disable mic")
                        this.emitLoadBuffer(hex`00`)
                        this.emitSendCmd(mic, CMD_SET_REG | JD_REG_INTENSITY)
                    }
                )
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
            this.deploy()
        }

        private deploy() {
            if (this.hasErrors) {
                if (debugOut) this.printAssembly()
                console.error("errors; not deploying")
            } else {
                if (debugOut) this.printAssembly()
                const bin = this.serialize()
                if (debugOut) console.log(bin.toHex())
                jdc.deploy(bin)
            }
        }

        deploySound(name: string) {
            const mainProc = this.addProc("main")
            const r = this.lookupRole("soundPlayer", 0)
            this.withProcedure(mainProc, wr => {
                this.emitLoadBuffer(name)
                this.emitSendCmd(r, 0x80)
                wr.emitStmt(OpStmt.STMT1_SLEEP_S, [literal(100000)])
                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
            })
            mainProc.finalize()
            this.deploy()
        }

        deployFreq(buf: Buffer) {
            const mainProc = this.addProc("main")
            const r = this.lookupRole("buzzer", 0)
            this.withProcedure(mainProc, wr => {
                this.emitLoadBuffer(buf)
                this.emitSendCmd(r, 0x80)
                wr.emitStmt(OpStmt.STMT1_SLEEP_S, [literal(100000)])
                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
            })
            mainProc.finalize()
            this.deploy()
        }
    }

    export const needsWakeup = [0x14ad1a5d, 0x1f140409, 0x17dc9a1c]
    export const needsEnable = [0x1ac986cf]

    export const serviceClasses: SMap<number> = {
        // m:b
        button: 0x1473a263,
        dotMatrix: 0x110d154b,
        soundLevel: 0x14ad1a5d,
        temperature: 0x1421bac7,
        soundPlayer: 0x1403d338,
        buzzer: 0x1b57b1d7,
        accelerometer: 0x1f140409,
        radio: 0x1ac986cf,
        // Kit-A
        potentiometer: 0x1f274746,
        lightLevel: 0x17dc9a1c,
        magneticFieldLevel: 0x12fe180f,
        rotaryEncoder: 0x10fa29c9,
        led: 0x1609d4f0,
    }

    export const SRV_JACSCRIPT_CONDITION = 0x1196796d
    export const CMD_CONDITION_FIRE = 0x80

    export const CMD_GET_REG = 0x1000
    export const CMD_SET_REG = 0x2000

    export const JD_REG_STREAMING_SAMPLES = 3
    export const JD_REG_INTENSITY = 1

    // delay on sending stuff in pipes and changing pages
    export const ANTI_FREEZE_DELAY = 50
}
