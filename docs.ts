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
        type: "icon" | "sample" | "icon_sample" | "image"
        name: string
        pixels: string
    }

    //% shim=TD_NOOP
    function _renderApp() {
        const images: RenderedImage[] = []
        appendImage(images, "image", "home", screen)
        renderIcons(images)
        renderSamples(images, theApp)
        appendImage(images, "image", "microcode", microcode.wordLogo)
        appendImage(images, "image", "microbit", microcode.microbitLogo)
        appendImage(
            images,
            "image",
            "editor_background",
            microcode.editorBackground
        )
        control.simmessages.send(
            "docs",
            Buffer.fromUTF8(JSON.stringify(images))
        )
    }

    function renderSamples(images: RenderedImage[], app: microcode.App) {
        app.popScene()
        for (const sample of microcode.samples()) {
            console.log(`render sample ${sample.label}`)
            const icon = microcode.icons.get(sample.icon, true)
            if (icon) appendImage(images, "icon_sample", sample.label, icon)
            const src = sample.source
            settings.writeString(microcode.SAVESLOT_AUTO, src)
            const editor = new microcode.Editor(app)
            app.pushScene(editor)
            editor.cursor.visible = false

            let imgs: Image[] = []
            let w = 0
            let h = 0
            const margin = 4

            editor.nonEmptyPages().forEach(p => {
                console.log(`page ${screen.width} ${editor.ruleWidth(p)}`)
                microcode.Screen.setImageSize(
                    Math.max(screen.width, editor.ruleWidth(p)),
                    editor.pageHeight(p)
                )
                const pageEditor = new microcode.Editor(app)
                app.pushScene(pageEditor)
                pageEditor.cursor.visible = false
                pause(500)
                pageEditor.renderPage(p)
                pause(500)
                const img = microcode.Screen.image.clone()
                imgs.push(img)
                w = Math.max(w, img.width)
                h += img.height + margin

                app.popScene()
            })

            const res = image.create(w, h)
            res.fill(editor.color)
            let y = 0
            for (let i = 0; i < imgs.length; ++i) {
                const img = imgs[i]
                res.drawTransparentImage(img, 0, y)
                y += img.height + margin
            }

            appendImage(images, "sample", sample.label, res)

            app.popScene()
        }
        microcode.Screen.setImageSize(screen.width, screen.height)
    }

    function appendImage(
        images: RenderedImage[],
        type: "icon" | "sample" | "icon_sample" | "image",
        name: string,
        img: Image
    ) {
        const msg: RenderedImage = {
            type,
            name: name.replaceAll(" ", "_").replaceAll(",", ""),
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
