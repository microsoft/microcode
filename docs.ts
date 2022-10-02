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

    let app: microcode.App
    export function setup(theApp: microcode.App) {
        app = theApp
        _setup()
    }

    //% shim=TD_NOOP
    function _setup() {
        control.simmessages.onReceived("docs", (data: Buffer) => {
            const msg = JSON.parse(data.toString())
            if (msg.type === "art") _renderApp()
            else if (msg.type === "screenshot") _renderScreenshot()
        })
    }

    interface RenderedImage {
        type: "icon" | "sample" | "icon_sample" | "image" | "program"
        name: string
        pixels: string
    }

    //% shim=TD_NOOP
    function _renderApp() {
        const images: RenderedImage[] = []
        appendImage(images, "image", "home", screen)
        renderIcons(images)
        renderSamples(images)
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
            Buffer.fromUTF8(JSON.stringify({ type: "art", images }))
        )
    }

    function renderSamples(images: RenderedImage[]) {
        app.popScene()
        for (const sample of microcode.samples(false)) {
            console.log(`render sample ${sample.label}`)
            const icon = microcode.icons.get(sample.icon, true)
            if (icon) appendImage(images, "icon_sample", sample.label, icon)
            const src = sample.source
            settings.writeString(microcode.SAVESLOT_AUTO, src)
            const res = _renderProgram()
            Object.keys(res).forEach(iname => {
                appendImage(
                    images,
                    "sample",
                    iname == "app" ? sample.label : `${sample.label}_${iname}`,
                    res[iname]
                )
            })

            app.popScene()
        }
        microcode.Screen.setImageSize(screen.width, screen.height)
    }

    //% shim=TD_NOOP
    function _renderScreenshot() {
        const res = _renderProgram()
        microcode.Screen.setImageSize(screen.width, screen.height)
        control.simmessages.send(
            "docs",
            Buffer.fromUTF8(
                JSON.stringify({
                    type: "art",
                    images: [
                        {
                            name: "current",
                            type: "program",
                            pixels: imageToBuffer(res["app"]).toHex(),
                        },
                    ],
                })
            )
        )
    }

    //% shim=TD_NOOP
    function _renderProgram(): { [name: string]: Image } {
        const r: { [name: string]: Image } = {}
        const loader = new microcode.Editor(app)
        app.pushScene(loader)
        loader.cursor.visible = false

        const pages = loader.nonEmptyPages()

        let imgs: Image[] = []
        let w = 0
        let h = 0
        const margin = 4

        // compute largest rule width
        let pw = screen.width
        for (const p of pages) {
            loader.switchToPage(p)
            pw = Math.max(pw, loader.ruleWidth())
        }

        // render all pages
        loader.nonEmptyPages().forEach(p => {
            loader.switchToPage(p)
            microcode.Screen.setImageSize(pw, loader.pageHeight())
            const editor = new microcode.Editor(app)
            app.pushScene(editor)
            editor.cursor.visible = false
            pause(500)
            editor.renderPage(p)
            const img = microcode.Screen.image.clone()
            imgs.push(img)
            w = Math.max(w, img.width)
            h += img.height + margin

            r[`page_${p}`] = img

            // render individual rules
            const pageEditor = editor.pageEditor
            const rulesEditor = pageEditor.ruleEditors
            rulesEditor.forEach((ruleEditor, ri) => {
                const bound = ruleEditor.bounds
                const imgr = image.create(bound.width, bound.height)
                imgr.fill(loader.color)
                console.log([
                    0,
                    0,
                    bound.width,
                    bound.height,
                    img,
                    ruleEditor.xfrm.localPos.x,
                    ruleEditor.xfrm.localPos.y,
                    ruleEditor.xfrm.localPos.x + bound.left,
                    ruleEditor.xfrm.localPos.y + bound.top,
                    bound.width,
                    bound.height,
                    true,
                    false,
                ])
                imgr.blit(
                    0,
                    0,
                    bound.width,
                    bound.height,
                    img,
                    ruleEditor.xfrm.localPos.x - bound.left,
                    ruleEditor.xfrm.localPos.y - bound.top,
                    bound.width,
                    bound.height,
                    true,
                    false
                )
                r[`page_${p}_rule_${ri}`] = imgr
            })
            app.popScene()
        })

        const res = image.create(w, h)
        r["app"] = res
        res.fill(loader.color)
        let y = 0
        for (let i = 0; i < imgs.length; ++i) {
            const img = imgs[i]
            res.drawTransparentImage(img, 0, y)
            y += img.height + margin
        }

        app.popScene()
        return r
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
