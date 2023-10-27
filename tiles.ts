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
        function addPress(tid: string) {
            const press_event = new SensorDefn(tid)
            press_event.constraints = {
                allow: ["press_event"],
            }
            tilesDB.sensors[tid] = press_event
        }

        addPress(TID_SENSOR_PRESS)
        addPress(TID_SENSOR_RELEASE)

        function addPressFilter(tid: string) {
            const press_filter = new FilterDefn(tid, "press_event")
            press_filter.constraints = { allow: ["press_event"] }
            tilesDB.filters[tid] = press_filter
            return press_filter
        }

        addPressFilter(TID_FILTER_BUTTON_A)
        addPressFilter(TID_FILTER_BUTTON_B)
        addPressFilter(TID_FILTER_LOGO)
        addPressFilter(TID_FILTER_PIN_0)
        addPressFilter(TID_FILTER_PIN_1)
        addPressFilter(TID_FILTER_PIN_2)
        const kitA_1 = addPressFilter(TID_FILTER_KITA_KEY_1)
        const kitA_2 = addPressFilter(TID_FILTER_KITA_KEY_2)
    }

    function addSensorAndFilterTiles() {
        function makeSensor(tid: string, cat: string) {
            const tile = new SensorDefn(tid)
            tile.constraints = {
                allow: [cat],
            }
            tilesDB.sensors[tid] = tile
            return tile
        }

        makeSensor(TID_SENSOR_START_PAGE, "timespan")

        addButtonTiles()

        function makeCupSensor(tid: string, disallow: number) {
            const tile = makeSensor(tid, "value_in")
            tile.constraints.disallow = [disallow]
        }

        makeCupSensor(TID_SENSOR_CUP_X_WRITTEN, Tid.TID_FILTER_CUP_X_READ)
        makeCupSensor(TID_SENSOR_CUP_Y_WRITTEN, Tid.TID_FILTER_CUP_Y_READ)
        makeCupSensor(TID_SENSOR_CUP_Z_WRITTEN, Tid.TID_FILTER_CUP_Z_READ)

        const temp = makeSensor(TID_SENSOR_TEMP, "temperature_event")

        const radio_recv = makeSensor(TID_SENSOR_RADIO_RECEIVE, "value_in")
        radio_recv.constraints.provides = [Tid.TID_SENSOR_RADIO_RECEIVE]

        // the following three tiles are treated similarly, as
        // the sensor values are mapped into [1,2,3,4,5]
        const only5 = [
            TID_FILTER_COIN_1,
            TID_FILTER_COIN_2,
            TID_FILTER_COIN_3,
            TID_FILTER_COIN_4,
            TID_FILTER_COIN_5,
        ]
        const slider = makeSensor(TID_SENSOR_SLIDER, "value_in")
        slider.constraints = {}
        slider.constraints.allow = only5

        if (CAR_TILES) {
            const wall = makeSensor(TID_SENSOR_CAR_WALL, "value_in")
            wall.constraints = {}
            wall.constraints.allow = only5
        }

        const magnet = makeSensor(TID_SENSOR_MAGNET, "value_in")
        magnet.constraints = slider.constraints

        const light = makeSensor(TID_SENSOR_LIGHT, "value_in")
        light.constraints = slider.constraints

        const rotary = makeSensor(TID_SENSOR_ROTARY, "rotary_event")

        function addEvent(tid: string, type: string) {
            const ev = new FilterDefn(tid, type)
            tilesDB.filters[tid] = ev
            return ev
        }
        addEvent(TID_FILTER_ROTARY_LEFT, "rotary_event")
        addEvent(TID_FILTER_ROTARY_RIGHT, "rotary_event")
        addEvent(TID_FILTER_TEMP_WARMER, "temperature_event")
        addEvent(TID_FILTER_TEMP_COLDER, "temperature_event")

        if (CAR_TILES) {
            const both = addEvent(TID_FILTER_LINE_BOTH, "line")
            const left = addEvent(TID_FILTER_LINE_LEFT, "line")
            const right = addEvent(TID_FILTER_LINE_RIGHT, "line")
            const neither = addEvent(TID_FILTER_LINE_NEITHER, "line")
            const neither_left = addEvent(TID_FILTER_LINE_NEITHER_LEFT, "line")
            const neither_right = addEvent(
                TID_FILTER_LINE_NEITHER_RIGHT,
                "line"
            )

            const line = makeSensor(TID_SENSOR_LINE, "line")
            line.constraints.allow = ["line"]
        }

        const timer = new SensorDefn(TID_SENSOR_TIMER)
        timer.constraints = {
            allow: ["timespan"],
        }
        tilesDB.sensors[TID_SENSOR_TIMER] = timer

        function addTimespan(tid: string) {
            const timespan = new FilterDefn(tid, "timespan")
            tilesDB.filters[tid] = timespan
        }
        addTimespan(TID_FILTER_TIMESPAN_SHORT)
        addTimespan(TID_FILTER_TIMESPAN_LONG)
        addTimespan(TID_FILTER_TIMESPAN_VERY_LONG)
        addTimespan(TID_FILTER_TIMESPAN_RANDOM)

        const accel = new SensorDefn(TID_SENSOR_ACCELEROMETER)
        accel.constraints = {
            allow: ["accel_event"],
        }
        tilesDB.sensors[TID_SENSOR_ACCELEROMETER] = accel

        function addAccelEvent(name: string) {
            const tid = TID_FILTER_ACCEL + "_" + name
            const accelEvent = new FilterDefn(tid, "accel_event")
            tilesDB.filters[tid] = accelEvent
            return accelEvent
        }

        addAccelEvent("shake")
        addAccelEvent("tilt_up")
        addAccelEvent("tilt_down")
        addAccelEvent("tilt_left")
        addAccelEvent("tilt_right")

        const microphone = new SensorDefn(TID_SENSOR_MICROPHONE)
        microphone.constraints = {
            allow: ["sound_event"],
        }
        tilesDB.sensors[TID_SENSOR_MICROPHONE] = microphone
        function addSoundFilter(tid: string) {
            const soundFilter = new FilterDefn(tid, "sound_event")
            tilesDB.filters[tid] = soundFilter
        }
        addSoundFilter(TID_FILTER_LOUD)
        addSoundFilter(TID_FILTER_QUIET)
    }

    function addActuatorAndModifierTiles() {
        function addActuator(tid: string, allows: string[]) {
            const actuator = new ActuatorDefn(tid)
            actuator.constraints = {
                allow: allows,
            }
            tilesDB.actuators[tid] = actuator
            return actuator
        }

        // these are in order (see priority field) as will be shown in the dialog
        const paint = addActuator(TID_ACTUATOR_PAINT, ["icon_editor", "loop"])
        const showNum = addAssign(TID_ACTUATOR_SHOW_NUMBER)
        const emoji = addActuator(TID_ACTUATOR_SPEAKER, ["sound_emoji", "loop"])
        const music = addActuator(TID_ACTUATOR_MUSIC, ["melody_editor", "loop"])

        const radio_send = addActuator(TID_ACTUATOR_RADIO_SEND, [
            "value_out",
            "constant",
        ])

        const radio_set_group = addActuator(TID_ACTUATOR_RADIO_SET_GROUP, [])
        radio_set_group.constraints = {}
        radio_set_group.constraints.only = ["constant"]

        const swtch = addActuator(TID_ACTUATOR_SWITCH_PAGE, ["page"])

        function addAssign(tid: string) {
            const theVar = addActuator(tid, ["value_out", "constant"])
            return theVar
        }

        addAssign(TID_ACTUATOR_CUP_X_ASSIGN)
        addAssign(TID_ACTUATOR_CUP_Y_ASSIGN)
        addAssign(TID_ACTUATOR_CUP_Z_ASSIGN)

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
        emojis.forEach((e, idx) => {
            const tid = "M19" + e
            const emoji_mod = new ModifierDefn(tid, "sound_emoji")
            // emoji_mod.jdParam2 = emoji_ms[idx]
            tilesDB.modifiers[tid] = emoji_mod
        })

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
                        ? new FilterDefn(tid, name)
                        : new ModifierDefn(tid, name)
                if (kind == "F") tilesDB.filters[tid] = tile as FilterDefn
                else tilesDB.modifiers[tid] = tile
                tiles.push(tile)
            })
            return tiles
        }

        const one_to_five = [1, 2, 3, 4, 5]
        make_vals(one_to_five, "value_in", "F", 8)
        make_vals(one_to_five, "constant", "M", 6)
        make_vals(one_to_five, "page", "M", 1)

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
                microcode.robots.RobotCompactCommand.LEDRed,
                microcode.robots.RobotCompactCommand.LEDGreen,
                microcode.robots.RobotCompactCommand.LEDBlue,
                microcode.robots.RobotCompactCommand.LEDOff,
                microcode.robots.RobotCompactCommand.ArmOpen,
                microcode.robots.RobotCompactCommand.ArmClose,
            ]
            make_vals(car_commands, "car", "CAR", 1)

            const car = addActuator(TID_ACTUATOR_CAR, ["car"])
        }

        function addRGB(id: number) {
            const tid = TID_MODIFIER_RGB_LED_COLOR_X + id
            const mod = new ModifierDefn(tid, "rgb_led")
            tilesDB.modifiers[tid] = mod
        }

        ;[1, 2, 3, 4, 5, 6].map(addRGB)

        function addAnim(name: string) {
            const tid = TID_MODIFIER_RGB_LED_COLOR_X + name
            const mod = new ModifierDefn(tid, "rgb_led")
            tilesDB.modifiers[tid] = mod
        }

        addAnim("sparkle")
        addAnim("rainbow")

        addActuator(TID_ACTUATOR_RGB_LED, ["rgb_led", "loop"])
        addActuator(TID_ACTUATOR_SERVO_SET_ANGLE, ["constant"])

        function addFilterReadValue(tid: string) {
            const filter = new FilterDefn(tid, "value_in")
            tilesDB.filters[tid] = filter
            return filter
        }
        addFilterReadValue(TID_FILTER_CUP_X_READ)
        addFilterReadValue(TID_FILTER_CUP_Y_READ)
        addFilterReadValue(TID_FILTER_CUP_Z_READ)

        function addReadValue(tid: string) {
            const mod = new ModifierDefn(tid, "value_out")
            tilesDB.modifiers[tid] = mod
            return mod
        }
        addReadValue(TID_MODIFIER_CUP_X_READ)
        addReadValue(TID_MODIFIER_CUP_Y_READ)
        addReadValue(TID_MODIFIER_CUP_Z_READ)

        const radio_value = addReadValue(TID_MODIFIER_RADIO_VALUE)
        radio_value.constraints = { requires: [Tid.TID_SENSOR_RADIO_RECEIVE] }

        const temperature_value = addReadValue(TID_MODIFIER_TEMP_READ)
        temperature_value.constraints = {}

        const random_toss = addReadValue(TID_MODIFIER_RANDOM_TOSS)
        random_toss.constraints = {}
        random_toss.constraints.allow = ["constant"]
        random_toss.constraints.disallow = ["value_out"]

        const loop = new ModifierDefn(TID_MODIFIER_LOOP, "loop")
        tilesDB.modifiers[TID_MODIFIER_LOOP] = loop
        loop.constraints = { only: ["constant"] }
    }

    export class IconFieldEditor extends FieldEditor {
        init() {
            return img`
        . . . . .
        . 1 . 1 .
        . . . . . 
        1 . . . 1
        . 1 1 1 .
        `
        }
        clone(img: Image) {
            return img.clone()
        }
        editor(
            field: any,
            picker: Picker,
            onHide: () => void,
            onDelete?: () => void
        ) {
            iconEditor(field, picker, onHide, onDelete)
        }
        toImage(field: any) {
            return icondb.renderMicrobitLEDs(field)
        }
        toBuffer(img: Image) {
            const ret = Buffer.create(4)
            for (let index = 0; index < 25; index++) {
                let byte = index >> 3
                let bit = index & 7
                let col = index % 5
                let row = Math.idiv(index, 5)
                ret[byte] |= img.getPixel(col, row) << bit
            }
            return ret
        }
        fromBuffer(br: BufferReader) {
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
        }
    }

    export class ModifierEditor extends ModifierDefn {
        fieldEditor: FieldEditor
    }

    export class IconEditor extends ModifierEditor {
        field: Image
        firstInstance: boolean
        constructor(field: Image = null) {
            super(TID_MODIFIER_ICON_EDITOR, "icon_editor")
            this.firstInstance = false
            this.fieldEditor = new IconFieldEditor()
            this.field = this.fieldEditor.clone(
                field ? field : this.fieldEditor.init()
            )
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

    export class MelodyFieldEditor extends FieldEditor {
        init() {
            return { notes: `0240`, tempo: 120 }
        }
        clone(melody: Melody) {
            return { notes: melody.notes.slice(0), tempo: melody.tempo }
        }
        editor(
            field: any,
            picker: Picker,
            onHide: () => void,
            onDelete?: () => void
        ) {
            melodyEditor(field, picker, onHide, onDelete)
        }
        toImage(field: any) {
            return icondb.melodyToImage(field)
        }
        toBuffer(melody: Melody) {
            const buf = Buffer.create(3)
            buf.setUint8(0, melody.tempo)
            // convert the melody notes into list of integers
            const notes = melody.notes.split("")
            // fill the buffer with the notes, 4 bits for each note
            for (let i = 0; i < MELODY_LENGTH; i++) {
                const byte = i >> 1
                const bit = (i & 1) << 2
                if (notes[i] != ".") {
                    const note = (parseInt(notes[i]) || 0) + 1
                    buf.setUint8(
                        byte + 1,
                        buf.getUint8(byte + 1) | (note << bit)
                    )
                }
            }
            return buf
        }
        fromBuffer(br: BufferReader) {
            const buf = br.readBuffer(3)
            const tempo = buf[0]
            let notes = ""
            // read the notes from the buffer
            for (let i = 0; i < MELODY_LENGTH; i++) {
                const byte = i >> 1
                const bit = (i & 1) << 2
                const note = (buf[byte + 1] >> bit) & 0xf
                notes += note == 0 ? "." : (note - 1).toString()
            }
            return { tempo, notes }
        }
    }

    export class MelodyEditor extends ModifierEditor {
        field: Melody
        firstInstance: boolean
        constructor(field: Melody = null) {
            super(TID_MODIFIER_MELODY_EDITOR, "melody_editor")
            this.firstInstance = false
            this.fieldEditor = new MelodyFieldEditor()
            this.field = this.fieldEditor.clone(
                field ? field : this.fieldEditor.init()
            )
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
