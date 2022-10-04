namespace jacs {
    export function opTakesNumber(op: Op) {
        return !!(OP_PROPS.charCodeAt(op) & BytecodeFlag.TAKES_NUMBER)
    }

    export function exprIsStateful(op: Op) {
        return !(OP_PROPS.charCodeAt(op) & BytecodeFlag.IS_STATELESS)
    }

    export function opNumRealArgs(op: Op) {
        return OP_PROPS.charCodeAt(op) & BytecodeFlag.NUM_ARGS_MASK
    }

    export function opNumArgs(op: Op) {
        let n = opNumRealArgs(op)
        if (opTakesNumber(op)) n++
        return n
    }

    export function opIsStmt(op: Op) {
        return !!(OP_PROPS.charCodeAt(op) & BytecodeFlag.IS_STMT)
    }

    export enum CellKind {
        LOCAL = Op.EXPRx_LOAD_LOCAL,
        GLOBAL = Op.EXPRx_LOAD_GLOBAL,
        PARAM = Op.EXPRx_LOAD_PARAM,
        FLOAT_CONST = Op.EXPRx_LITERAL_F64,

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
                return Op.STMTx1_STORE_LOCAL
            case CellKind.PARAM:
                return Op.STMTx1_STORE_PARAM
            case CellKind.GLOBAL:
                return Op.STMTx1_STORE_GLOBAL
            default:
                return oops("bad kind")
        }
    }

    export function loadExpr(k: CellKind) {
        switch (k) {
            case CellKind.LOCAL:
            case CellKind.PARAM:
            case CellKind.GLOBAL:
                return k as any as Op
            default:
                return oops("bad kind")
        }
    }

    export interface InstrArgResolver {
        describeCell(t: string, idx: number): string
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
