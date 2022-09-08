namespace jacs {
    export enum BinFmt {
        Magic0 = 0x5363614a,
        Magic1 = 0x9a6a7e0a,
        ImgVersion = 0x00020001,
        FixHeaderSize = 64,
        SectionHeaderSize = 8,
        FunctionHeaderSize = 16,
        RoleHeaderSize = 8,
        BufferHeaderSize = 8,
        BinarySizeAlign = 32,
    }

    export const JACS_MAX_EXPR_DEPTH = 10

    export enum OpStmt {
        STMT1_WAIT_ROLE = 1, // role
        STMT1_SLEEP_S = 2, // time in seconds
        STMT1_SLEEP_MS = 3, // time in ms
        STMT3_QUERY_REG = 4, // role, code, timeout
        STMT2_SEND_CMD = 5, // role, code
        STMT4_QUERY_IDX_REG = 6, // role, code, string-idx, timeout
        STMT3_LOG_FORMAT = 7, // string-idx, localidx, numargs
        STMT4_FORMAT = 8, // string-idx, localidx, numargs, offset
        STMT2_SETUP_BUFFER = 9, // size, buffer_id
        STMT2_MEMCPY = 10, // string-idx, offset
        STMT3_CALL = 11, // fun-idx, localidx, numargs
        STMT4_CALL_BG = 12, // fun-idx, localidx, numargs, bg
        STMT1_RETURN = 13, // ret-val
        STMTx_JMP = 14, // offset
        STMTx1_JMP_Z = 15, // offset, condition
        STMT1_PANIC = 16, // error-code
        STMTx1_STORE_LOCAL = 17, // idx, value
        STMTx1_STORE_GLOBAL = 18, // idx, value
        STMT4_STORE_BUFFER = 19, // shift:numfmt, offset, buffer_id, value
        STMTx1_STORE_PARAM = 20, // idx, value
        STMT1_TERMINATE_FIBER = 21, // fiber-handle
    }

    export const stmtNumArgs = hex`ff 01 01 01 03 02 04 03 04 02 02 03 04 01 01 02 01 02 02 04 02 01`

    export function stmtTakesNumber(op: OpStmt) {
        switch (op) {
            case OpStmt.STMTx_JMP:
            case OpStmt.STMTx1_JMP_Z:
            case OpStmt.STMTx1_STORE_LOCAL:
            case OpStmt.STMTx1_STORE_GLOBAL:
            case OpStmt.STMTx1_STORE_PARAM:
                return true
            default:
                return false
        }
    }

    export enum OpExpr {
        EXPRx_LOAD_LOCAL = 1,
        EXPRx_LOAD_GLOBAL = 2,
        EXPR3_LOAD_BUFFER = 3,
        EXPRx_LOAD_PARAM = 45,
        EXPRx_LITERAL = 4,
        EXPRx_LITERAL_F64 = 5,
        EXPR0_RET_VAL = 6, // return value of query register, call, etc
        EXPR2_STR0EQ = 7, // A-string-index C-offset
        EXPR1_ROLE_IS_CONNECTED = 8,
        EXPR0_PKT_SIZE = 9,
        EXPR0_PKT_EV_CODE = 10, // or nan
        EXPR0_PKT_REG_GET_CODE = 11, // or nan

        // stateless math stuff below
        EXPR0_NAN = 12, // NaN value
        EXPR1_ABS = 13, // Math.abs(x)
        EXPR1_BIT_NOT = 14, // ~x
        EXPR1_CEIL = 15, // Math.ceil(x)
        EXPR1_FLOOR = 16, // Math.floor(x)
        EXPR1_ID = 17, // x - TODO needed?
        EXPR1_IS_NAN = 18, // isNaN(x)
        EXPR1_LOG_E = 19, // log_e(x)
        EXPR1_NEG = 20, // -x
        EXPR1_NOT = 21, // !x
        EXPR1_RANDOM = 22, // value between 0 and arg
        EXPR1_RANDOM_INT = 23, // int between 0 and arg inclusive
        EXPR1_ROUND = 24, // Math.round(x)
        EXPR1_TO_BOOL = 25, // !!x
        EXPR2_ADD = 26,
        EXPR2_BIT_AND = 27,
        EXPR2_BIT_OR = 28,
        EXPR2_BIT_XOR = 29,
        EXPR2_DIV = 30,
        EXPR2_EQ = 31,
        EXPR2_IDIV = 32,
        EXPR2_IMUL = 33,
        EXPR2_LE = 34,
        EXPR2_LT = 35,
        EXPR2_MAX = 36,
        EXPR2_MIN = 37,
        EXPR2_MUL = 38,
        EXPR2_NE = 39,
        EXPR2_POW = 40,
        EXPR2_SHIFT_LEFT = 41,
        EXPR2_SHIFT_RIGHT = 42,
        EXPR2_SHIFT_RIGHT_UNSIGNED = 43,
        EXPR2_SUB = 44,

        EXPR0_NOW_MS = 46,
        EXPR1_GET_FIBER_HANDLE = 47,
    }

    export const exprNumArgs = hex`ff 01 01 03 01 01 00 02 01 00 00 00 00 01 01 01 01 01 01 01 01 01 01 01 01 01 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 01 00 01`

    export function exprIsStateful(op: OpExpr) {
        switch (op) {
            case OpExpr.EXPRx_LOAD_LOCAL:
            case OpExpr.EXPRx_LOAD_GLOBAL:
            case OpExpr.EXPR3_LOAD_BUFFER:
            case OpExpr.EXPRx_LOAD_PARAM:
            case OpExpr.EXPR0_RET_VAL:
            case OpExpr.EXPR2_STR0EQ:
            case OpExpr.EXPR0_PKT_SIZE:
            case OpExpr.EXPR0_PKT_EV_CODE:
            case OpExpr.EXPR0_PKT_REG_GET_CODE:
            case OpExpr.EXPR0_NOW_MS:
            case OpExpr.EXPR1_GET_FIBER_HANDLE:
                return true
            default:
                return false
        }
    }

    export function exprTakesNumber(op: OpExpr) {
        switch (op) {
            case OpExpr.EXPRx_LOAD_LOCAL:
            case OpExpr.EXPRx_LOAD_GLOBAL:
            case OpExpr.EXPRx_LOAD_PARAM:
            case OpExpr.EXPRx_LITERAL:
            case OpExpr.EXPRx_LITERAL_F64:
                return true
            default:
                return false
        }
    }

    export enum OpCall {
        SYNC = 0, // regular call
        BG = 1, // start new fiber
        BG_MAX1 = 2, // ditto, unless one is already running
        BG_MAX1_PEND1 = 3, // ditto, but if fiber already running, re-run it later
    }

    export enum CellKind {
        LOCAL = OpExpr.EXPRx_LOAD_LOCAL,
        GLOBAL = OpExpr.EXPRx_LOAD_GLOBAL,
        PARAM = OpExpr.EXPRx_LOAD_PARAM,
        FLOAT_CONST = OpExpr.EXPRx_LITERAL_F64,

        // these cannot be emitted directly
        JD_EVENT = 0x100,
        JD_REG = 0x101,
        JD_ROLE = 0x102,
        JD_VALUE_SEQ = 0x103,
        JD_CURR_BUFFER = 0x104,
        JD_COMMAND = 0x105,
        JD_CLIENT_COMMAND = 0x106,
        X_BUFFER = 0x124,

        ERROR = 0x200,
    }

    export function storeStmt(k: CellKind) {
        switch (k) {
            case CellKind.LOCAL:
                return OpStmt.STMTx1_STORE_LOCAL
            case CellKind.PARAM:
                return OpStmt.STMTx1_STORE_PARAM
            case CellKind.GLOBAL:
                return OpStmt.STMTx1_STORE_GLOBAL
            default:
                return oops("bad kind")
        }
    }

    export function loadExpr(k: CellKind) {
        switch (k) {
            case CellKind.LOCAL:
            case CellKind.PARAM:
            case CellKind.GLOBAL:
                return k as any as OpExpr
            default:
                return oops("bad kind")
        }
    }

    // Size in bits is: 8 << (fmt & 0b11)
    // Format is ["u", "i", "f", "reserved"](fmt >> 2)
    export enum OpFmt {
        U8 = 0b0000,
        U16 = 0b0001,
        U32 = 0b0010,
        U64 = 0b0011,
        I8 = 0b0100,
        I16 = 0b0101,
        I32 = 0b0110,
        I64 = 0b0111,
        F8 = 0b1000, // not supported
        F16 = 0b1001, // not supported
        F32 = 0b1010,
        F64 = 0b1011,
    }

    export interface InstrArgResolver {
        describeCell(t: CellKind, idx: number): string
        funName(idx: number): string
        roleName(idx: number): string
        resolverPC: number
    }

    export interface FunctionDebugInfo {
        name: string
        // format is (line-number, start, len)
        // start is offset in halfwords from the start of the function
        // len is in halfwords
        srcmap: number[]
        locals: CellDebugInfo[]
    }

    export interface CellDebugInfo {
        name: string
    }

    export interface RoleDebugInfo extends CellDebugInfo {
        serviceClass: number
    }

    export interface DebugInfo {
        functions: FunctionDebugInfo[]
        roles: RoleDebugInfo[]
        globals: CellDebugInfo[]
        source: string
    }

    export function emptyDebugInfo(): DebugInfo {
        return {
            functions: [],
            globals: [],
            roles: [],
            source: "",
        }
    }

    export interface JacError {
        filename: string
        line: number
        column: number
        message: string
        codeFragment: string
    }

    export function printJacError(err: JacError) {
        let msg = `${err.filename || ""}(${err.line},${err.column}): ${
            err.message
        }`
        if (err.codeFragment) msg += ` (${err.codeFragment})`
        console.error(msg)
    }
}
