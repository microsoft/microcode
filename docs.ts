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
            Buffer.fromUTF8(
                JSON.stringify({
                    type: "art",
                    samples: microcode.rawSamples(),
                    images,
                })
            )
        )
    }

    function renderSamples(images: RenderedImage[]) {
        app.popScene()
        for (const sample of microcode.samples(false)) {
            console.log(`render sample ${sample.label}`)
            const icon = microcode.icons.get(sample.icon, true)
            if (icon) appendImage(images, "icon_sample", sample.label, icon)
            app.saveBuffer(microcode.SAVESLOT_AUTO, sample.source)
            // read the buffer and convert to B64
            // const saved: microcode.SavedState = JSON.parse(
            //     sample.source.toString()
            // )
            // const progdef = microcode.progDefnFromJson(saved.progdef)
            // app.save(microcode.SAVESLOT_AUTO, progdef)

            // const buf = settings.readBuffer(microcode.SAVESLOT_AUTO)
            // const buf64 = buf.toBase64()
            // console.log(buf64)

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
        microcode.Screen.resetScreenImage()
    }

    //% shim=TD_NOOP
    function _renderScreenshot() {
        const res = _renderProgram()
        const images: RenderedImage[] = []
        Object.keys(res).forEach(iname =>
            appendImage(
                images,
                "program",
                iname == "app" ? "current" : `current_${iname}`,
                res[iname]
            )
        )
        microcode.Screen.resetScreenImage()
        control.simmessages.send(
            "docs",
            Buffer.fromUTF8(
                JSON.stringify({
                    type: "art",
                    images,
                })
            )
        )
    }

    //% shim=TD_NOOP
    function _renderProgram(): { [name: string]: Image } {
        const r: { [name: string]: Image } = {}
        const loader = new microcode.Editor(app)
        loader.rendering = true
        app.pushScene(loader)
        loader.cursor.visible = false

        const pages = loader.nonEmptyPages()

        let imgs: Image[] = []
        let w = 0
        let h = 0
        const margin = 4

        // compute largest rule width
        let pw = 160
        for (const p of pages) {
            loader.switchToPage(p)
            const rw = loader.ruleWidth()
            pw = Math.max(pw, rw)
        }
        // when the width is too large (>255?), bad things happen
        pw = Math.min(255, pw)

        // render all pages
        loader.nonEmptyPages().forEach(p => {
            loader.switchToPage(p)
            loader.pageEditor.layout()
            microcode.Screen.setImageSize(pw, loader.pageHeight())
            const editor = new microcode.Editor(app)
            editor.rendering = true
            app.pushScene(editor)
            editor.cursor.visible = false
            pause(500)
            microcode.Screen.image.fill(editor.color)
            editor.renderPage(p)
            const img = microcode.Screen.image.clone()
            imgs.push(img)
            w = Math.max(w, img.width)
            h += img.height + margin

            r[`page_${p + 1}`] = img

            // render individual rules
            const pageEditor = editor.pageEditor
            const rulesEditor = pageEditor.ruleEditors
            rulesEditor.forEach((ruleEditor, ri) => {
                const bound = ruleEditor.bounds
                const imgr = image.create(bound.width, bound.height)
                imgr.fill(loader.color)
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
                r[`page_${p + 1}_rule_${ri + 1}`] = imgr
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
        type: "icon" | "sample" | "icon_sample" | "image" | "program",
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

    function names() {
        return [
            "clap_lights",
            "firefly",
            "flashing_heart",
            "rock_paper_scissors",
            "teleport_duck",
            "pet_hamster",
            "heads_tails",
            "reaction_time",
            "hot_potato",
            "clap_lights",
            "railroad_crossing",
            microcode.TID_ACTUATOR_CAR,
            microcode.TID_MODIFIER_CAR_FORWARD,
            microcode.TID_MODIFIER_CAR_FORWARD_FAST,
            microcode.TID_MODIFIER_CAR_REVERSE,
            microcode.TID_MODIFIER_CAR_TURN_LEFT,
            microcode.TID_MODIFIER_CAR_TURN_RIGHT,
            microcode.TID_MODIFIER_CAR_STOP,
            microcode.TID_MODIFIER_CAR_SPIN_LEFT,
            microcode.TID_MODIFIER_CAR_SPIN_RIGHT,
            microcode.TID_MODIFIER_CAR_LED_COLOR_1,
            microcode.TID_MODIFIER_CAR_LED_COLOR_2,
            microcode.TID_MODIFIER_CAR_LED_COLOR_3,
            microcode.TID_SENSOR_CAR_WALL,
            microcode.TID_SENSOR_LINE,
            microcode.TID_FILTER_LINE_LEFT,
            microcode.TID_FILTER_LINE_RIGHT,
            microcode.TID_FILTER_LINE_BOTH,
            microcode.TID_FILTER_LINE_NEITHER,
            microcode.TID_FILTER_LINE_NEITHER_LEFT,
            microcode.TID_FILTER_LINE_NEITHER_RIGHT,
            microcode.TID_FILTER_KITA_KEY_1,
            microcode.TID_FILTER_KITA_KEY_2,
            microcode.TID_SENSOR_MAGNET,
            microcode.TID_SENSOR_SLIDER,
            microcode.TID_SENSOR_ROTARY,
            microcode.TID_FILTER_ROTARY_LEFT,
            microcode.TID_FILTER_ROTARY_RIGHT,
            microcode.TID_ACTUATOR_RGB_LED,
            microcode.TID_MODIFIER_RGB_LED_COLOR_1,
            microcode.TID_MODIFIER_RGB_LED_COLOR_2,
            microcode.TID_MODIFIER_RGB_LED_COLOR_3,
            microcode.TID_MODIFIER_RGB_LED_COLOR_4,
            microcode.TID_MODIFIER_RGB_LED_COLOR_5,
            microcode.TID_MODIFIER_RGB_LED_COLOR_6,
            microcode.TID_MODIFIER_RGB_LED_COLOR_RAINBOW,
            microcode.TID_MODIFIER_RGB_LED_COLOR_SPARKLE,
            microcode.TID_ACTUATOR_SERVO_SET_ANGLE,
            // editor icons
            "delete",
            "plus",
            "arith_plus",
            "arith_equals",
            "when_insertion_point",
            "do_insertion_point",
            "rule_arrow",
            "rule_handle",
            "edit_program",
            "new_program",
            "MISSING",
            "disk",
            "disk1",
            "disk2",
            "disk3",
            "largeDisk",
            // basic colors led editor
            "solid_red",
            "solid_black",
            "note_on",
            "note_off",
            "smiley_buttons",
            microcode.TID_SENSOR_START_PAGE,
            microcode.TID_ACTUATOR_SWITCH_PAGE,
            microcode.TID_MODIFIER_PAGE_1,
            microcode.TID_MODIFIER_PAGE_2,
            microcode.TID_MODIFIER_PAGE_3,
            microcode.TID_MODIFIER_PAGE_4,
            microcode.TID_MODIFIER_PAGE_5,
            // looping
            microcode.TID_MODIFIER_LOOP,

            // variables

            microcode.TID_SENSOR_CUP_X_WRITTEN,
            microcode.TID_SENSOR_CUP_Y_WRITTEN,
            microcode.TID_SENSOR_CUP_Z_WRITTEN,
            microcode.TID_FILTER_CUP_X_READ,
            microcode.TID_FILTER_CUP_Y_READ,
            microcode.TID_FILTER_CUP_Z_READ,
            microcode.TID_ACTUATOR_CUP_X_ASSIGN,
            microcode.TID_ACTUATOR_CUP_Y_ASSIGN,
            microcode.TID_ACTUATOR_CUP_Z_ASSIGN,
            microcode.TID_MODIFIER_CUP_X_READ,
            microcode.TID_MODIFIER_CUP_Y_READ,
            microcode.TID_MODIFIER_CUP_Z_READ,

            // numbers
            microcode.TID_MODIFIER_RANDOM_TOSS,
            microcode.TID_FILTER_COIN_1,
            microcode.TID_FILTER_COIN_2,
            microcode.TID_FILTER_COIN_3,
            microcode.TID_FILTER_COIN_4,
            microcode.TID_FILTER_COIN_5,
            microcode.TID_MODIFIER_COIN_1,
            microcode.TID_MODIFIER_COIN_2,
            microcode.TID_MODIFIER_COIN_3,
            microcode.TID_MODIFIER_COIN_4,
            microcode.TID_MODIFIER_COIN_5,

            // micro:bit sensors
            microcode.TID_SENSOR_ACCELEROMETER,
            microcode.TID_SENSOR_TIMER,
            microcode.TID_SENSOR_RADIO_RECEIVE,
            microcode.TID_SENSOR_PRESS,
            microcode.TID_SENSOR_RELEASE,
            microcode.TID_SENSOR_MICROPHONE,
            microcode.TID_SENSOR_TEMP,
            microcode.TID_SENSOR_LIGHT,

            // micro:bit filters
            microcode.TID_FILTER_LOGO,
            microcode.TID_FILTER_PIN_0,
            microcode.TID_FILTER_PIN_1,
            microcode.TID_FILTER_PIN_2,
            microcode.TID_FILTER_BUTTON_A,
            microcode.TID_FILTER_BUTTON_B,
            microcode.TID_FILTER_TIMESPAN_SHORT,
            microcode.TID_FILTER_TIMESPAN_LONG,
            microcode.TID_FILTER_TIMESPAN_VERY_LONG,
            microcode.TID_FILTER_TIMESPAN_RANDOM,
            microcode.TID_FILTER_LOUD,
            microcode.TID_FILTER_QUIET,
            microcode.TID_FILTER_TEMP_WARMER,
            microcode.TID_FILTER_TEMP_COLDER,
            microcode.TID_FILTER_ACCEL_SHAKE,
            microcode.TID_FILTER_ACCEL_TILT_UP,
            microcode.TID_FILTER_ACCEL_TILT_DOWN,
            microcode.TID_FILTER_ACCEL_TILT_LEFT,
            microcode.TID_FILTER_ACCEL_TILT_RIGHT,

            // micro:bit actuators
            microcode.TID_ACTUATOR_PAINT,
            microcode.TID_ACTUATOR_SHOW_NUMBER,
            microcode.TID_ACTUATOR_RADIO_SEND,
            microcode.TID_ACTUATOR_RADIO_SET_GROUP,
            microcode.TID_ACTUATOR_MICROPHONE,
            microcode.TID_ACTUATOR_SPEAKER,
            microcode.TID_ACTUATOR_MUSIC,

            // micro:bit modifiers
            microcode.TID_MODIFIER_ICON_EDITOR,
            microcode.TID_MODIFIER_MELODY_EDITOR,

            microcode.TID_MODIFIER_EMOJI_GIGGLE,
            microcode.TID_MODIFIER_EMOJI_HAPPY,
            microcode.TID_MODIFIER_EMOJI_HELLO,
            microcode.TID_MODIFIER_EMOJI_MYSTERIOUS,
            microcode.TID_MODIFIER_EMOJI_SAD,
            microcode.TID_MODIFIER_EMOJI_SLIDE,
            microcode.TID_MODIFIER_EMOJI_SOARING,
            microcode.TID_MODIFIER_EMOJI_SPRING,
            microcode.TID_MODIFIER_EMOJI_TWINKLE,
            microcode.TID_MODIFIER_EMOJI_YAWN,

            microcode.TID_MODIFIER_TEMP_READ,
            microcode.TID_MODIFIER_RADIO_VALUE,
        ]
    }

    function renderIcons(images: RenderedImage[]) {
        for (const name of names()) {
            console.log(`render icon ${name}`)
            const icon = microcode.icons.get(name)
            appendImage(images, `icon`, name, icon)
        }
    }
}
