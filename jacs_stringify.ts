namespace jacs {
    export function bitSize(fmt: NumFmt) {
        return 8 << (fmt & 0b11)
    }

    let resolver: InstrArgResolver
    let jmpoff: number

    class OpTree {
        args: OpTree[]
        arg: number
        constructor(public opcode: number) {}
    }

    export function stringifyInstr(
        getbyte0: () => number,
        resolver0?: InstrArgResolver
    ) {
        let off = 0
        jmpoff = NaN

        const getbyte = () => {
            off++
            return getbyte0()
        }

        const decodeInt = () => {
            const v = getbyte()
            if (v < 0xf8) return v

            let r = 0
            const n = !!(v & 4)
            const len = (v & 3) + 1

            for (let i = 0; i < len; ++i) {
                const v = getbyte()
                r = r << 8
                r |= v
            }

            return n ? -r : r
        }

        resolver = resolver0

        const stack: OpTree[] = []

        for (;;) {
            const op = getbyte()
            if (op == 0 && off == 1) return "          .fill 0x00"
            const e = new OpTree(op)
            if (opTakesNumber(op)) {
                if (resolver && resolver.resolverPC)
                    jmpoff = resolver.resolverPC + off - 1
                e.arg = decodeInt()
            }
            let n = opNumRealArgs(op)
            if (n) {
                if (stack.length < n) return "???oops stack underflow"
                e.args = stack.slice(stack.length - n)
                while (n--) stack.pop()
            }
            stack.push(e)
            if (opIsStmt(op)) break
        }
        if (stack.length != 1) return "???oops bad stack: " + stack.length

        let res = "    " + stringifyExpr(stack[0])

        if (resolver) {
            const pc = resolver.resolverPC
            res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res
            resolver = null // unroot it
        }

        return res
    }
    function expandFmt(fmt: string, t: OpTree) {
        let ptr = 0
        let beg = 0
        let r = ""
        while (ptr < fmt.length) {
            if (fmt.charCodeAt(ptr) != 37) {
                ptr++
                continue
            }

            r += fmt.slice(beg, ptr)
            ptr++
            beg = ptr + 1

            let e: string
            let eNum: number = null

            if (t.arg != undefined) {
                eNum = t.arg
                e = eNum + ""
                t.arg = undefined
            } else {
                if (!t.args || !t.args.length) e = "???oops"
                else e = stringifyExpr(t.args.shift())
                if (isNumber(e)) eNum = +e
            }

            const ff = fmt[ptr]
            switch (ff) {
                case "e":
                    break

                case "n":
                    e = numfmt(e)
                    break

                case "o":
                    e = callop(e)
                    break

                case "j":
                    e = jmpOffset(eNum)
                    break

                default:
                    e = "_" + ff + e
                    if (eNum != null && resolver) {
                        const pref = resolver.describeCell(ff, eNum)
                        if (pref) e = pref + e
                    }
                    break
            }

            r += e
            ptr++
        }
        r += fmt.slice(beg)
        return r
    }

    function jmpOffset(off: number) {
        const offs = (off >= 0 ? "+" : "") + off
        return isNaN(jmpoff) ? offs : jmpoff + off + (" (" + offs + ")")
    }

    function isNumber(s: string) {
        for (let i = 0; i < s.length; ++i) {
            if ("0123456789".indexOf(s[i]) < 0) return false
        }
        return true
    }

    function numfmt(vv: string) {
        if (!isNumber(vv)) return vv
        const v = +vv
        const fmt = v & 0xf
        const bitsz = bitSize(fmt)
        const letter = ["u", "i", "f", "x"][fmt >> 2]
        const shift = v >> 4
        if (shift) return letter + (bitsz - shift) + "." + shift
        else return letter + bitsz
    }

    function callop(op: string) {
        if (isNumber(op))
            switch (+op) {
                case OpCall.SYNC:
                    return ""
                case OpCall.BG:
                    return " bg"
                case OpCall.BG_MAX1:
                    return " bg (max1)"
                case OpCall.BG_MAX1_PEND1:
                    return " bg (max1 pend1)"
                default:
                    return ` call ${op}`
            }
        else return ` callop=${op}`
    }

    function stringifyExpr(t: OpTree): string {
        const op = t.opcode

        if (op >= BinFmt.DIRECT_CONST_OP)
            return (
                "" + (op - BinFmt.DIRECT_CONST_OP - BinFmt.DIRECT_CONST_OFFSET)
            )
        /*
        const fmt = OP_PRINT_FMTS[op]
        if (!fmt) return `???oops op${op}`
        return expandFmt(fmt, t)
*/

        return "uncomment"
    }
}
