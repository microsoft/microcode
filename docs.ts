namespace docs {
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

    let theApp: microcode.App
    export function setup(app: microcode.App) {
        theApp = app
        _setup()
    }

    //% shim=TD_NOOP
    function _setup() {
        control.simmessages.onReceived("docs", () => _renderApp())
    }

    interface RenderedImage {
        type: "icon" | "sample" | "icon_sample"
        name: string
        pixels: string
    }

    //% shim=TD_NOOP
    function _renderApp() {
        const images: RenderedImage[] = []
        renderIcons(images)
        renderSamples(images, theApp)
        control.simmessages.send(
            "docs",
            Buffer.fromUTF8(JSON.stringify(images))
        )
    }

    function renderSamples(images: RenderedImage[], app: microcode.App) {
        app.popScene()
        for (const sample of microcode.samples()) {
            console.log(`render sample ${sample.label}`)
            settings.writeString(microcode.SAVESLOT_AUTO, sample.src)
            const editor = new microcode.Editor(app)
            app.pushScene(editor)
            pause(500)
            renderProgram(
                images,
                editor,
                sample.label,
                microcode.icons.get(sample.icon)
            )
        }
    }

    function renderProgram(
        images: RenderedImage[],
        editor: microcode.Editor,
        editorName: string,
        editorIcon: Image
    ) {
        const prg = editor.renderProgram()
        appendImage(images, "sample", editorName, prg)
        if (editorIcon)
            appendImage(images, "icon_sample", editorName, editorIcon)
    }

    function appendImage(
        images: RenderedImage[],
        type: "icon" | "sample" | "icon_sample",
        name: string,
        img: Image
    ) {
        const msg: RenderedImage = {
            type,
            name: name.replace(" ", "_"),
            pixels: imageToBuffer(img).toHex(),
        }
        images.push(msg)
    }

    function renderIcons(images: RenderedImage[]) {
        microcode.icons.init()
        for (const name of microcode.icons.names()) {
            console.log(`render icon ${name}`)
            const icon = microcode.icons.get(name)
            appendImage(images, `icon`, name, icon)
        }
    }
}
