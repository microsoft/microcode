const fs = require("fs")

function arg(s) {
    if (s.startsWith("h:")) {
        let h = s.slice(2)
        if (h.length > 90 - 24)
            h = "\n" + h.replace(/.{90}/g, f => f + "\n")
        return "hex`" + h + "`"
    } else if (s.startsWith("s:"))
        return JSON.stringify(s.slice(2))
    else
        return JSON.stringify(s)
}


function toHex(bytes) {
    if (!bytes) return undefined
    let r = ""
    for (let i = 0; i < bytes.length; ++i) {
        r += ("0" + bytes[i].toString(16)).slice(-2)
    }
    return r
}

function libToFun(lib) {
    let r = "namespace jacs {\n"

    r += "export function _binGetProc(idx: number | string) {\n"
    let idx = 0
    for (const proc of lib.procs) {
        if (proc.name != "main") {
            let body = null
            if (proc.desc.startsWith("h:") && proc.body.startsWith("h:"))
                body = proc.desc + proc.body.slice(2)
            r += `if (idx == ${idx} || idx == ${JSON.stringify(proc.name)})\n`
            r += `  return ${arg(body)}\n`
        }
        idx++
    }
    r += "return null\n}\n"

    r += "export function _binGetString(idx: number): string | Buffer {\n"
    idx = 0
    for (const body of lib.strings) {
        r += `if (idx == ${idx})\n`
        r += `  return ${arg(body)}\n`
        idx++
    }
    r += "return null\n}\n"

    const b = new Uint8Array(new Float64Array(lib.floats).buffer)

    r += `export const _binFloatLits = ` + arg("h:" + toHex(b)) + "\n"

    r += " }\n"

    return r
}

console.log(libToFun(JSON.parse(fs.readFileSync(process.argv[2], "utf8"))))