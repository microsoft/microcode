namespace jacs {
    export function assert(cond: boolean, msg?: string) {
        if (!cond) {
            if (msg == null) msg = "Assertion failed"
            throw msg
        }
    }

    export function write32(buf: Buffer, pos: number, v: number) {
        buf.setNumber(NumberFormat.UInt32LE, pos, v)
    }

    export function read32(buf: Buffer, pos: number) {
        return buf.getNumber(NumberFormat.UInt32LE, pos)
    }

    export function write16(buf: Buffer, pos: number, v: number) {
        buf.setNumber(NumberFormat.UInt16LE, pos, v)
    }

    export function assertRange(
        min: number,
        v: number,
        max: number,
        desc?: string
    ) {
        if (min <= v && v <= max) return
        throw `${desc || "value"}=${v} out of range [${min}, ${max}]`
    }

    export function oops(msg: string): never {
        throw msg
    }

    export interface TopOpWriter extends InstrArgResolver {
        addString(s: string): number
        addFloat(f: number): number
        writer: OpWriter
        hasErrors: boolean
    }

    export class Label {
        uses: number[]
        offset = -1
        constructor(public name: string) {}
    }

    const VF_DEPTH_MASK = 0xff
    const VF_USES_STATE = 0x100
    const VF_HAS_PARENT = 0x200
    const VF_IS_LITERAL = 0x400
    const VF_IS_MEMREF = 0x800
    const VF_IS_STRING = 0x1000
    const VF_IS_WRITTEN = 0x2000

    export class Value {
        op: number
        flags: number
        args: Value[]
        numValue: number
        _userdata: {}
        _cachedValue: CachedValue

        constructor() {}
        get maxstack() {
            return (this.flags & VF_DEPTH_MASK) + 1
        }
        get usesState() {
            return !!(this.flags & VF_USES_STATE)
        }
        get hasParent() {
            return !!(this.flags & VF_HAS_PARENT)
        }
        get isLiteral() {
            return !!(this.flags & VF_IS_LITERAL)
        }
        get isMemRef() {
            return !!(this.flags & VF_IS_MEMREF)
        }
        adopt() {
            assert(!(this.flags & VF_HAS_PARENT))
            this.flags |= VF_HAS_PARENT
        }

        _set(src: Value) {
            if (!this._userdata) this._userdata = src._userdata
            this.op = src.op
            this.flags = src.flags
            this.args = src.args
            this.numValue = src.numValue
            this._cachedValue = src._cachedValue
        }
    }

    export class CachedValue {
        numrefs = 1
        constructor(public parent: OpWriter, public index: number) {}
        emit() {
            assert(this.numrefs > 0)
            const r = new Value()
            r.numValue = this.index
            r.op = Op.EXPRx_LOAD_LOCAL
            r.flags = VF_IS_MEMREF // not "using state" - it's temporary
            r._cachedValue = this
            this.numrefs++
            return r
        }
        store(v: Value) {
            assert(this.numrefs > 0)
            this.parent.emitStmt(Op.STMTx1_STORE_LOCAL, [
                literal(this.index),
                v,
            ])
        }
        _decr() {
            assert(this.numrefs > 0)
            if (--this.numrefs == 0) {
                assert(this.parent.cachedValues[this.index] == this)
                this.parent.cachedValues[this.index] = null
                this.index = null
            }
        }
        free() {
            this._decr()
        }
    }

    export function literal(v: number) {
        const r = new Value()
        r.numValue = v
        r.op = Op.EXPRx_LITERAL
        r.flags = VF_IS_LITERAL
        return r
    }

    export function nonEmittable(k: number) {
        const r = new Value()
        assert(k >= 0x100)
        r.op = k
        return r
    }

    class Comment {
        constructor(public offset: number, public comment: string) {}
    }

    export const LOCAL_OFFSET = 100

    export class OpWriter {
        private binary: Buffer
        private binPtr: number = 0
        private labels: Label[] = []
        private comments: Comment[] = []
        private bufferAllocated = false
        pendingStatefulValues: Value[] = []
        localOffsets: number[] = []
        cachedValues: CachedValue[] = []
        top: Label
        ret: Label
        private lineNo = -1
        private lineNoStart = -1
        desc = Buffer.create(BinFmt.FUNCTION_HEADER_SIZE)
        offsetInFuncs = -1
        private maxRegs = 0
        srcmap: number[] = []
        private nameIdx: number

        constructor(
            private prog: TopOpWriter,
            public name: string,
            public fnidx: number
        ) {
            this.top = this.mkLabel("top")
            this.emitLabel(this.top)
            this.binary = Buffer.create(128)
            this.nameIdx = this.prog.addString(this.name)
        }

        assertCurrent() {
            assert(this.prog.writer == this)
        }

        serialize() {
            while (this.location() & 3) this.writeByte(0)
            return this.binary.slice(0, this.binPtr)
        }

        finalizeDesc(off: number, numlocals: number, numargs: number) {
            const flags = 0
            const buf = Buffer.create(4 * 4)
            write32(buf, 0, off)
            write32(buf, 4, this.location())
            write16(buf, 8, numlocals + this.cachedValues.length)
            buf[10] = this.maxRegs | (numargs << 4)
            buf[11] = flags
            write16(buf, 12, this.nameIdx)
            this.desc.write(0, buf)
        }

        emitDbg(msg: string) {
            this.emitComment(msg)
        }

        _forceFinStmt() {
            if (this.lineNo < 0) return
            const len = this.location() - this.lineNoStart
            if (len) {
                this.srcmap.push(this.lineNo)
                this.srcmap.push(this.lineNoStart)
                this.srcmap.push(len)
            }
        }

        stmtStart(lineNo: number) {
            if (this.lineNo == lineNo) return
            this._forceFinStmt()
            this.lineNo = lineNo
            this.lineNoStart = this.location()
        }

        allocTmpLocals(num: number) {
            let run = 0
            let runStart = 0
            for (let i = 0; i < this.cachedValues.length; ++i) {
                if (this.cachedValues[i] == null) run++
                else {
                    run = 0
                    runStart = i + 1
                }
                if (run >= num) break
            }
            while (run < num) {
                this.cachedValues.push(null)
                run++
            }
            for (let i = 0; i < num; ++i) {
                assert(this.cachedValues[runStart + i] === null) // not undefined
                this.cachedValues[runStart + i] = new CachedValue(
                    this,
                    runStart + i
                )
            }
            return this.cachedValues.slice(runStart, runStart + num)
        }

        allocTmpLocal() {
            // TODO optimize?
            return this.allocTmpLocals(1)[0]
        }

        cacheValue(v: Value) {
            const t = this.allocTmpLocal()
            t.store(v)
            return t
        }

        stmtEnd() {
            this.assertNoTemps()
        }

        allocBuf(): Value {
            assert(!this.bufferAllocated, "allocBuf() not free")
            this.bufferAllocated = true
            return nonEmittable(CellKind.JD_CURR_BUFFER)
        }

        freeBuf(): void {
            assert(this.bufferAllocated, "freeBuf() already free")
            this.bufferAllocated = false
        }

        emitString(s: string) {
            const v = literal(this.prog.addString(s))
            v.flags |= VF_IS_STRING
            return v
        }

        emitCall(procIdx: number, args: CachedValue[], op = OpCall.SYNC) {
            const proc = literal(procIdx)
            const localidx = literal(args[0] ? args[0].index : 0)
            const numargs = literal(args.length)

            if (op == OpCall.SYNC)
                this.emitStmt(Op.STMTx2_CALL, [localidx, numargs, proc])
            else
                this.emitStmt(Op.STMTx3_CALL_BG, [
                    localidx,
                    numargs,
                    proc,
                    literal(op),
                ])
            for (const c of args) c.free()
        }

        emitBufLoad(fmt: NumFmt, off: number, buf?: Value) {
            if (!buf) buf = this.emitExpr(Op.EXPR0_PKT_BUFFER, [])
            return this.emitExpr(Op.EXPR3_LOAD_BUFFER, [
                buf,
                literal(fmt),
                literal(off),
            ])
        }

        emitBufStore(src: Value, fmt: NumFmt, off: number, buf?: Value) {
            if (!buf) buf = this.emitExpr(Op.EXPR0_PKT_BUFFER, [])
            this.emitStmt(Op.STMT4_STORE_BUFFER, [
                buf,
                literal(fmt),
                literal(off),
                src,
            ])
        }

        getAssembly() {
            let res = `proc ${this.name}_F${this.fnidx}:\n`
            let ptr = 0
            let commentPtr = 0
            const getbyte = () => {
                if (ptr < this.binPtr) return this.binary[ptr++]
                return 0
            }

            while (ptr < this.binPtr) {
                while (commentPtr < this.comments.length) {
                    const c = this.comments[commentPtr]
                    if (c.offset > ptr) break
                    commentPtr++
                    res += "; " + c.comment.replaceAll("\n", "\n; ") + "\n"
                }
                this.prog.resolverPC = ptr
                res += stringifyInstr(getbyte, this.prog) + "\n"
            }

            if (ptr > this.binPtr) res += "!!! binary mis-alignment\n"

            return res
        }

        emitComment(msg: string) {
            this.comments.push(new Comment(this.location(), msg))
        }

        mkLabel(name: string) {
            const l = new Label(name)
            this.labels.push(l)
            return l
        }

        _setLabelOffset(l: Label, off: number) {
            l.offset = off
            if (l.uses) {
                for (const u of l.uses) {
                    const v = l.offset - u
                    assert(v >= 0)
                    assert(v <= 0xffff)
                    this.binary[u + 2] = v >> 8
                    this.binary[u + 3] = v & 0xff
                }
                l.uses = undefined
            }
        }

        emitLabel(l: Label) {
            assert(l.offset == -1)
            this._setLabelOffset(l, this.location())
        }

        emitIf(reg: Value, thenBody: () => void, elseBody?: () => void) {
            if (elseBody) {
                const endIf = this.mkLabel("endif")
                const elseIf = this.mkLabel("elseif")
                this.emitJump(elseIf, reg)
                thenBody()
                this.emitJump(endIf)
                this.emitLabel(elseIf)
                elseBody()
                this.emitLabel(endIf)
            } else {
                const skipIf = this.mkLabel("skipif")
                this.emitJump(skipIf, reg)
                thenBody()
                this.emitLabel(skipIf)
            }
        }

        emitJumpIfTrue(label: Label, cond: Value) {
            return this.emitJump(label, this.emitExpr(Op.EXPR1_NOT, [cond]))
        }

        emitJump(label: Label, cond?: Value) {
            if (cond) cond.adopt()
            this.spillAllStateful()

            if (cond) this.writeValue(cond)

            const off0 = this.location()
            this.writeByte(cond ? Op.STMTx1_JMP_Z : Op.STMTx_JMP)

            if (label.offset != -1) {
                this.writeInt(label.offset - off0)
            } else {
                if (!label.uses) label.uses = []
                label.uses.push(off0)
                this.writeInt(0x1000)
            }
        }

        private oops(msg: string) {
            try {
                console.log(this.getAssembly())
            } catch {}
            oops(msg)
        }

        assertNoTemps() {
            if (this.prog.hasErrors) return
            for (const c of this.cachedValues) {
                if (c !== null) {
                    this.oops(`local ${c.index} still has ${c.numrefs} refs`)
                }
            }

            for (const e of this.pendingStatefulValues) {
                if (e.usesState && !e.hasParent)
                    this.oops("pending stateful values")
            }
        }

        patchLabels() {
            // we now patch at emit
            for (const l of this.labels) {
                if (l.uses) this.oops(`label ${l.name} not resolved`)
            }

            this.assertNoTemps()

            // patch local indices
            for (const off of this.localOffsets) {
                assert(
                    LOCAL_OFFSET <= this.binary[off] && this.binary[off] < 0xf8
                )
                this.binary[off] =
                    this.binary[off] - LOCAL_OFFSET + this.cachedValues.length
            }
            this.localOffsets = []
        }

        private spillValue(v: Value) {
            const l = this.allocTmpLocal()
            l.store(v)
            v._set(l.emit())
            l.free()
        }

        private spillAllStateful() {
            for (const e of this.pendingStatefulValues) {
                if (e.usesState && !e.hasParent) this.spillValue(e)
            }
            this.pendingStatefulValues = []
        }

        emitMemRef(op: Op, idx: number) {
            const r = new Value()
            r.numValue = idx
            r.op = op
            r.flags = VF_IS_MEMREF | VF_USES_STATE
            this.pendingStatefulValues.push(r)
            return r
        }

        emitExpr(op: Op, args: Value[]) {
            const n = opNumArgs(op)
            if (n != args.length)
                oops(`expr ${op} requires ${n}; got ${args.length}`)

            let stack = 0
            let maxstack = 1
            let usesState = exprIsStateful(op)
            // TODO constant folding
            for (const a of args) {
                if (stack + a.maxstack >= BinFmt.MAX_STACK_DEPTH)
                    this.spillValue(a)
                maxstack = Math.max(maxstack, stack + a.maxstack)
                stack++
                if (a.usesState) usesState = true
                assert(!(a.flags & VF_HAS_PARENT))
                a.flags |= VF_HAS_PARENT
            }
            const r = new Value()
            r.args = args
            r.op = op
            r.flags = maxstack - 1 // so that r.maxstack == maxstack
            if (usesState) {
                r.flags |= VF_USES_STATE
                this.pendingStatefulValues.push(r)
            }
            return r
        }

        location() {
            return this.binPtr
        }

        private writeByte(v: number) {
            assert(0 <= v && v <= 0xff && (v | 0) == v)
            if (this.binPtr >= this.binary.length) {
                const copy = Buffer.create(this.binary.length * 2)
                copy.write(0, this.binary)
                this.binary = copy
            }
            this.binary[this.binPtr++] = v
        }

        private writeInt(v: number) {
            assert((v | 0) == v)
            if (0 <= v && v < 0xf8) this.writeByte(v)
            else {
                let b = 0xf8
                if (v < 0) {
                    b |= 4
                    v = -v
                }
                let hddone = false
                for (let shift = 3; shift >= 0; shift--) {
                    const q = (v >> (8 * shift)) & 0xff
                    if (q && !hddone) {
                        this.writeByte(b | shift)
                        hddone = true
                    }
                    if (hddone) this.writeByte(q)
                }
            }
        }

        private writeArgs(op: Op, args: Value[]) {
            let i = 0
            if (opTakesNumber(op)) i = 1
            while (i < args.length) {
                this.writeValue(args[i])
                i++
            }
            this.writeByte(op)
            if (opTakesNumber(op)) {
                assert(args[0].isLiteral)
                const nval = args[0].numValue
                if (op == Op.STMTx1_STORE_LOCAL && nval >= LOCAL_OFFSET)
                    this.localOffsets.push(this.location())
                this.writeInt(nval)
            }
        }

        private writeValue(v: Value) {
            assert(!(v.flags & VF_IS_WRITTEN))
            v.flags |= VF_IS_WRITTEN
            if (v.isLiteral) {
                const q = v.numValue
                if ((q | 0) == q) {
                    const qq =
                        q + BinFmt.DIRECT_CONST_OFFSET + BinFmt.DIRECT_CONST_OP
                    if (BinFmt.DIRECT_CONST_OFFSET <= qq && qq <= 0xff)
                        this.writeByte(qq)
                    else {
                        this.writeByte(Op.EXPRx_LITERAL)
                        this.writeInt(q)
                    }
                } else if (isNaN(q)) {
                    this.writeByte(Op.EXPR0_NAN)
                } else {
                    const idx = this.prog.addFloat(q)
                    this.writeByte(Op.EXPRx_LITERAL_F64)
                    this.writeInt(idx)
                }
            } else if (v.isMemRef) {
                assert(opTakesNumber(v.op))
                this.writeByte(v.op)
                if (v.op == Op.EXPRx_LOAD_LOCAL && v.numValue >= LOCAL_OFFSET)
                    this.localOffsets.push(this.location())
                this.writeInt(v.numValue)
                if (v._cachedValue) v._cachedValue._decr()
            } else if (v.op >= 0x100) {
                oops("this value cannot be emitted: " + v.op.toString())
            } else {
                this.writeArgs(v.op, v.args)
            }
        }

        emitStmt(op: Op, args: Value[]) {
            assert(opNumArgs(op) == args.length)
            assert(opIsStmt(op))
            for (const a of args) a.adopt()
            this.spillAllStateful() // this doesn't spill adopt()'ed Value's (our arguments)
            this.writeArgs(op, args)
        }
    }

    export class SectionWriter {
        offset = -1
        currSize = 0
        data: Buffer[] = []
        desc = Buffer.create(BinFmt.SECTION_HEADER_SIZE)

        constructor(public size?: number) {
            if (this.size == null) this.size = -1
        }

        finalize(off: number) {
            assert(this.offset == -1 || this.offset == off)
            this.offset = off
            if (this.size == -1) this.size = this.currSize
            assert(this.size == this.currSize)
            assert((this.offset & 3) == 0)
            assert((this.size & 3) == 0)
            write32(this.desc, 0, this.offset)
            write32(this.desc, 4, this.size)
        }

        align() {
            while (this.currSize & 3) this.append(Buffer.create(1))
        }

        append(buf: Buffer) {
            this.data.push(buf)
            this.currSize += buf.length
            if (this.size >= 0) assertRange(0, this.currSize, this.size)
        }
    }

    export class DelayedCodeSection {
        startLabel: Label
        returnLabel: Label
        body: ((wr: OpWriter) => void)[] = []

        constructor(public name: string, public parent: OpWriter) {}

        empty() {
            return this.body.length == 0
        }

        emit(f: (wr: OpWriter) => void) {
            this.body.push(f)
        }

        callHere() {
            const wr = this.parent
            this.startLabel = wr.mkLabel(this.name + "Start")
            this.returnLabel = wr.mkLabel(this.name + "Ret")
            wr.emitJump(this.startLabel)
            wr.emitLabel(this.returnLabel)
        }

        finalizeRaw() {
            this.parent.assertCurrent()
            const wr = this.parent
            for (const b of this.body) b(wr)
        }

        finalize() {
            if (this.empty()) {
                this.parent._setLabelOffset(
                    this.startLabel,
                    this.returnLabel.offset
                )
                return
            }
            const wr = this.parent
            wr.emitLabel(this.startLabel)
            this.finalizeRaw()
            wr.emitJump(this.returnLabel)
        }
    }
}
