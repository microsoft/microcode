namespace microcode {
    type SensorMap = { [id: string]: SensorDefn }
    type FilterMap = { [id: string]: FilterDefn }
    type ActuatorMap = { [id: string]: ActuatorDefn }
    type ModifierMap = { [id: string]: ModifierDefn }
    export type TileDefnMap = { [id: string]: TileDefn }

    export type TileDatabase = {
        [id: string]: TileDefnMap
        sensors: SensorMap
        filters: FilterMap
        actuators: ActuatorMap
        modifiers: ModifierMap
    }

    // Once a tid is assigned, it can NEVER BE CHANGED OR REPURPOSED.
    // Every tid must be unique in the set of all tids.
    export const TID_SENSOR_ALWAYS = "S1"
    export const TID_SENSOR_PRESS = "S2"
    export const TID_SENSOR_RELEASE = "S2B"
    export const TID_SENSOR_ACCELEROMETER = "S3"
    export const TID_SENSOR_TIMER = "S4"
    export const TID_SENSOR_LIGHT = "S5"
    export const TID_SENSOR_TEMP = "S6"
    export const TID_SENSOR_RADIO_RECEIVE = "S7"
    export const TID_SENSOR_MICROPHONE = "S8"
    export const TID_SENSOR_CUP_A_WRITTEN = "S9A"
    export const TID_SENSOR_CUP_B_WRITTEN = "S9B"
    export const TID_SENSOR_CUP_C_WRITTEN = "S9C"
    export const TID_SENSOR_MAGNET = "S10"

    // filters for TID_SENSOR_PRESS
    export const TID_FILTER_PIN_0 = "F0"
    export const TID_FILTER_PIN_1 = "F1"
    export const TID_FILTER_PIN_2 = "F2"
    export const TID_FILTER_BUTTON_A = "F3"
    export const TID_FILTER_BUTTON_B = "F4"
    // F6
    export const TID_FILTER_LOGO = "F7"
    export const TID_FILTER_VALUE_1 = "F8"
    export const TID_FILTER_VALUE_2 = "F9"
    export const TID_FILTER_VALUE_3 = "F10"
    export const TID_FILTER_VALUE_4 = "F11"
    export const TID_FILTER_VALUE_5 = "F12"
    export const TID_FILTER_TIMESPAN_SHORT = "F13"
    export const TID_FILTER_TIMESPAN_LONG = "F14"
    export const TID_FILTER_LOUD = "F15"
    export const TID_FILTER_QUIET = "F16"
    export const TID_FILTER_ACCEL = "F17"
    export const TID_FILTER_ACCEL_SHAKE = "F17_shake"
    export const TID_FILTER_ACCEL_FREEFALL = "F17_freefall"
    export const TID_FILTER_ACCEL_TILT_UP = "F17_tilt_up"
    export const TID_FILTER_ACCEL_TILT_DOWN = "F17_tilt_down"
    export const TID_FILTER_ACCEL_TILT_LEFT = "F17_tilt_left"
    export const TID_FILTER_ACCEL_TILT_RIGHT = "F17_tilt_right"
    export const TID_FILTER_TIMESPAN_RANDOM = "F18"
    export const TID_FILTER_TIMESPAN_VERY_LONG = "F19"

    export const TID_ACTUATOR_SWITCH_PAGE = "A1"
    export const TID_ACTUATOR_SPEAKER = "A2"
    export const TID_ACTUATOR_MICROPHONE = "A3"
    export const TID_ACTUATOR_MUSIC = "A4"
    export const TID_ACTUATOR_PAINT = "A5"
    export const TID_ACTUATOR_RADIO_SEND = "A6"
    export const TID_ACTUATOR_RANDOM_TOSS = "A7"
    export const TID_ACTUATOR_RGB_LED = "A8"
    export const TID_ACTUATOR_CUP_A_ASSIGN = "A9A"
    export const TID_ACTUATOR_CUP_B_ASSIGN = "A9B"
    export const TID_ACTUATOR_CUP_C_ASSIGN = "A9C"

    export const TID_MODIFIER_PAGE_1 = "M1"
    export const TID_MODIFIER_PAGE_2 = "M2"
    export const TID_MODIFIER_PAGE_3 = "M3"
    export const TID_MODIFIER_PAGE_4 = "M4"
    export const TID_MODIFIER_PAGE_5 = "M5"

    export const TID_MODIFIER_VALUE_1 = "M6"
    export const TID_MODIFIER_VALUE_2 = "M7"
    export const TID_MODIFIER_VALUE_3 = "M8"
    export const TID_MODIFIER_VALUE_4 = "M9"
    export const TID_MODIFIER_VALUE_5 = "M10"

    export const TID_MODIFIER_ON = "M11"
    export const TID_MODIFIER_OFF = "M12"

    export const TID_MODIFIER_ICON_EDITOR = "M15"
    export const TID_MODIFIER_COLOR_RED = "M16"
    export const TID_MODIFIER_COLOR_DARKPURPLE = "M17"
    export const TID_MODIFIER_MUSIC_EDITOR = "M18"

    export const TID_MODIFIER_EMOJI_GIGGLE = "M19giggle"
    export const TID_MODIFIER_EMOJI_HAPPY = "M19happy"
    export const TID_MODIFIER_EMOJI_HELLO = "M19hello"
    export const TID_MODIFIER_EMOJI_MYSTERIOUS = "M19mysterious"
    export const TID_MODIFIER_EMOJI_SAD = "M19sad"
    export const TID_MODIFIER_EMOJI_SLIDE = "M19slide"
    export const TID_MODIFIER_EMOJI_SOARING = "M19soaring"
    export const TID_MODIFIER_EMOJI_SPRING = "M19spring"
    export const TID_MODIFIER_EMOJI_TWINKLE = "M19twinkle"
    export const TID_MODIFIER_EMOJI_YAWN = "M19yawn"

    export const TID_MODIFIER_CUP_A_READ = "M20A"
    export const TID_MODIFIER_CUP_B_READ = "M20B"
    export const TID_MODIFIER_CUP_C_READ = "M20C"

    export const TID_MODIFIER_RGB_LED_COLOR_X = "A20_"
    export const TID_MODIFIER_RGB_LED_COLOR_1 = "A20_1"
    export const TID_MODIFIER_RGB_LED_COLOR_2 = "A20_2"
    export const TID_MODIFIER_RGB_LED_COLOR_3 = "A20_3"
    export const TID_MODIFIER_RGB_LED_COLOR_4 = "A20_4"
    export const TID_MODIFIER_RGB_LED_COLOR_5 = "A20_5"

    export const PAGE_IDS = [
        TID_MODIFIER_PAGE_1,
        TID_MODIFIER_PAGE_2,
        TID_MODIFIER_PAGE_3,
        TID_MODIFIER_PAGE_4,
        TID_MODIFIER_PAGE_5,
    ]

    export const tilesDB: TileDatabase = {
        sensors: {},
        filters: {},
        actuators: {},
        modifiers: {},
    }

    function copyJdSensor(dst: SensorDefn, src: SensorDefn) {
        dst.serviceClassName = src.serviceClassName
        dst.eventCode = src.eventCode
        dst.serviceInstanceIndex = src.serviceInstanceIndex
    }

    function copyJdActuator(dst: ActuatorDefn, src: ActuatorDefn) {
        dst.serviceClassName = src.serviceClassName
        dst.serviceCommand = src.serviceCommand
        dst.serviceInstanceIndex = src.serviceInstanceIndex
    }

    // initialize the database, imperatively!!!

    const terminal = {
        handling: {
            terminal: true,
        },
    }

    /*
    const maxOneValueIn = {
        maxCount: {
            category: "value_in",
            count: 1,
        },
    }

    const maxOneValueOut = {
        maxCount: {
            category: "value_out",
            count: 1,
        },
    }
    */

    const always = new SensorDefn(TID_SENSOR_ALWAYS, "Always", Phase.Pre)
    always.hidden = true
    tilesDB.sensors[TID_SENSOR_ALWAYS] = always

    function addPress(tid: string, name: string, evt: number) {
        const press_event = new SensorDefn(tid, name, Phase.Pre)
        press_event.serviceClassName = "button"
        press_event.eventCode = evt
        press_event.serviceInstanceIndex = 0
        press_event.constraints = {
            provides: ["input"],
            allow: {
                categories: ["press_event"],
            },
        }
        press_event.priority = 9 + evt
        tilesDB.sensors[tid] = press_event
    }

    addPress(TID_SENSOR_PRESS, "press", 1)
    addPress(TID_SENSOR_RELEASE, "up", 2)

    function addPressFilter(tid: string, name: string, instanceNo: number) {
        const press_filter = new FilterDefn(tid, name, "press_event", 10)
        press_filter.constraints = {
            handling: {
                terminal: true,
            },
            allow: {
                categories: ["press_event"],
            },
        }
        tilesDB.filters[tid] = press_filter
        press_filter.jdParam = instanceNo
    }

    addPressFilter(TID_FILTER_BUTTON_A, "A", 0)
    addPressFilter(TID_FILTER_BUTTON_B, "B", 1)
    addPressFilter(TID_FILTER_LOGO, "Logo", 2)
    addPressFilter(TID_FILTER_PIN_0, "Pin 0", 3)
    addPressFilter(TID_FILTER_PIN_1, "Pin 1", 4)
    addPressFilter(TID_FILTER_PIN_2, "Pin 2", 5)

    const makeSensor = (
        tid: string,
        name: string,
        cat: string,
        prior: number
    ) => {
        const tile = new SensorDefn(tid, name, Phase.Post)
        tile.constraints = {
            allow: {
                categories: [cat],
            },
        }
        tile.priority = prior
        tilesDB.sensors[tid] = tile
        return tile
    }

    function makeCupSensor(tid: string, name: string, id: number) {
        const tile = makeSensor(tid, name, "value_in", 120 + id * 5)
        tile.jdParam = id
        tile.serviceClassName = "cup"
        // tile.constraints.handling = maxOneValueIn
    }

    makeCupSensor(TID_SENSOR_CUP_A_WRITTEN, "cup A written", 0)
    makeCupSensor(TID_SENSOR_CUP_B_WRITTEN, "cup B written", 1)
    makeCupSensor(TID_SENSOR_CUP_C_WRITTEN, "cup C written", 2)

    const radio_recv = makeSensor(
        TID_SENSOR_RADIO_RECEIVE,
        "Receive",
        "value_in",
        100
    )
    radio_recv.serviceClassName = "radio"
    radio_recv.eventCode = 0x91
    // radio_recv.constraints.handling = maxOneValueIn

    const magnet = makeSensor(
        TID_SENSOR_MAGNET,
        "Magnetometer",
        "no_filters",
        500
    )
    magnet.serviceClassName = "magneticFieldLevel"
    magnet.eventCode = 1
    magnet.jdExternalClass = 0x12fe180f

    const timer = new SensorDefn(TID_SENSOR_TIMER, "Timer", Phase.Post)
    timer.constraints = {
        allow: {
            categories: ["timespan"],
        },
    }
    timer.priority = 110
    tilesDB.sensors[TID_SENSOR_TIMER] = timer

    function addTimespan(tid: string, name: string, ms: number) {
        const timespan = new FilterDefn(tid, name, "timespan", 10)
        timespan.jdParam = ms
        tilesDB.filters[tid] = timespan
    }
    addTimespan(TID_FILTER_TIMESPAN_SHORT, "short", 250)
    addTimespan(TID_FILTER_TIMESPAN_LONG, "long", 1000)
    addTimespan(TID_FILTER_TIMESPAN_VERY_LONG, "very long", 5000)
    addTimespan(TID_FILTER_TIMESPAN_RANDOM, "random", -1000)

    const accel = new SensorDefn(
        TID_SENSOR_ACCELEROMETER,
        "Accelerometer",
        Phase.Post
    )
    accel.constraints = {
        allow: {
            categories: ["accel_event"],
        },
    }
    accel.serviceClassName = "accelerometer"
    accel.eventCode = 0x8b // shake
    accel.priority = 20
    tilesDB.sensors[TID_SENSOR_ACCELEROMETER] = accel

    function addAccelEvent(id: number, name: string) {
        const tid = TID_FILTER_ACCEL + "_" + name
        const accelEvent = new FilterDefn(tid, name, "accel_event", 10)
        accelEvent.eventCode = id
        accelEvent.constraints = terminal
        tilesDB.filters[tid] = accelEvent
        return accelEvent
    }

    addAccelEvent(0x8b, "shake")
    // don't want kids to throw micro:bit on the ground
    // addAccelEvent(0x87, "freefall")
    addAccelEvent(0x81, "tilt_up")
    addAccelEvent(0x82, "tilt_down")
    addAccelEvent(0x83, "tilt_left")
    addAccelEvent(0x84, "tilt_right")

    const microphone = new SensorDefn(
        TID_SENSOR_MICROPHONE,
        "Microphone",
        Phase.Post
    )
    microphone.constraints = {
        allow: {
            categories: ["sound_event"],
        },
    }
    microphone.priority = 30
    microphone.serviceClassName = "soundLevel"
    microphone.eventCode = 1 // laud by default
    tilesDB.sensors[TID_SENSOR_MICROPHONE] = microphone
    function addSoundFilter(tid: string, name: string, eventCode: number) {
        const soundFilter = new FilterDefn(tid, name, "sound_event", 10)
        soundFilter.constraints = terminal
        tilesDB.filters[tid] = soundFilter
        soundFilter.eventCode = eventCode
    }
    addSoundFilter(TID_FILTER_LOUD, "loud", 1)
    addSoundFilter(TID_FILTER_QUIET, "quiet", 2)

    // actuators are:

    // - paint screen
    // - assign variable
    // - send radio message
    // - speaker play
    // - switch page (micro:bit independent)

    function addActuator(
        tid: string,
        name: string,
        allow: string,
        allow2: string = null
    ) {
        const actuator = new ActuatorDefn(tid, name)
        actuator.constraints = {
            allow: {
                categories: allow2 ? [allow, allow2] : [allow],
            },
        }
        tilesDB.actuators[tid] = actuator
        return actuator
    }

    const swtch = addActuator(TID_ACTUATOR_SWITCH_PAGE, "Switch page", "page")
    swtch.priority = 110
    const paint = addActuator(TID_ACTUATOR_PAINT, "Paint", "icon_editor")
    paint.serviceClassName = "dotMatrix"
    paint.serviceCommand = jacs.CMD_SET_REG | 0x2
    paint.serviceInstanceIndex = 0
    paint.priority = 10

    const radio_send = addActuator(TID_ACTUATOR_RADIO_SEND, "Send", "value_out")
    radio_send.priority = 100
    radio_send.serviceClassName = "radio"
    radio_send.serviceCommand = 0x81
    radio_send.serviceArgFromModifier = (x: number) =>
        Buffer.pack("d", [x || 1])
    // radio_send.constraints.handling = maxOneValueOut

    const varA = addActuator(TID_ACTUATOR_CUP_A_ASSIGN, "Into A", "value_out")
    varA.jdParam = 0
    const varB = addActuator(TID_ACTUATOR_CUP_B_ASSIGN, "Into B", "value_out")
    varB.jdParam = 1
    const varC = addActuator(TID_ACTUATOR_CUP_C_ASSIGN, "Into C", "value_out")
    varC.jdParam = 2

    const emoji = addActuator(TID_ACTUATOR_SPEAKER, "Speaker", "sound_emoji")
    emoji.serviceClassName = "soundPlayer"
    emoji.serviceCommand = 0x80
    emoji.serviceArgFromModifier = (x: string) => x || "hello"
    emoji.priority = 20

    const emojis = [
        "giggle",
        "happy",
        "hello",
        "mysterious",
        "sad",
        "slide",
        "soaring",
        "spring",
        "twinkle",
        "yawn",
    ]
    emojis.forEach(e => {
        const tid = "M19" + e
        const emoji_mod = new ModifierDefn(tid, e, "sound_emoji", 10)
        emoji_mod.constraints = terminal
        emoji_mod.jdParam = e
        tilesDB.modifiers[tid] = emoji_mod
    })

    /*
    const buzzer = addActuator(TID_ACTUATOR_MUSIC, "Music", "music_editor")
    buzzer.serviceClassName = "buzzer"
    buzzer.serviceCommand = 0x80
    buzzer.priority = 30
    */

    const make_vals = (name: string, kind: string, start: number) => {
        const tiles: FilterModifierBase[] = []
        for (let v = 1; v <= 5; v++) {
            const tid = kind + (start + v - 1)
            const tile: FilterModifierBase =
                kind == "M"
                    ? new ModifierDefn(tid, name + " " + v.toString(), name, 10)
                    : new FilterDefn(tid, name + " " + v.toString(), name, 10)
            tile.jdParam = v
            // tile.constraints = terminal
            if (kind == "M") tilesDB.modifiers[tid] = tile
            else tilesDB.filters[tid] = tile as FilterDefn
            tile.constraints = {
                provides: [name],
            }
            tiles.push(tile)
        }
        return tiles
    }
    make_vals("value_in", "F", 8)
    make_vals("value_out", "M", 6)
    make_vals("page", "M", 1).forEach(m => {
        m.constraints.handling = m.constraints.handling || {}
        m.constraints.handling.terminal = true
    })

    const switch_states = ["on", "off"]
    switch_states.forEach(state => {
        const state_tid = state == "on" ? TID_MODIFIER_ON : TID_MODIFIER_OFF
        const state_page = new ModifierDefn(state_tid, state, "on_off", 10)
        state_page.constraints = terminal
        tilesDB.modifiers[state_tid] = state_page
    })

    const numLeds = 8
    function addRGB(id: number, name: string, buf: Buffer) {
        const tid = TID_MODIFIER_RGB_LED_COLOR_X + id
        const mod = new ModifierDefn(tid, name, "rgb_led", 10)
        mod.constraints = terminal
        tilesDB.modifiers[tid] = mod
        mod.jdParam = buf
    }

    addRGB(1, "red", hex`2f0000`)
    addRGB(2, "green", hex`002f00`)
    addRGB(3, "blue", hex`00002f`)
    addRGB(4, "magenta", hex`2f002f`)
    addRGB(5, "yellow", hex`2f2f00`)
    // addRGB(4, "teal", hex`00ffff`)
    // addRGB(4, "white", hex`ffffff`)

    const rgbled = addActuator(TID_ACTUATOR_RGB_LED, "RGB LED", "rgb_led")
    rgbled.priority = 500
    rgbled.serviceClassName = "led"
    rgbled.serviceCommand = jacs.CMD_SET_REG | 2
    rgbled.jdExternalClass = 0x1609d4f0
    rgbled.serviceArgFromModifier = (buf: Buffer) => {
        if (!buf) buf = hex`2f2f2f`
        let b = buf
        if (buf.length < numLeds * 3) {
            b = Buffer.create(numLeds * 3)
            let ptr = 0
            while (ptr < b.length) {
                b.write(ptr, buf)
                ptr += buf.length
            }
        }
        return b
    }

    const addCupReadModifier = (tid: string, state: string, varid: number) => {
        const mod = new ModifierDefn(tid, state, "value_out", 10)
        mod.jdParam = varid
        tilesDB.modifiers[tid] = mod
    }
    addCupReadModifier(TID_MODIFIER_CUP_A_READ, "value of variable A", 0)
    addCupReadModifier(TID_MODIFIER_CUP_B_READ, "value of variable B", 1)
    addCupReadModifier(TID_MODIFIER_CUP_C_READ, "value of variable C", 2)
    const addPipeOutFilter = (tid: string, state: string, varid: number) => {
        const mod = new FilterDefn(tid, state, "value_in", 10)
        mod.jdParam = varid
        tilesDB.filters[tid] = mod
    }

    const iconFieldEditor: FieldEditor = {
        init: img`
        . . . . .
        . 1 . 1 .
        . . . . . 
        1 . . . 1
        . 1 1 1 .
        `,
        clone: (img: Image) => img.clone(),
        editor: iconEditor,
        toImage: scaleUp,
        buttonStyle: () => ButtonStyles.BorderedPurple,
        serialize: (img: Image) => {
            const ret: string[] = []
            for (let index = 0; index < 25; index++) {
                let col = index % 5
                let row = index / 5
                ret.push(img.getPixel(col, row) ? "1" : "0")
            }
            return ret.join("")
        },
        deserialize: (s: string) => {
            const img = image.create(5, 5)
            for (let index = 0; index < 25; index++) {
                let col = index % 5
                let row = index / 5
                img.setPixel(col, row, s[index] == "1" ? 1 : 0)
            }
            return img
        },
    }

    class IconEditor extends ModifierDefn {
        field: Image
        constructor(field: Image = null) {
            super(TID_MODIFIER_ICON_EDITOR, "icon editor", "icon_editor", 10)
            this.fieldEditor = iconFieldEditor
            if (field) this.field = field
            else this.field = this.fieldEditor.clone(this.fieldEditor.init)
        }

        getField() {
            return this.field
        }

        getIcon(): Image {
            return this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: any) {
            return new IconEditor(field ? field : this.field.clone())
        }

        serviceCommandArg() {
            const buf = Buffer.create(5)
            for (let col = 0; col < 5; ++col) {
                let v = 0
                for (let row = 0; row < 5; ++row) {
                    if (this.field.getPixel(col, row)) v |= 1 << row
                }
                buf[col] = v
            }
            return buf
        }
    }

    tilesDB.modifiers[TID_MODIFIER_ICON_EDITOR] = new IconEditor()

    export type NoteField = { note: number }
    const musicFieldEditor: FieldEditor = {
        init: { note: 0 },
        clone: (field: NoteField) => {
            return {
                note: field.note,
            }
        },
        editor: musicEditor,
        toImage: noteToImage,
        buttonStyle: () => ButtonStyles.ShadowedWhite,
        serialize: (field: NoteField) => field.note.toString(),
        deserialize: (note: string) => {
            return { note: parseInt(note) }
        },
    }

    class MusicEditor extends ModifierDefn {
        field: NoteField
        constructor(field: NoteField = null) {
            super(TID_MODIFIER_MUSIC_EDITOR, "music editor", "music_editor", 10)
            this.fieldEditor = musicFieldEditor
            if (field) {
                this.field = { note: field.note }
            } else {
                this.field = this.fieldEditor.clone(this.fieldEditor.init)
            }
        }

        getField() {
            return this.field
        }

        getIcon(): Image {
            return this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: NoteField) {
            return new MusicEditor({
                note: field ? field.note : this.field.note,
            })
        }

        serviceCommandArg() {
            // generated with scripts/notes.js:
            const periodMap = hex`ee0e4d0dda0b2f0bf709e108e9077707a706ed059805fc047004f403bc03`
            const note = Math.clamp(0, this.field.note, 15)
            const period = periodMap.getNumber(NumberFormat.UInt16LE, note << 1)

            const r = Buffer.create(6)
            r.setNumber(NumberFormat.UInt16LE, 0, period)
            r.setNumber(NumberFormat.UInt16LE, 2, period >> 1)
            r.setNumber(NumberFormat.UInt16LE, 4, 400) // ms
            return r
        }
    }

    tilesDB.modifiers[TID_MODIFIER_MUSIC_EDITOR] = new MusicEditor()

    export type RandomUpper = { upper: number }
    const randomFieldEditor: FieldEditor = {
        init: { upper: 3 },
        clone: (field: RandomUpper) => {
            return {
                upper: field.upper,
            }
        },
        editor: randomEditor,
        toImage: upperToImage,
        buttonStyle: () => ButtonStyles.ShadowedWhite,
        serialize: (field: RandomUpper) => field.upper.toString(),
        deserialize: (upper: string) => {
            return { upper: parseInt(upper) }
        },
    }

    class RandomEditor extends ActuatorDefn {
        field: RandomUpper
        first: boolean
        constructor(field: RandomUpper = null) {
            super(TID_ACTUATOR_RANDOM_TOSS, "Toss")
            this.fieldEditor = randomFieldEditor
            if (field) {
                this.field = { upper: field.upper }
            } else {
                this.field = this.fieldEditor.clone(this.fieldEditor.init)
            }
            this.priority = 70
            this.first = false
            // TODO constraints
        }

        getField() {
            return this.field
        }

        getIcon(): string | Image {
            return this.first ? this.tid : this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: RandomUpper) {
            return new RandomEditor({
                upper: field ? field.upper : this.field.upper,
            })
        }

        serviceCommandArg() {
            const r = Buffer.create(6)
            return r
        }
    }

    const random_toss = addActuator(
        TID_ACTUATOR_RANDOM_TOSS,
        "Toss",
        "value_out"
    )
    random_toss.priority = 70
    random_toss.constraints.disallow = { tiles: [TID_MODIFIER_VALUE_1] }

    /*
    const first_random = new RandomEditor()
    tilesDB.actuators[TID_ACTUATOR_RANDOM_TOSS] = first_random
    first_random.first = true
    */
}
