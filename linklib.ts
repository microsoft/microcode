namespace jacs {
    function functionName(idx: number) {
        const desc = _binGetProc(idx)
        const nameidx = desc.getNumber(NumberFormat.UInt16LE, 12)
        return _binGetString(nameidx)
    }

    function patchBody(top: TopWriter, body: Buffer) {
        for (let i = 0; i < body.length; ++i) {
            const op = body[i]

            let intarg: number = null

            if (opTakesNumber(body[i])) {
                intarg = body[++i]
                if (intarg >= 0xf8) {
                    const len = (intarg & 3) + 1
                    i += len - 1
                    intarg = null // don't decode, we don't expect these anyways
                }
            }

            let patched: number = null
            switch (op) {
                case Op.EXPRx_STATIC_BUFFER:
                    const b = _binGetString(intarg)
                    if (b == null) throw "bad buf " + intarg
                    patched = top.addString(b)
                    break
                case Op.EXPRx_STATIC_FUNCTION:
                    const called = linkFunction(top, functionName(intarg))
                    patched = called.index
                    break
                case Op.EXPRx_STATIC_ROLE:
                case Op.EXPRx_LOAD_GLOBAL:
                case Op.STMTx1_STORE_GLOBAL:
                    throw "op not supported in lib " + op
            }

            if (patched != null) {
                if (intarg == null) throw "oops?"
                if (patched > 0xf8) throw "can't patch " + patched
                body[i] = patched
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
        const body = fullbody.slice(BinFmt.FUNCTION_HEADER_SIZE)
        proc.writer.setExternal(body)
        patchBody(top, body)
        return proc
    }
}
