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
    export const TID_SENSOR_START_PAGE = "S1"
    export const TID_SENSOR_PRESS = "S2"
    export const TID_SENSOR_RELEASE = "S2B"
    export const TID_SENSOR_ACCELEROMETER = "S3"
    export const TID_SENSOR_TIMER = "S4"
    export const TID_SENSOR_LIGHT = "S5"
    export const TID_SENSOR_TEMP = "S6"
    export const TID_SENSOR_RADIO_RECEIVE = "S7"
    export const TID_SENSOR_MICROPHONE = "S8"
    export const TID_SENSOR_CUP_X_WRITTEN = "S9A"
    export const TID_SENSOR_CUP_Y_WRITTEN = "S9B"
    export const TID_SENSOR_CUP_Z_WRITTEN = "S9C"
    export const TID_SENSOR_MAGNET = "S10"

    // filters for TID_SENSOR_PRESS
    export const TID_FILTER_PIN_0 = "F0"
    export const TID_FILTER_PIN_1 = "F1"
    export const TID_FILTER_PIN_2 = "F2"
    export const TID_FILTER_BUTTON_A = "F3"
    export const TID_FILTER_BUTTON_B = "F4"
    // F6
    export const TID_FILTER_LOGO = "F7"
    export const TID_FILTER_COIN_1 = "F8"
    export const TID_FILTER_COIN_2 = "F9"
    export const TID_FILTER_COIN_3 = "F10"
    export const TID_FILTER_COIN_4 = "F11"
    export const TID_FILTER_COIN_5 = "F12"
    export const TID_FILTER_TIMESPAN_SHORT = "F13"
    export const TID_FILTER_TIMESPAN_LONG = "F14"
    export const TID_FILTER_LOUD = "F15"
    export const TID_FILTER_QUIET = "F16"
    export const TID_FILTER_ACCEL = "F17"
    export const TID_FILTER_ACCEL_SHAKE = "F17_shake"
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
    export const TID_ACTUATOR_RADIO_SET_GROUP = "A6A"
    export const TID_ACTUATOR_RGB_LED = "A8"
    export const TID_ACTUATOR_CUP_X_ASSIGN = "A9A"
    export const TID_ACTUATOR_CUP_Y_ASSIGN = "A9B"
    export const TID_ACTUATOR_CUP_Z_ASSIGN = "A9C"
    export const TID_ACTUATOR_SHOW_NUMBER = "A10"

    export const TID_MODIFIER_PAGE_1 = "M1"
    export const TID_MODIFIER_PAGE_2 = "M2"
    export const TID_MODIFIER_PAGE_3 = "M3"
    export const TID_MODIFIER_PAGE_4 = "M4"
    export const TID_MODIFIER_PAGE_5 = "M5"

    export const TID_MODIFIER_COIN_1 = "M6"
    export const TID_MODIFIER_COIN_2 = "M7"
    export const TID_MODIFIER_COIN_3 = "M8"
    export const TID_MODIFIER_COIN_4 = "M9"
    export const TID_MODIFIER_COIN_5 = "M10"

    export const TID_MODIFIER_ICON_EDITOR = "M15"
    export const TID_MODIFIER_COLOR_RED = "M16"
    export const TID_MODIFIER_COLOR_DARKPURPLE = "M17"

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

    export const TID_MODIFIER_CUP_X_READ = "M20A"
    export const TID_MODIFIER_CUP_Y_READ = "M20B"
    export const TID_MODIFIER_CUP_Z_READ = "M20C"
    export const TID_MODIFIER_RADIO_VALUE = "M21"
    export const TID_MODIFIER_RANDOM_TOSS = "M22"
    export const TID_MODIFIER_LOOP = "M23"

    export const TID_MODIFIER_RGB_LED_COLOR_X = "A20_"
    export const TID_MODIFIER_RGB_LED_COLOR_1 = "A20_1"
    export const TID_MODIFIER_RGB_LED_COLOR_2 = "A20_2"
    export const TID_MODIFIER_RGB_LED_COLOR_3 = "A20_3"
    export const TID_MODIFIER_RGB_LED_COLOR_4 = "A20_4"
    export const TID_MODIFIER_RGB_LED_COLOR_5 = "A20_5"
    export const TID_MODIFIER_RGB_LED_COLOR_6 = "A20_6"
    export const TID_MODIFIER_RGB_LED_COLOR_RAINBOW = "A20_rainbow"
    export const TID_MODIFIER_RGB_LED_COLOR_SPARKLE = "A20_sparkle"

    export const TID_MODIFIER_SERVO_SET_ANGLE = "A21_"

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

    // initialize the database, imperatively!!!

    const terminal = {
        handling: {
            terminal: true,
        },
    }

    function addButtonTiles() {
        function addPress(tid: string, evt: number) {
            const press_event = new SensorDefn(tid, Phase.Pre)
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

        addPress(TID_SENSOR_PRESS, 1)
        addPress(TID_SENSOR_RELEASE, 2)

        function addPressFilter(tid: string, instanceNo: number) {
            const press_filter = new FilterDefn(tid, "press_event", 10)
            press_filter.constraints = {
                handling: {
                    terminal: true,
                },
                allow: {
                    categories: ["press_event"],
                },
            }
            tilesDB.filters[tid] = press_filter
            press_filter.jdKind = JdKind.ServiceInstanceIndex
            press_filter.jdParam = instanceNo
        }

        addPressFilter(TID_FILTER_BUTTON_A, 0)
        addPressFilter(TID_FILTER_BUTTON_B, 1)
        addPressFilter(TID_FILTER_LOGO, 2)
        addPressFilter(TID_FILTER_PIN_0, 3)
        addPressFilter(TID_FILTER_PIN_1, 4)
        addPressFilter(TID_FILTER_PIN_2, 5)
    }

    function addSensorTiles() {
        function makeSensor(tid: string, cat: string, prior: number) {
            const tile = new SensorDefn(tid, Phase.Post)
            tile.constraints = {
                allow: {
                    categories: [cat],
                },
            }
            tile.priority = prior
            tilesDB.sensors[tid] = tile
            return tile
        }

        makeSensor(TID_SENSOR_START_PAGE, "timespan", 108)

        addButtonTiles()

        function makeCupSensor(tid: string, id: number) {
            const tile = makeSensor(tid, "value_in", 120 + id * 5)
            tile.jdKind = JdKind.Variable
            tile.jdParam = id
            tile.priority = 200 + id
            // tile.constraints.handling = maxOneValueIn
        }

        makeCupSensor(TID_SENSOR_CUP_X_WRITTEN, 0)
        makeCupSensor(TID_SENSOR_CUP_Y_WRITTEN, 1)
        makeCupSensor(TID_SENSOR_CUP_Z_WRITTEN, 2)

        const radio_recv = makeSensor(TID_SENSOR_RADIO_RECEIVE, "value_in", 100)
        radio_recv.serviceClassName = "radio"
        radio_recv.eventCode = 0x91
        radio_recv.jdKind = JdKind.Radio
        // radio_recv.constraints.handling = maxOneValueIn

        const magnet = makeSensor(TID_SENSOR_MAGNET, "no_filters", 500)
        magnet.serviceClassName = "magneticFieldLevel"
        magnet.eventCode = 1
        magnet.jdExternalClass = 0x12fe180f

        const timer = new SensorDefn(TID_SENSOR_TIMER, Phase.Post)
        timer.constraints = {
            allow: {
                categories: ["timespan"],
            },
        }
        timer.priority = 110
        tilesDB.sensors[TID_SENSOR_TIMER] = timer

        function addTimespan(tid: string, ms: number) {
            const timespan = new FilterDefn(tid, "timespan", 10)
            timespan.jdKind = JdKind.Timespan
            timespan.jdParam = ms
            tilesDB.filters[tid] = timespan
        }
        addTimespan(TID_FILTER_TIMESPAN_SHORT, 250)
        addTimespan(TID_FILTER_TIMESPAN_LONG, 1000)
        addTimespan(TID_FILTER_TIMESPAN_VERY_LONG, 5000)
        addTimespan(TID_FILTER_TIMESPAN_RANDOM, -1000)

        const accel = new SensorDefn(TID_SENSOR_ACCELEROMETER, Phase.Post)
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
            const accelEvent = new FilterDefn(tid, "accel_event", 10)
            accelEvent.jdKind = JdKind.EventCode
            accelEvent.jdParam = id
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

        const microphone = new SensorDefn(TID_SENSOR_MICROPHONE, Phase.Post)
        microphone.constraints = {
            allow: {
                categories: ["sound_event"],
            },
        }
        microphone.priority = 30
        microphone.serviceClassName = "soundLevel"
        microphone.eventCode = 1 // laud by default
        tilesDB.sensors[TID_SENSOR_MICROPHONE] = microphone
        function addSoundFilter(tid: string, eventCode: number) {
            const soundFilter = new FilterDefn(tid, "sound_event", 10)
            soundFilter.constraints = terminal
            tilesDB.filters[tid] = soundFilter
            soundFilter.jdKind = JdKind.EventCode
            soundFilter.jdParam = eventCode
        }
        addSoundFilter(TID_FILTER_LOUD, 1)
        addSoundFilter(TID_FILTER_QUIET, 2)
    }

    function addActuatorTiles() {
        // actuators are:

        // - paint screen
        // - assign variable
        // - send radio message
        // - speaker play
        // - switch page (micro:bit independent)

        function addActuator(tid: string, allows: string[]) {
            const actuator = new ActuatorDefn(tid)
            actuator.constraints = {
                allow: {
                    categories: allows,
                },
            }
            tilesDB.actuators[tid] = actuator
            return actuator
        }

        const swtch = addActuator(TID_ACTUATOR_SWITCH_PAGE, ["page"])
        swtch.priority = 110

        const paint = addActuator(TID_ACTUATOR_PAINT, ["icon_editor", "loop"])
        paint.serviceClassName = "dotMatrix"
        paint.serviceCommand = jacs.CMD_SET_REG | 0x2
        paint.priority = 10
        paint.jdKind = JdKind.Sequence
        paint.jdParam = "dot_animation"
        paint.jdParam2 = 5
        paint.defaultModifier = new IconEditor()

        const radio_send = addActuator(TID_ACTUATOR_RADIO_SEND, [
            "value_out",
            "constant",
        ])
        radio_send.priority = 100
        radio_send.serviceClassName = "radio"
        radio_send.serviceCommand = 0x81
        radio_send.jdKind = JdKind.NumFmt
        radio_send.jdParam = jacs.NumFmt.F64

        const radio_set_group = addActuator(TID_ACTUATOR_RADIO_SET_GROUP, [])
        radio_set_group.constraints = {}
        radio_set_group.constraints.only = ["constant"]
        radio_set_group.priority = 101
        radio_set_group.serviceClassName = "radio"
        radio_set_group.jdKind = JdKind.NumFmt
        radio_set_group.jdParam = jacs.NumFmt.U8
        radio_set_group.serviceCommand = jacs.CMD_SET_REG | 0x80

        function addAssign(tid: string, id: number) {
            const theVar = addActuator(tid, ["value_out", "constant"])
            theVar.jdParam = id
            theVar.jdKind = JdKind.Variable
            theVar.priority = 200 + id
            return theVar
        }

        addAssign(TID_ACTUATOR_CUP_X_ASSIGN, 0)
        addAssign(TID_ACTUATOR_CUP_Y_ASSIGN, 1)
        addAssign(TID_ACTUATOR_CUP_Z_ASSIGN, 2)

        const showNum = addAssign(TID_ACTUATOR_SHOW_NUMBER, 10)
        showNum.priority = 11
        showNum.jdKind = JdKind.ExtLibFn
        showNum.jdParam = "dot_showNumber"
        showNum.serviceClassName = "dotMatrix"

        const emoji = addActuator(TID_ACTUATOR_SPEAKER, ["sound_emoji", "loop"])
        emoji.serviceClassName = "soundPlayer"
        emoji.serviceCommand = 0x80
        emoji.priority = 20
        emoji.jdKind = JdKind.Sequence

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
        const emoji_ms = [
            1478, 1233, 547, 4794, 1687, 1315, 8192, 2083, 6772, 2816,
        ]
        emojis.forEach((e, idx) => {
            const tid = "M19" + e
            const emoji_mod = new ModifierDefn(tid, "sound_emoji", 10)
            emoji_mod.jdKind = JdKind.ServiceCommandArg
            emoji_mod.jdParam = e
            emoji_mod.jdParam2 = emoji_ms[idx]
            tilesDB.modifiers[tid] = emoji_mod
        })

        emoji.defaultModifier = tilesDB.modifiers[TID_MODIFIER_EMOJI_GIGGLE]

        function make_vals(
            values: number[],
            name: string,
            kind: string,
            start: number
        ) {
            const tiles: FilterModifierBase[] = []
            values.forEach((v, index) => {
                const tid = kind + (start + index)
                const tile: FilterModifierBase =
                    kind == "M"
                        ? new ModifierDefn(tid, name, 10)
                        : new FilterDefn(tid, name, 10)
                tile.jdKind = JdKind.Literal
                tile.jdParam = v
                // tile.constraints = terminal
                if (kind == "M") tilesDB.modifiers[tid] = tile
                else tilesDB.filters[tid] = tile as FilterDefn
                tile.constraints = {
                    provides: [name],
                }
                tiles.push(tile)
            })
            return tiles
        }

        const coin_values = [1, 2, 3, 4, 5]
        make_vals(coin_values, "value_in", "F", 8)
        make_vals(coin_values, "constant", "M", 6)
        make_vals([1, 2, 3, 4, 5], "page", "M", 1).forEach(m => {
            m.constraints.handling = m.constraints.handling || {}
            m.constraints.handling.terminal = true
            m.jdKind = JdKind.Page
        })

        function addRGB(id: number, color: number) {
            const tid = TID_MODIFIER_RGB_LED_COLOR_X + id
            const mod = new ModifierDefn(tid, "rgb_led", 10)
            tilesDB.modifiers[tid] = mod
            mod.jdKind = JdKind.ExtLibFn
            mod.jdParam = "led_solid"
            mod.jdParam2 = color
        }

        addRGB(1, 0x2f0000)
        addRGB(2, 0x002f00)
        addRGB(3, 0x00002f)
        addRGB(4, 0x2f002f)
        addRGB(5, 0x2f2f00)
        addRGB(6, 0x000000)

        function addAnim(name: string) {
            const tid = TID_MODIFIER_RGB_LED_COLOR_X + name
            const mod = new ModifierDefn(tid, "rgb_led", 11)
            tilesDB.modifiers[tid] = mod
            mod.jdKind = JdKind.ExtLibFn
            mod.jdParam = "led_anim_" + name
        }

        addAnim("sparkle")
        addAnim("rainbow")

        const rgbled = addActuator(TID_ACTUATOR_RGB_LED, ["rgb_led", "loop"])
        rgbled.priority = 500
        rgbled.serviceClassName = "led"
        rgbled.serviceCommand = jacs.CMD_SET_REG | 2
        rgbled.jdExternalClass = 0x1609d4f0
        rgbled.jdKind = JdKind.Sequence
        rgbled.defaultModifier =
            tilesDB.modifiers[TID_MODIFIER_RGB_LED_COLOR_RAINBOW]

        const servoSetAngle = addActuator(TID_MODIFIER_SERVO_SET_ANGLE, [
            "constant",
        ])
        servoSetAngle.priority = 500
        servoSetAngle.serviceClassName = "servo"
        servoSetAngle.jdExternalClass = 0x12fc9103
        servoSetAngle.serviceCommand = jacs.CMD_SET_REG | 2
        servoSetAngle.jdKind = JdKind.NumFmt
        servoSetAngle.jdParam = jacs.NumFmt.I32

        function addReadValue(tid: string, kind: JdKind, varid: number) {
            const mod = new ModifierDefn(tid, "value_out", 10)
            mod.jdParam = varid
            mod.jdKind = kind
            tilesDB.modifiers[tid] = mod
            mod.priority = 200 + varid
            return mod
        }
        addReadValue(TID_MODIFIER_CUP_X_READ, JdKind.Variable, 0)
        addReadValue(TID_MODIFIER_CUP_Y_READ, JdKind.Variable, 1)
        addReadValue(TID_MODIFIER_CUP_Z_READ, JdKind.Variable, 2)
        
        // TODO: this should only be present when radio receive in When section
        addReadValue(TID_MODIFIER_RADIO_VALUE, JdKind.RadioValue, 0)

        const random_toss = addReadValue(
            TID_MODIFIER_RANDOM_TOSS,
            JdKind.RandomToss,
            5
        )
        random_toss.priority = 70
        random_toss.constraints = {}
        random_toss.constraints.allow = { categories: ["constant"] }
        random_toss.constraints.disallow = { categories: ["value_out"] }

        const loop = new ModifierDefn(TID_MODIFIER_LOOP, "loop", 10)
        loop.jdKind = JdKind.Loop
        tilesDB.modifiers[TID_MODIFIER_LOOP] = loop
        loop.priority = 80
        loop.constraints = {}
        loop.constraints.only = ["constant"]
    }

    export const iconFieldEditor: FieldEditor = {
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
        buttonStyle: () => ButtonStyles.Transparent,
        serialize: (img: Image) => {
            const ret: string[] = []
            for (let index = 0; index < 25; index++) {
                let col = index % 5
                let row = Math.idiv(index, 5)
                ret.push(img.getPixel(col, row) ? "1" : "0")
            }
            return ret.join("")
        },
        deserialize: (s: string) => {
            const img = image.create(5, 5)
            for (let index = 0; index < 25; index++) {
                let col = index % 5
                let row = Math.idiv(index, 5)
                img.setPixel(col, row, s[index] == "1" ? 1 : 0)
            }
            return img
        },
    }

    class IconEditor extends ModifierDefn {
        field: Image
        firstInstance: boolean
        constructor(field: Image = null) {
            super(TID_MODIFIER_ICON_EDITOR, "icon_editor", 10)
            this.firstInstance = false
            this.fieldEditor = iconFieldEditor
            if (field) this.field = field.clone()
            else this.field = this.fieldEditor.clone(this.fieldEditor.init)
            this.jdKind = JdKind.ServiceCommandArg
            this.jdParam2 = 400 // ms
        }

        getField() {
            return this.field
        }

        getIcon(): string | Image {
            return this.firstInstance
                ? TID_MODIFIER_ICON_EDITOR
                : this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: any = null) {
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

    function addFieldEditors() {
        const iconEditorTile = new IconEditor()
        iconEditorTile.firstInstance = true
        tilesDB.modifiers[TID_MODIFIER_ICON_EDITOR] = iconEditorTile
    }

    function addTiles() {
        addSensorTiles()
        addActuatorTiles()
        addFieldEditors()
    }

    addTiles()
}
