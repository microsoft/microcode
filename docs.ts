namespace microcode {
    //% shim=TD_NOOP
    export function dumpDocs() {
//        control.simmessages.onReceived("docs", renderDocs)
        renderDocs()
    }

    function imageToBuffer(img: Image) {
        const w = img.width
        const h = img.height
        const buf = control.createBuffer(1 + w * h)
        let j = 0
        buf[j++] = w
        for (let x = 0; x < w; ++x) {
            for (let y = 0; y < h; ++y) {
                buf[j++] = img.getPixel(x, y)
            }
        }
        return buf
    }

    function renderDocs() {
        icons.init()
        for (const name of icons.names()) {
            console.log(`dump ${name}`)
            const icon = icons.get(name)
            const pixels = imageToBuffer(icon)
            const msg = {
                type: "icon",
                name,
                pixels: pixels.toHex()
            }
            control.simmessages.send("docs", Buffer.fromUTF8(JSON.stringify(msg)))
        }
    }
}