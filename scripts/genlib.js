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
function libToFun(lib) {
    let r = "namespace jacs { export function _getProc(idx: number | string) {\n"
    let idx = 0
    for (const proc of lib.procs) {
        let body = null
        if (proc.desc.startsWith("h:") && proc.body.startsWith("h:"))
            body = proc.desc + proc.body.slice(2)
        r += `if (idx == ${idx} || idx == ${JSON.stringify(proc.name)})\n`
        r += `  return ${arg(body)}\n`
        idx++
    }
    r += "return null\n} }\n"

    return r
}

console.log(libToFun(JSON.parse(fs.readFileSync(process.argv[2], "utf8"))))