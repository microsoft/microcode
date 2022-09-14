namespace jacs {
    export function bitSize(fmt: OpFmt) {
        return 8 << (fmt & 0b11)
    }

    let getbyte: () => number
    let resolver: InstrArgResolver

    export function stringifyInstr(
        getbyte0: () => number,
        resolver0?: InstrArgResolver
    ) {
        resolver = resolver0
        getbyte = getbyte0

        let res = "    " + doOp()

        if (resolver) {
            const pc = resolver.resolverPC
            res = (pc > 9999 ? pc : ("    " + pc).slice(-4)) + ": " + res
        }

        return res
    }

    function expandFmt(takesNumber: boolean, fmt: string) {
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
            if (takesNumber) {
                takesNumber = false
                eNum = decodeInt()
                e = eNum + ""
            } else {
                e = stringifyExpr()
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

    function doOp() {
        const op = getbyte()
        const fmt = STMT_PRINT_FMTS[op]
        if (!fmt) return `?stmt${op}?`
        return expandFmt(stmtTakesNumber(op), fmt)
    }

    function jmpOffset(off: number) {
        const offs = (off >= 0 ? "+" : "") + off
        return resolver && resolver.resolverPC
            ? resolver.resolverPC + off + (" (" + offs + ")")
            : offs
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

    function decodeInt() {
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

    function stringifyExpr(): string {
        const op = getbyte()

        if (op >= 0x80) return "" + (op - 0x80 - 16)

        const fmt = EXPR_PRINT_FMTS[op]
        if (!fmt) return `?expr${op}?`
        return expandFmt(exprTakesNumber(op), fmt)
    }
}
