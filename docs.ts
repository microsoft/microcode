namespace microcode {
    //% shim=TD_NOOP
    export function dumpDocs() {
        control.simmessages.onReceived("docs", renderDocs)
    }

    function renderDocs() {
        icons.init()
        for (const name of icons.names()) {
            console.log(`dump ${name}`)
            const icon = icons.get(name)
        }
    }
}