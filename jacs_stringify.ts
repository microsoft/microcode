namespace jacs {
    export function stringifyCellKind(vk: CellKind) {
        switch (vk) {
            case CellKind.LOCAL:
                return "local variable"
            case CellKind.GLOBAL:
                return "global variable"
            case CellKind.FLOAT_CONST:
                return "float literal"
            case CellKind.JD_VALUE_SEQ:
                return "multi-field buffer"
            case CellKind.JD_CURR_BUFFER:
                return "current buffer"
            case CellKind.JD_EVENT:
                return "Jacdac event"
            case CellKind.JD_COMMAND:
                return "Jacdac command"
            case CellKind.JD_REG:
                return "Jacdac register"
            case CellKind.JD_ROLE:
                return "Jacdac role"
            case CellKind.ERROR:
                return "(error node)"
            default:
                return "ValueKind: " + (vk as number).toString()
        }
    }

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

    function celldesc(cellkind: CellKind) {
        const idx = decodeInt()
        const r = resolver ? resolver.describeCell(cellkind, idx) : ""
        switch (cellkind) {
            case CellKind.LOCAL:
                return `${r}_L${idx}`
            case CellKind.GLOBAL:
                return `${r}_G${idx}`
            case CellKind.PARAM:
                return `${r}_P${idx}`
            case CellKind.FLOAT_CONST:
                return `${r}_F${idx}`
            default:
                return `C${cellkind}[${idx}]` // ??
        }
    }

    function role() {
        const roleIdx = stringifyExpr()
        if (isNumber(roleIdx)) {
            const idx = +roleIdx
            return (resolver ? resolver.roleName(idx) : "") + "_r" + idx
        } else {
            return `role(${roleIdx})`
        }
    }

    function doOp() {
        const op = getbyte()
        const expr = stringifyExpr
        switch (op) {
            case OpStmt.STMT1_WAIT_ROLE: // role
                return `wait_role ${role()}`
            case OpStmt.STMT1_SLEEP_S: // time in seconds
                return `sleep_s ${expr()}`
            case OpStmt.STMT1_SLEEP_MS: // time in ms
                return `sleep_ms ${expr()}`
            case OpStmt.STMT3_QUERY_REG: // role, code, timeout
                return `RET_VAL := ${role()}.reg[${expr()}; timeout=${expr()}]`
            case OpStmt.STMT2_SEND_CMD: // role, code
                return `${role()}.cmd[${expr()}]`
            case OpStmt.STMT4_QUERY_IDX_REG: // role, code, string-idx, timeout
                return `RET_VAL := ${role()}.reg[${expr()}; str=${expr()}; timeout=${expr()}]`
            case OpStmt.STMT3_LOG_FORMAT: // string-idx, localidx, numargs
                return `log str=${expr()} args=${expr()}+${expr()}`
            case OpStmt.STMT4_FORMAT: // string-idx, localidx, numargs, offset
                return `format str=${expr()} args=${expr()}+${expr()} offset=${expr()}`
            case OpStmt.STMT2_SETUP_BUFFER: // size, bufid
                return `setup_buffer size=${expr()} buf${expr()}`
            case OpStmt.STMT2_MEMCPY: // string-idx, offset
                return `memcpy str=${expr()} offset=${expr()}`
            case OpStmt.STMT3_CALL: // fun-idx, localidx, numargs
                return calldesc()
            case OpStmt.STMT4_CALL_BG: // fun-idx, localidx, numargs, bg
                return calldesc() + callop()
            case OpStmt.STMT1_RETURN: // ret-val
                return `return ${expr()}`
            case OpStmt.STMTx_JMP: // offset
                return `jmp ${jmpOffset()}`
            case OpStmt.STMTx1_JMP_Z: // offset, condition
                return `jmp ${jmpOffset()} if not ${expr()}`
            case OpStmt.STMT1_PANIC: // error-code
                return `panic ${expr()}`
            case OpStmt.STMTx1_STORE_LOCAL: // idx, value
                return `${celldesc(CellKind.LOCAL)} := ${expr()}`
            case OpStmt.STMTx1_STORE_GLOBAL: // idx, value
                return `${celldesc(CellKind.GLOBAL)} := ${expr()}`
            case OpStmt.STMT4_STORE_BUFFER: // shift:numfmt, offset, buffer_id, value
                return `${bufferdesc()} := ${expr()}`
            case OpStmt.STMTx1_STORE_PARAM: // idx, value
                return `${celldesc(CellKind.PARAM)} := ${expr()}`
            case OpStmt.STMT1_TERMINATE_FIBER:
                return `terminate(${expr()})`
            default:
                return `stmt ${op}`
        }
    }

    function funname() {
        const fn = stringifyExpr()
        if (isNumber(fn)) {
            const b = +fn
            return (resolver ? resolver.funName(b) : "") + "_F" + b
        } else {
            return `_F[${fn}]`
        }
    }

    function calldesc() {
        return `${funname()} args=${stringifyExpr()}+${stringifyExpr()}`
    }

    function jmpOffset() {
        const off = decodeInt()
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

    function callop() {
        const op = stringifyExpr()
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

    function bufferdesc(): string {
        const fmt = stringifyExpr()
        const offset = stringifyExpr()
        const bufferidx = stringifyExpr()
        return `buf${bufferidx}[${offset} @ ${numfmt(fmt)}]`
    }

    function stringifyExpr(): string {
        const op = getbyte()

        if (op >= 0x80) return "" + (op - 0x80 - 16)

        const expr = stringifyExpr

        switch (op) {
            case OpExpr.EXPRx_LOAD_LOCAL:
            case OpExpr.EXPRx_LOAD_GLOBAL:
            case OpExpr.EXPRx_LOAD_PARAM:
            case OpExpr.EXPRx_LITERAL_F64:
                return celldesc(op as any)
            case OpExpr.EXPR3_LOAD_BUFFER:
                return bufferdesc()
            case OpExpr.EXPRx_LITERAL:
                return "" + decodeInt()
            case OpExpr.EXPR0_RET_VAL: // return value of query register, call, etc
                return "RET_VAL"
            case OpExpr.EXPR2_STR0EQ: // A-string-index C-offset
                return `str0eq(str=${expr()}, off=${expr()})`
            case OpExpr.EXPR1_ROLE_IS_CONNECTED:
                return `is_connected(${role()})`
            case OpExpr.EXPR0_PKT_SIZE:
                return "PKT_SIZE"
            case OpExpr.EXPR0_PKT_EV_CODE:
                return "PKT_EV_CODE"
            case OpExpr.EXPR0_PKT_REG_GET_CODE:
                return "PKT_REG_GET_CODE"
            case OpExpr.EXPR0_NAN:
                return "NaN"
            case OpExpr.EXPR1_ABS:
                return `abs(${expr()})`
            case OpExpr.EXPR1_BIT_NOT:
                return `~(${expr()})`
            case OpExpr.EXPR1_CEIL:
                return `ceil(${expr()})`
            case OpExpr.EXPR1_FLOOR:
                return `floor(${expr()})`
            case OpExpr.EXPR1_ID:
                return `id(${expr()})`
            case OpExpr.EXPR1_IS_NAN:
                return `isNaN(${expr()})`
            case OpExpr.EXPR1_LOG_E:
                return `log_E(${expr()})`
            case OpExpr.EXPR1_NEG:
                return `-(${expr()})`
            case OpExpr.EXPR1_NOT:
                return `!(${expr()})`
            case OpExpr.EXPR1_RANDOM: // value between 0 and arg
                return `random(${expr()})`
            case OpExpr.EXPR1_RANDOM_INT: // int between 0 and arg inclusive
                return `random_int(${expr()})`
            case OpExpr.EXPR1_ROUND:
                return `round(${expr()})`
            case OpExpr.EXPR1_TO_BOOL:
                return `!!(${expr()})`
            case OpExpr.EXPR2_ADD:
                return `(${expr()}) + (${expr()})`
            case OpExpr.EXPR2_BIT_AND:
                return `(${expr()}) & (${expr()})`
            case OpExpr.EXPR2_BIT_OR:
                return `(${expr()}) | (${expr()})`
            case OpExpr.EXPR2_BIT_XOR:
                return `(${expr()}) ^ (${expr()})`
            case OpExpr.EXPR2_DIV:
                return `(${expr()}) / (${expr()})`
            case OpExpr.EXPR2_EQ:
                return `(${expr()}) == (${expr()})`
            case OpExpr.EXPR2_IDIV:
                return `idiv(${expr()}, ${expr()})`
            case OpExpr.EXPR2_IMUL:
                return `imul(${expr()}, ${expr()})`
            case OpExpr.EXPR2_LE:
                return `(${expr()}) <= (${expr()})`
            case OpExpr.EXPR2_LT:
                return `(${expr()}) < (${expr()})`
            case OpExpr.EXPR2_MAX:
                return `max(${expr()}, ${expr()})`
            case OpExpr.EXPR2_MIN:
                return `min(${expr()}, ${expr()})`
            case OpExpr.EXPR2_MUL:
                return `(${expr()}) * (${expr()})`
            case OpExpr.EXPR2_NE:
                return `(${expr()}) != (${expr()})`
            case OpExpr.EXPR2_POW:
                return `pow(${expr()}, ${expr()})`
            case OpExpr.EXPR2_SHIFT_LEFT:
                return `(${expr()}) << (${expr()})`
            case OpExpr.EXPR2_SHIFT_RIGHT:
                return `(${expr()}) >> (${expr()})`
            case OpExpr.EXPR2_SHIFT_RIGHT_UNSIGNED:
                return `(${expr()}) >>> (${expr()})`
            case OpExpr.EXPR2_SUB:
                return `(${expr()}) - (${expr()})`
            case OpExpr.EXPR0_NOW_MS:
                return `now_ms()`
            case OpExpr.EXPR1_GET_FIBER_HANDLE:
                return `fiber(_F${expr()})`
            default:
                return `? ${op.toString()} ?`
        }
    }
}
