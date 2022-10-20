namespace jacs {
    function functionName(idx: number) {
        const desc = _binGetProc(idx)
        const nameidx = desc.getNumber(NumberFormat.UInt16LE, 12)
        return _binGetString(nameidx) as string
    }

    function patchBody(top: TopWriter, body: Buffer, name: string) {
        for (let i = 0; i < body.length; ++i) {
            const op = body[i]

            let intarg: number = null

            if (opTakesNumber(body[i])) {
                intarg = body[++i]
                if (intarg >= 0xf8) {
                    const len = (intarg & 3) + 1
                    i += len
                    intarg = null // don't decode, we don't expect these anyways
                }
            }

            let patched: number = null
            switch (op) {
                case Op.EXPRx_STATIC_BUFFER:
                    const b = _binGetString(intarg)
                    if (b == null) {
                        top.error("bad buf " + intarg)
                        return
                    }
                    patched = top.addString(b)
                    break
                case Op.EXPRx_STATIC_FUNCTION:
                    const called = linkFunction(top, functionName(intarg))
                    patched = called.index
                    break
                case Op.EXPRx_LITERAL_F64:
                    const f = _binFloatLits.getNumber(
                        NumberFormat.Float64LE,
                        intarg * 8
                    )
                    patched = top.addFloat(f)
                    break
                case Op.EXPRx_STATIC_ROLE:
                case Op.EXPRx_LOAD_GLOBAL:
                case Op.STMTx1_STORE_GLOBAL:
                    top.error(`op not supported in lib ${op} at ${name}:${i}`)
                    return
            }

            if (patched != null) {
                if (intarg == null) top.error("lib oops?")
                else if (patched > 0xf8) top.error("can't patch " + patched)
                else body[i] = patched
            }
        }
    }

    export function linkFunction(top: TopWriter, name: string): Procedure {
        const lname = "_l_" + name
        let proc = top.procs.find(p => p.name == lname)
        if (proc) return proc

        const fullbody = _binGetProc(name)
        if (!fullbody) throw "no lib fun: " + name

        proc = top.addProc(lname)
        const body = proc.writer.setExternal(fullbody)
        patchBody(top, body, name)
        return proc
    }
}
