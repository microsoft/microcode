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
    }

    class Procedure {
        writer: OpWriter
        locals: Variable[] = []
        params: Variable[] = []
        constructor(private parent: TopWriter, public name: string) {
            this.writer = new OpWriter(this.parent, this.name)
        }
        finalize() {
            this.writer.patchLabels()
        }
        toString() {
            return this.writer.getAssembly()
        }
    }

    class Role {
        stringIndex: number

        constructor(private parent: TopWriter, public classIdentifier: number, public name: string) {
            this.stringIndex = this.parent.addString(this.name)
        }

        serialize() {
            const r = Buffer.create(BinFmt.RoleHeaderSize)
            write32(r, 0, this.classIdentifier)
            write16(r, 4, this.stringIndex)
            return r
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

        constructor() { }

        addString(str: string) {
            return addUnique(this.stringLiterals, str)
        }

        addFloat(f: number): number {
            return addUnique(this.floatLiterals, f)
        }

        describeCell(t: CellKind, idx: number): string {
            switch (t) {
                case CellKind.FLOAT_CONST:
                    return this.floatLiterals[idx] + ""
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
            hd.write(0,
                Buffer.pack("IIIH", [
                    BinFmt.Magic0,
                    BinFmt.Magic1,
                    BinFmt.ImgVersion,
                    this.globals.length,
                ]))

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

        private withProcedure<T>(proc: Procedure, f: (wr: OpWriter) => T) {
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
            for (const p of this.procs)
                p.finalize()
            for (const p of this.procs) {
                console.log(p.toString())
            }
        }

        emitProgram() {
            const mainProc = new Procedure(this, "main")
            this.procs.push(mainProc)
            this.withProcedure(mainProc, wr => {
                wr.emitStmt(OpStmt.STMT3_LOG_FORMAT, [literal(this.addString("Hello world")), literal(0), literal(0)])
                wr.emitStmt(OpStmt.STMT1_RETURN, [literal(0)])
            })
            this.finalize()
            console.log(this.serialize().toHex())
        }
    }
}