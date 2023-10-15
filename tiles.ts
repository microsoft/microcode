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

    export function PAGE_IDS() {
        return [
            TID_MODIFIER_PAGE_1,
            TID_MODIFIER_PAGE_2,
            TID_MODIFIER_PAGE_3,
            TID_MODIFIER_PAGE_4,
            TID_MODIFIER_PAGE_5,
        ]
    }

    export function diskSlots() {
        return ["disk1", "disk2", "disk3"]
    }

    export const tilesDB: TileDatabase = {
        sensors: {},
        filters: {},
        actuators: {},
        modifiers: {},
    }

    // initialize the database, imperatively!!!

    function addButtonTiles() {
        function addPress(tid: string, evt: number) {
            const press_event = new SensorDefn(tid)
            press_event.serviceClassName = "button"
            press_event.eventCode = evt
            press_event.serviceInstanceIndex = 0
            press_event.constraints = {
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
                allow: {
                    categories: ["press_event"],
                },
            }
            tilesDB.filters[tid] = press_filter
            press_filter.jdKind = JdKind.ServiceInstanceIndex
            press_filter.jdParam = instanceNo
            return press_filter
        }

        addPressFilter(TID_FILTER_BUTTON_A, 0)
        addPressFilter(TID_FILTER_BUTTON_B, 1)
        addPressFilter(TID_FILTER_LOGO, 2)
        addPressFilter(TID_FILTER_PIN_0, 3)
        addPressFilter(TID_FILTER_PIN_1, 4)
        addPressFilter(TID_FILTER_PIN_2, 5)
        const kitA_1 = addPressFilter(TID_FILTER_KITA_KEY_1, 6)
        const kitA_2 = addPressFilter(TID_FILTER_KITA_KEY_2, 7)
        kitA_1.jdExternalClass = 0x1473a263
        kitA_2.jdExternalClass = 0x1473a263
    }

    function addSensorAndFilterTiles() {
        function makeSensor(tid: string, cat: string, prior: number) {
            const tile = new SensorDefn(tid)
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

        function makeCupSensor(tid: string, id: number, disallow: string) {
            const tile = makeSensor(tid, "value_in", 120 + id * 5)
            tile.jdKind = JdKind.Variable
            tile.jdParam = id
            tile.priority = 200 + id
            tile.constraints.disallow = { tiles: [disallow] }
        }

        makeCupSensor(TID_SENSOR_CUP_X_WRITTEN, 0, TID_FILTER_CUP_X_READ)
        makeCupSensor(TID_SENSOR_CUP_Y_WRITTEN, 1, TID_FILTER_CUP_Y_READ)
        makeCupSensor(TID_SENSOR_CUP_Z_WRITTEN, 2, TID_FILTER_CUP_Z_READ)

        const temp = makeSensor(TID_SENSOR_TEMP, "temperature_event", 99)
        temp.serviceClassName = "temperature"
        temp.jdKind = JdKind.Temperature
        temp.eventCode = 2

        const radio_recv = makeSensor(TID_SENSOR_RADIO_RECEIVE, "value_in", 100)
        radio_recv.serviceClassName = "radio"
        radio_recv.eventCode = 0x91
        radio_recv.jdKind = JdKind.Radio
        radio_recv.constraints.provides = [TID_SENSOR_RADIO_RECEIVE]

        // the following three tiles are treated similarly, as
        // the sensor values are mapped into [1,2,3,4,5]
        const only5 = [
            TID_FILTER_COIN_1,
            TID_FILTER_COIN_2,
            TID_FILTER_COIN_3,
            TID_FILTER_COIN_4,
            TID_FILTER_COIN_5,
        ]
        const slider = makeSensor(TID_SENSOR_SLIDER, "value_in", 500)
        slider.serviceClassName = "potentiometer"
        slider.jdExternalClass = 0x1f274746
        slider.constraints.allow.categories = []
        slider.constraints.allow.tiles = only5

        if (CAR_TILES) {
            const wall = makeSensor(TID_SENSOR_CAR_WALL, "value_in", 500)
            wall.serviceClassName = "radio"
            wall.eventCode = 0x91
            wall.jdKind = JdKind.Radio
            wall.constraints.allow.categories = []
            wall.constraints.allow.tiles = only5
        }

        const magnet = makeSensor(TID_SENSOR_MAGNET, "value_in", 500)
        magnet.serviceClassName = "magneticFieldLevel"
        magnet.jdExternalClass = 0x12fe180f
        magnet.constraints = slider.constraints

        const light = makeSensor(TID_SENSOR_LIGHT, "value_in", 500)
        light.serviceClassName = "lightLevel"
        light.jdExternalClass = 0x17dc9a1c
        light.constraints = slider.constraints

        const rotary = makeSensor(TID_SENSOR_ROTARY, "rotary_event", 500)
        rotary.serviceClassName = "rotaryEncoder"
        rotary.jdExternalClass = 0x10fa29c9
        rotary.jdKind = JdKind.Rotary
        rotary.eventCode = 1

        function addEvent(tid: string, type: string, id: number) {
            const ev = new FilterDefn(tid, type, 10)
            ev.jdParam = id
            ev.jdKind = JdKind.EventCode
            tilesDB.filters[tid] = ev
            return ev
        }
        addEvent(TID_FILTER_ROTARY_LEFT, "rotary_event", 1)
        addEvent(TID_FILTER_ROTARY_RIGHT, "rotary_event", 2)
        addEvent(TID_FILTER_TEMP_WARMER, "temperature_event", 2)
        addEvent(TID_FILTER_TEMP_COLDER, "temperature_event", 1)

        if (CAR_TILES) {
            const both = addEvent(
                TID_FILTER_LINE_BOTH,
                "line",
                robots.RobotCompactCommand.LineBoth
            )
            const left = addEvent(
                TID_FILTER_LINE_LEFT,
                "line",
                robots.RobotCompactCommand.LineLeft
            )
            const right = addEvent(
                TID_FILTER_LINE_RIGHT,
                "line",
                robots.RobotCompactCommand.LineRight
            )
            const neither = addEvent(
                TID_FILTER_LINE_NEITHER,
                "line",
                robots.RobotCompactCommand.LineNone
            )
            const neither_left = addEvent(
                TID_FILTER_LINE_NEITHER_LEFT,
                "line",
                robots.RobotCompactCommand.LineNoneFromLeft
            )
            const neither_right = addEvent(
                TID_FILTER_LINE_NEITHER_RIGHT,
                "line",
                robots.RobotCompactCommand.LineNoneFromRight
            )
            both.jdKind =
                left.jdKind =
                right.jdKind =
                neither.jdKind =
                neither_left.jdKind =
                neither_right.jdKind =
                    JdKind.Literal

            const line = makeSensor(TID_SENSOR_LINE, "line", 505)
            line.serviceClassName = "radio"
            line.eventCode = 0x91
            line.jdKind = JdKind.Radio
            line.constraints.allow.categories = []
            line.constraints.allow.tiles = [
                TID_FILTER_LINE_LEFT,
                TID_FILTER_LINE_RIGHT,
                TID_FILTER_LINE_BOTH,
                TID_FILTER_LINE_NEITHER_LEFT,
                TID_FILTER_LINE_NEITHER_RIGHT,
                TID_FILTER_LINE_NEITHER,
            ]
        }

        const timer = new SensorDefn(TID_SENSOR_TIMER)
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

        const accel = new SensorDefn(TID_SENSOR_ACCELEROMETER)
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

        const microphone = new SensorDefn(TID_SENSOR_MICROPHONE)
        microphone.constraints = {
            allow: {
                categories: ["sound_event"],
            },
        }
        microphone.priority = 30
        microphone.serviceClassName = "soundLevel"
        microphone.eventCode = 1 // loud by default
        tilesDB.sensors[TID_SENSOR_MICROPHONE] = microphone
        function addSoundFilter(tid: string, eventCode: number) {
            const soundFilter = new FilterDefn(tid, "sound_event", 10)
            tilesDB.filters[tid] = soundFilter
            soundFilter.jdKind = JdKind.EventCode
            soundFilter.jdParam = eventCode
        }
        addSoundFilter(TID_FILTER_LOUD, 1)
        addSoundFilter(TID_FILTER_QUIET, 2)
    }

    function addActuatorAndModifierTiles() {
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

        // these are in order (see priority field) as will be shown in the dialog
        const paint = addActuator(TID_ACTUATOR_PAINT, ["icon_editor", "loop"])
        paint.serviceClassName = "dotMatrix"
        paint.serviceCommand = jacs.CMD_SET_REG | 0x2
        paint.priority = 10
        paint.jdKind = JdKind.Sequence
        paint.jdParam = "dot_animation"
        paint.jdParam2 = 5
        paint.defaultModifier = new IconEditor()

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

        const music = addActuator(TID_ACTUATOR_MUSIC, ["melody_editor", "loop"])
        music.priority = 22
        music.serviceClassName = "buzzer"
        music.serviceCommand = 0x80
        music.jdKind = JdKind.Sequence
        music.jdParam = "note_sequence"
        music.jdParam2 = 6
        music.defaultModifier = new MelodyEditor()

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

        const swtch = addActuator(TID_ACTUATOR_SWITCH_PAGE, ["page"])
        swtch.priority = 110

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
                    kind == "F"
                        ? new FilterDefn(tid, name, 10)
                        : new ModifierDefn(tid, name, 10)
                tile.jdKind = kind == "CAR" ? JdKind.NumFmt : JdKind.Literal
                tile.jdParam = kind == "CAR" ? jacs.NumFmt.F64 : v
                tile.jdParam2 = kind == "CAR" ? v : 0
                if (kind == "F") tilesDB.filters[tid] = tile as FilterDefn
                else tilesDB.modifiers[tid] = tile
                tiles.push(tile)
            })
            return tiles
        }

        const one_to_five = [1, 2, 3, 4, 5]
        make_vals(one_to_five, "value_in", "F", 8)
        make_vals(one_to_five, "constant", "M", 6)
        make_vals(one_to_five, "page", "M", 1).forEach(m => {
            m.jdKind = JdKind.Page
        })

        if (CAR_TILES) {
            const car_commands = [
                microcode.robots.RobotCompactCommand.MotorRunForward,
                microcode.robots.RobotCompactCommand.MotorRunBackward,
                microcode.robots.RobotCompactCommand.MotorTurnLeft,
                microcode.robots.RobotCompactCommand.MotorTurnRight,
                microcode.robots.RobotCompactCommand.MotorStop,
                microcode.robots.RobotCompactCommand.MotorRunForwardFast,
                microcode.robots.RobotCompactCommand.MotorSpinLeft,
                microcode.robots.RobotCompactCommand.MotorSpinRight,
                microcode.robots.RobotCompactCommand.MotorLEDRed,
                microcode.robots.RobotCompactCommand.MotorLEDGreen,
                microcode.robots.RobotCompactCommand.MotorLEDBlue,
            ]
            make_vals(car_commands, "car", "CAR", 1)

            const car = addActuator(TID_ACTUATOR_CAR, ["car"])
            car.priority = 900
            car.jdKind = JdKind.Sequence
            car.serviceClassName = "radio"
            car.serviceCommand = 0x81
            car.defaultModifier = tilesDB.modifiers[TID_MODIFIER_CAR_STOP]
        }

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

        function addFilterReadValue(tid: string, kind: JdKind, varid: number) {
            const filter = new FilterDefn(tid, "value_in", 10)
            filter.jdParam = varid
            filter.jdKind = kind
            tilesDB.filters[tid] = filter
            filter.priority = 200 + varid
            return filter
        }
        addFilterReadValue(TID_FILTER_CUP_X_READ, JdKind.Variable, 0)
        addFilterReadValue(TID_FILTER_CUP_Y_READ, JdKind.Variable, 1)
        addFilterReadValue(TID_FILTER_CUP_Z_READ, JdKind.Variable, 2)

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

        const radio_value = addReadValue(
            TID_MODIFIER_RADIO_VALUE,
            JdKind.RadioValue,
            0
        )
        radio_value.priority = 199
        radio_value.constraints = { requires: [TID_SENSOR_RADIO_RECEIVE] }

        const temperature_value = addReadValue(
            TID_MODIFIER_TEMP_READ,
            JdKind.Temperature,
            0
        )
        temperature_value.constraints = {}
        temperature_value.priority = 198

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
        loop.constraints = { only: ["constant"] }
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
        toImage: icondb.renderMicrobitLEDs,
        buttonStyle: () => ButtonStyles.Transparent,
        deserialize: (s: string) => {
            const img = image.create(5, 5)
            for (let index = 0; index < 25; index++) {
                let col = index % 5
                let row = Math.idiv(index, 5)
                img.setPixel(col, row, s[index] == "1" ? 1 : 0)
            }
            return img
        },
        toBuffer: (img: Image) => {
            const ret = Buffer.create(4)
            for (let index = 0; index < 25; index++) {
                let byte = index >> 3
                let bit = index & 7
                let col = index % 5
                let row = Math.idiv(index, 5)
                ret[byte] |= img.getPixel(col, row) << bit
            }
            return ret
        },
        fromBuffer: (br: BufferReader) => {
            const buf = br.readBuffer(4)
            const img = image.create(5, 5)
            for (let index = 0; index < 25; index++) {
                let byte = index >> 3
                let bit = index & 7
                let col = index % 5
                let row = Math.idiv(index, 5)
                img.setPixel(col, row, (buf[byte] >> bit) & 1)
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
            this.field = this.fieldEditor.clone(
                field ? field : this.fieldEditor.init
            )
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

    export interface Melody {
        notes: string
        tempo: number
    }

    export const MELODY_LENGTH = 4
    export const NUM_NOTES = 5

    //export const noteNames = ["C", "D", "E", "F", "G", "A", "B", "C", "D"]

    export function setNote(buf: Buffer, offset: number, note: string) {
        const noteToFreq: { [note: string]: number } = {
            "0": 261.63, // C4
            "1": 293.66, // D4
            "2": 329.63, // E4
            "3": 349.23, // F4
            "4": 392.0, // G4
            "5": 440.0, // A4
            "6": 493.88, // B4
            "7": 523.25, // C5
            "8": 587.33, // D5
        }

        const period = 1000000 / (note !== "." ? noteToFreq[note] : 1000)
        const duty = note === "." ? 0 : (period * 0.5) / 2
        const duration = 250
        buf.setNumber(NumberFormat.UInt16LE, offset + 0, period)
        buf.setNumber(NumberFormat.UInt16LE, offset + 2, duty)
        buf.setNumber(NumberFormat.UInt16LE, offset + 4, duration)
    }

    export const melodyFieldEditor: FieldEditor = {
        init: { notes: `0240`, tempo: 120 },
        clone: (melody: Melody) => {
            return { notes: melody.notes.slice(0), tempo: melody.tempo }
        },
        editor: melodyEditor,
        toImage: icondb.melodyToImage,
        buttonStyle: () => ButtonStyles.Transparent,
        deserialize: (s: string) => {
            const sp = s.split(",")
            return {
                notes: sp[0],
                tempo: parseInt(sp[1]),
            }
        },
        toBuffer: (melody: Melody) => {
            const buf = Buffer.create(3)
            buf.setUint8(0, melody.tempo)
            // convert the melody notes into list of integers
            const notes = melody.notes.split("").map(n => parseInt(n))
            // fill the buffer with the notes, 4 bits for each note
            for (let i = 0; i < MELODY_LENGTH; i++) {
                const note = notes[i] || 0
                const byte = i >> 1
                const bit = (i & 1) << 2
                buf.setUint8(byte + 1, buf.getUint8(byte + 1) | (note << bit))
            }
            return buf
        },
        fromBuffer: (br: BufferReader) => {
            const buf = br.readBuffer(3)
            const tempo = buf[0]
            let notes = ""
            // read the notes from the buffer
            for (let i = 0; i < MELODY_LENGTH; i++) {
                const byte = i >> 1
                const bit = (i & 1) << 2
                const note = (buf[byte + 1] >> bit) & 0xf
                notes += note.toString()
            }
            return { tempo, notes }
        },
    }

    class MelodyEditor extends ModifierDefn {
        field: Melody
        firstInstance: boolean
        constructor(field: Melody = null) {
            super(TID_MODIFIER_MELODY_EDITOR, "melody_editor", 10)
            this.firstInstance = false
            this.fieldEditor = melodyFieldEditor
            this.field = this.fieldEditor.clone(
                field ? field : this.fieldEditor.init
            )
            this.jdKind = JdKind.ServiceCommandArg
            this.jdParam2 = 250 // ms
        }

        getField() {
            return this.field
        }

        getIcon(): string | Image {
            return this.firstInstance
                ? TID_MODIFIER_MELODY_EDITOR
                : this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: any = null) {
            return new MelodyEditor(
                field ? field : this.fieldEditor.clone(this.field)
            )
        }

        serviceCommandArg() {
            const buf = Buffer.create(6 * 8)
            for (let i = 0; i < MELODY_LENGTH; i++) {
                setNote(buf, i * 6, this.field.notes[i])
            }
            return buf
        }
    }

    function addFieldEditors() {
        const iconEditorTile = new IconEditor()
        iconEditorTile.firstInstance = true
        tilesDB.modifiers[TID_MODIFIER_ICON_EDITOR] = iconEditorTile
        const melodyEditorTile = new MelodyEditor()
        melodyEditorTile.firstInstance = true
        tilesDB.modifiers[TID_MODIFIER_MELODY_EDITOR] = melodyEditorTile
    }

    function addTiles() {
        addSensorAndFilterTiles()
        addActuatorAndModifierTiles()
        addFieldEditors()
    }

    addTiles()
}
