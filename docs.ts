namespace microcode {
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

    //% shim=TD_NOOP
    export function init() {
        control.simmessages.onReceived("docs:icons", () => dumpIcons())
    }

    //% shim=TD_NOOP
    export function dumpIcons() {
        renderIcons()
    }

    export function dumpProgram(editor: Editor) {
        console.log(`dump program`)
        const prg = editor.renderProgram()
        sendImage(editor.name, prg)
    }

    function sendImage(name: string, img: Image) {
        const msg = {
            type: "image",
            name,
            pixels: imageToBuffer(img).toHex(),
        }
        control.simmessages.send("docs", Buffer.fromUTF8(JSON.stringify(msg)))
    }

    function renderIcons() {
        icons.init()
        for (const name of icons.names()) {
            console.log(`dump ${name}`)
            const icon = icons.get(name)
            sendImage(name, icon)
        }
    }
}