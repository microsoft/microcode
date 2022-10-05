namespace jacs {
    export let debugOut = false

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

    export class Procedure {
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

        emit(wr: OpWriter) {
            return wr.emitExpr(Op.EXPRx_STATIC_ROLE, [literal(this.index)])
        }

        getDispatcher() {
            if (!this.dispatcher) {
                this.dispatcher = this.parent.addProc(this.name + "_disp")
                this.parent.withProcedure(this.dispatcher, wr => {
                    if (needsWakeup.indexOf(this.classIdentifier) >= 0) {
                        wr.emitStmt(Op.STMT3_QUERY_REG, [
                            this.emit(wr),
                            literal(JD_REG_STREAMING_SAMPLES),
                            literal(1000),
                        ])
                        this.parent.ifEq(
                            wr.emitExpr(Op.EXPR0_RET_VAL, []),
                            0,
                            () => {
                                this.parent.emitSetReg(
                                    this,
                                    JD_REG_STREAMING_SAMPLES,
                                    hex`0a`
                                )
                            }
                        )
                    }
                    if (needsEnable.indexOf(this.classIdentifier) >= 0) {
                        this.parent.emitSetReg(this, JD_REG_INTENSITY, hex`01`)
                        if (this.classIdentifier == serviceClasses["radio"]) {
                            // set group to 1
                            this.parent.emitSetReg(this, 0x80, hex`01`)
                        }
                    }
                    this.top = wr.mkLabel("tp")
                    wr.emitLabel(this.top)
                    wr.emitStmt(Op.STMT1_WAIT_ROLE, [this.emit(wr)])
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
        roleLocks: Variable[] = []
        currPage: Variable
        currRuleId = 0
        currPageId = 0
        pageProcs: Procedure[] = []
        stopPage: Procedure

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

        emitString(str: string | Buffer) {
            return this.writer.emitExpr(Op.EXPRx_STATIC_BUFFER, [
                literal(this.addString(str)),
            ])
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

            for (const s of [
                funDesc,
                funData,
                floatData,
                roleData,
                strDesc,
                strData,
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
                for (const g of this.globals)
                    if (g.name[0] == "z" && g.name[1] == "_") {
                        g.write(wr, literal(0))
                    }
                this.emitClearScreen()
                wr.emitCall(this.pageProc(1).index, [])
                wr.emitStmt(Op.STMT1_RETURN, [literal(0)])
            })
            this.withProcedure(this.stopPage, wr => {
                for (const v of this.roleLocks) {
                    wr.emitStmt(Op.STMT1_TERMINATE_FIBER, [v.read(wr)])
                    v.write(wr, literal(null))
                }
                wr.emitStmt(Op.STMT1_RETURN, [literal(0)])
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
            if (!sensor.serviceClassName) this.error(`can't emit ${sensor.tid}`)
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

        emitSetReg(role: Role, reg: number, buf: string | Buffer) {
            this.emitLoadBuffer(buf)
            this.emitSendCmd(role, CMD_SET_REG | reg)
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
            wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, [literal(len)])
            wr.emitStmt(Op.STMT2_SET_PKT, [this.emitString(buf), literal(0)])
        }

        private emitExtSequance(rule: microcode.RuleDefn) {
            let params = this.baseModifiers(rule).filter(m => !!m.jdExtFun)
            if (params.length == 0) {
                const defl = rule.actuators[0].jdParam as microcode.ModifierDefn
                if (defl instanceof microcode.ModifierDefn) params = [defl]
                else throw "oops"
            }

            const wr = this.writer
            const role = this.lookupActuatorRole(rule)
            this.emitLockCode(role)
            for (let i = 0; i < params.length; ++i) {
                const args = [role.emit(wr)]
                if (typeof params[i].jdParam == "number")
                    args.push(literal(params[i].jdParam))
                this.callLinked(params[i].jdExtFun, args)
            }
        }

        private callLinked(name: string, parms: Value[]) {
            const proc = linkFunction(this, name)
            const args = this.writer.allocTmpLocals(parms.length)
            for (let i = 0; i < parms.length; ++i) args[i].store(parms[i])
            this.writer.emitCall(proc.index, args)
        }

        private emitLockCode(role: Role) {
            const v = this.lookupGlobal(role.name + "_lock")
            if (this.roleLocks.indexOf(v) < 0) this.roleLocks.push(v)
            const wr = this.writer
            wr.emitStmt(Op.STMT1_TERMINATE_FIBER, [v.read(wr)])
            v.write(wr, wr.emitExpr(Op.EXPR1_GET_FIBER_HANDLE, [literal(null)]))
        }

        private emitSequance(
            rule: microcode.RuleDefn,
            delay: number,
            bufSize = 0,
            shortCutFn = ""
        ) {
            let params = this.baseModifiers(rule).filter(
                m => !!m.serviceCommandArg()
            )
            if (params.length == 0) {
                const defl = rule.actuators[0].jdParam as microcode.ModifierDefn
                if (defl instanceof microcode.ModifierDefn) params = [defl]
                else {
                    const tile = new microcode.ModifierDefn("", "", 0)
                    tile.jdParam = Buffer.create(bufSize)
                }
            }

            const actuator = rule.actuators[0]
            const role = this.lookupActuatorRole(rule)
            this.emitLockCode(role)

            const wr = this.writer
            if (shortCutFn && params.length > 1) {
                const b = Buffer.create(bufSize * params.length)
                for (let i = 0; i < params.length; ++i) {
                    b.write(
                        i * bufSize,
                        params[i].serviceCommandArg() as Buffer
                    )
                }
                this.callLinked(shortCutFn, [
                    role.emit(wr),
                    this.emitString(b),
                    literal(params[0].jdDuration || delay),
                ])
            } else {
                for (let i = 0; i < params.length; ++i) {
                    this.emitLoadBuffer(params[i].serviceCommandArg())
                    this.emitSendCmd(role, actuator.serviceCommand)
                    this.emitSleep(params[i].jdDuration || delay)
                }
            }
        }

        private lookupGlobal(n: string) {
            let g = this.globals.find(v => v.name == n)
            if (!g) g = this.addGlobal(n)
            return g
        }

        private pipeVar(id: number) {
            return this.lookupGlobal("z_pipe" + (id || 0))
        }

        private pipeRole(id: number) {
            return this.addOrGetRole("pipe_cond_" + id, SRV_JACSCRIPT_CONDITION)
        }

        private currValue() {
            return this.proc.lookupLocal("currVal")
        }

        emitSendCmd(r: Role, cmd: number) {
            this.writer.emitStmt(Op.STMT2_SEND_CMD, [
                r.emit(this.writer),
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
                    return this.lookupGlobal("z_radio").read(wr)
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
                        : wr.emitExpr(Op.EXPR2_ADD, [target.read(wr), vv])
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
                            wr.emitExpr(Op.EXPR1_NOT, [
                                wr.emitExpr(Op.EXPR2_LT, [
                                    literal(2),
                                    bndVar.read(wr),
                                ]),
                            ]),
                            () => {
                                bndVar.write(wr, literal(2))
                            }
                        )
                        rnd = wr.emitExpr(Op.EXPR1_RANDOM_INT, [
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

        private emitValue(
            trg: Variable,
            modifiers: microcode.ModifierDefn[],
            defl: number
        ) {
            let currSeq: microcode.ModifierDefn[] = []
            let first = true

            for (const m of modifiers) {
                if (m.category == "value_out" || m.category == "constant") {
                    if (this.breaksValSeq(m) && currSeq.length) {
                        this.emitAddSeq(currSeq, trg, 0, first)
                        currSeq = []
                        first = false
                    }
                    currSeq.push(m)
                }
            }

            if (currSeq.length) {
                this.emitAddSeq(currSeq, trg, 0, first)
                first = false
            }

            if (first) trg.write(this.writer, literal(defl))
        }

        private baseModifiers(rule: microcode.RuleDefn) {
            let modifiers = rule.modifiers
            for (let i = 0; i < modifiers.length; ++i)
                if (modifiers[i].jdKind == microcode.JdKind.Loop)
                    return modifiers.slice(0, i)
            return modifiers
        }

        private emitValueOut(rule: microcode.RuleDefn, defl: number) {
            this.emitValue(this.currValue(), this.baseModifiers(rule), defl)
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
            return this.writer.emitExpr(Op.EXPR1_RANDOM_INT, [literal(max)])
        }

        private emitAdd(a: Value, off: number) {
            if (a.op == Op.EXPRx_LITERAL && a.numValue == 0) return literal(off)
            return this.writer.emitExpr(Op.EXPR2_ADD, [a, literal(off)])
        }

        private loopModifierIdx(rule: microcode.RuleDefn) {
            for (let i = 0; i < rule.modifiers.length; ++i) {
                if (rule.modifiers[i].jdKind == microcode.JdKind.Loop) return i
            }
            return -1
        }

        private emitPossibleLoop(rule: microcode.RuleDefn) {
            const idx = this.loopModifierIdx(rule)
            if (idx < 0) return
            const args = rule.modifiers.slice(idx + 1)
            const bound = this.proc.lookupLocal("loopBnd")
            const index = this.proc.lookupLocal("loopIdx")
            // TODO Inf not yet supporter in JacsVM
            if (args.length) this.emitValue(bound, args, Infinity)
            const wr = this.writer
            this.emitSleep(ANTI_FREEZE_DELAY)
            if (args.length) {
                index.write(wr, this.emitAdd(index.read(wr), 1))
                wr.emitJumpIfTrue(
                    wr.top,
                    wr.emitExpr(Op.EXPR2_LT, [index.read(wr), bound.read(wr)])
                )
            } else {
                wr.emitJump(wr.top)
            }
            const bodyProc = this.proc
            this.withProcedure(this.stopPage, () => {
                this.ifCurrPage(() => {
                    this.terminateProc(bodyProc)
                })
            })
        }

        private emitRoleCommand(rule: microcode.RuleDefn) {
            const actuator = rule.actuators.length ? rule.actuators[0] : null
            const wr = this.writer
            const currValue = () => this.currValue().read(wr)
            if (actuator == null) return // do nothing

            if (actuator.tid == microcode.TID_ACTUATOR_PAINT) {
                this.emitSequance(rule, 400, 5, "dot_animation")
            } else if (actuator.tid == microcode.TID_ACTUATOR_MUSIC) {
                this.emitSequance(rule, 400, 6)
            } else if (actuator.tid == microcode.TID_ACTUATOR_SWITCH_PAGE) {
                let targetPage = 1
                for (const m of rule.modifiers)
                    if (m.category == "page") targetPage = m.jdParam
                wr.emitCall(this.pageProc(targetPage).index, [])
            } else if (actuator.jdKind == microcode.JdKind.Variable) {
                this.emitSleep(ANTI_FREEZE_DELAY)
                this.emitValueOut(rule, 1)
                const pv = this.pipeVar(actuator.jdParam)
                pv.write(wr, currValue())
                this.emitSendCmd(
                    this.pipeRole(actuator.jdParam),
                    CMD_CONDITION_FIRE
                )
            } else if (actuator.jdKind == microcode.JdKind.Radio) {
                this.emitValueOut(rule, 1)
                wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, [literal(8)])
                wr.emitBufStore(currValue(), NumFmt.F64, 0)
                this.emitSendCmd(this.lookupActuatorRole(rule), 0x81)
            } else if (actuator.jdKind == microcode.JdKind.NumFmt) {
                this.emitValueOut(rule, 1)
                const fmt: NumFmt = actuator.jdParam
                const sz = bitSize(fmt) >> 3
                wr.emitStmt(Op.STMT1_SETUP_PKT_BUFFER, [literal(sz)])
                if (actuator.tid == microcode.TID_MODIFIER_SERVO_SET_ANGLE) {
                    // TODO no modulo yet in Jacs
                    // if (curr >= 12) { curr -= 12 }
                    wr.emitIf(
                        wr.emitExpr(Op.EXPR2_LE, [literal(12), currValue()]),
                        () => {
                            this.currValue().write(
                                wr,
                                wr.emitExpr(Op.EXPR2_SUB, [
                                    currValue(),
                                    literal(12),
                                ])
                            )
                        }
                    )
                    // curr = curr * ((360/12) << 16)
                    this.currValue().write(
                        wr,
                        wr.emitExpr(Op.EXPR2_MUL, [
                            currValue(),
                            literal((360 / 12) << 16),
                        ])
                    )
                }
                wr.emitBufStore(currValue(), fmt, 0)
                this.emitSendCmd(
                    this.lookupActuatorRole(rule),
                    actuator.serviceCommand
                )
            } else if (actuator.jdKind == microcode.JdKind.Sequence) {
                this.emitSequance(rule, 400)
            } else if (actuator.jdKind == microcode.JdKind.ExtLib) {
                this.emitExtSequance(rule)
            } else {
                this.error(`can't map act role for ${JSON.stringify(actuator)}`)
            }

            this.emitPossibleLoop(rule)
        }

        private emitRuleActuator(name: string, rule: microcode.RuleDefn) {
            const body = this.addProc(name)
            this.withProcedure(body, wr => {
                this.emitRoleCommand(rule)
                wr.emitStmt(Op.STMT1_RETURN, [literal(0)])
            })
            return body
        }

        ifEq(v: Value, val: number, then: () => void) {
            const wr = this.writer
            wr.emitIf(wr.emitExpr(Op.EXPR2_EQ, [v, literal(val)]), then)
        }

        private ifCurrPage(then: () => void) {
            this.ifEq(this.currPage.read(this.writer), this.currPageId, then)
        }

        private pageProc(pageIdx: number) {
            if (!this.pageProcs[pageIdx]) {
                this.pageProcs[pageIdx] = this.addProc("startPage" + pageIdx)
                this.withProcedure(this.pageProcs[pageIdx], wr => {
                    // first stop the current page
                    wr.emitCall(this.stopPage.index, [])
                    // wait a bit
                    this.emitSleep(ANTI_FREEZE_DELAY)
                    // and switch to the new page
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
                        wr.emitStmt(Op.STMT1_RETURN, [literal(0)])
                    })
            }
        }

        private terminateProc(proc: Procedure) {
            const wr = this.writer
            wr.emitStmt(Op.STMT1_TERMINATE_FIBER, [
                wr.emitExpr(Op.EXPR1_GET_FIBER_HANDLE, [
                    wr.emitExpr(Op.EXPRx_STATIC_FUNCTION, [
                        literal(proc.index),
                    ]),
                ]),
            ])
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
                    this.terminateProc(timer)
                    // then start a new one
                    wr.emitCall(timer.index, [], OpCall.BG_MAX1)
                })
                this.withProcedure(timer, wr => {
                    const tm = this.emitAdd(
                        this.emitRandomInt(randomPeriod),
                        period
                    )
                    wr.emitStmt(Op.STMT1_SLEEP_MS, [tm])
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
                        const loadVal = () => wr.emitBufLoad(NumFmt.F64, 12)
                        this.ifEq(
                            wr.emitExpr(Op.EXPR0_PKT_REPORT_CODE, []),
                            code,
                            () => filterValueIn(loadVal)
                        )
                    } else if (code != null) {
                        this.ifEq(
                            wr.emitExpr(Op.EXPR0_PKT_EV_CODE, []),
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

        emitLogString(str: string, arg?: Value) {
            let local: Variable
            if (arg) {
                local = this.proc.lookupLocal("logarg")
                local.write(this.writer, arg)
            }
            this.writer.emitStmt(Op.STMTx2_LOG_FORMAT, [
                literal(local ? local.index : 0),
                literal(local ? 1 : 0),
                this.emitString(str),
            ])
        }

        emitSleep(ms: number) {
            this.writer.emitStmt(Op.STMT1_SLEEP_MS, [literal(ms)])
        }

        private emitClearScreen() {
            const loading_anim = hex`
                0001000000
                0000010000
                0000000100
                0000000002
                0000000004
                0000000008
                0000001000
                0000100000
                0010000000
                0800000000
                0400000000
                0200000000
                0000000000
            `
            const scr = this.lookupRole("dotMatrix", 0)
            this.callLinked("dot_animation", [
                scr.emit(this.writer),
                this.emitString(loading_anim),
                literal(30),
            ])
        }

        emitProgram(prog: microcode.ProgramDefn) {
            this.currPage = this.addGlobal("page")

            this.pageStartCondition = this.addRole(
                "pageStart",
                SRV_JACSCRIPT_CONDITION
            )

            // first add the main proc - proc #0 is the entry point
            const mainProc = this.addProc("main")

            // add any other static procs...
            this.stopPage = this.addProc("stopPage")

            // generate startup code
            this.withProcedure(mainProc, wr => {
                this.emitLogString("MicroCode start!")

                const mic = this.lookupRole("soundLevel", 0)
                wr.emitIf(
                    wr.emitExpr(Op.EXPR1_ROLE_IS_CONNECTED, [mic.emit(wr)]),
                    () => {
                        this.emitSetReg(mic, JD_REG_INTENSITY, hex`00`)
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
                wr.emitStmt(Op.STMT1_SLEEP_S, [literal(100000)])
                wr.emitStmt(Op.STMT1_RETURN, [literal(0)])
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
                wr.emitStmt(Op.STMT1_SLEEP_S, [literal(100000)])
                wr.emitStmt(Op.STMT1_RETURN, [literal(0)])
            })
            mainProc.finalize()
            this.deploy()
        }
    }

    export const needsWakeup = [0x14ad1a5d, 0x1f140409, 0x17dc9a1c]
    export const needsEnable = [0x1ac986cf, 0x12fc9103]

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
        // Others
        servo: 0x12fc9103,
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
