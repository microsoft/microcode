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
    export const TID_SENSOR_BUTTON_A = "S2"
    export const TID_SENSOR_BUTTON_B = "S3"
    export const TID_SENSOR_TIMER = "S4"
    export const TID_SENSOR_BUTTON_AB = "S5"
    export const TID_SENSOR_PIN_1 = "S6"
    export const TID_SENSOR_RADIO_RECEIVE = "S7"
    export const TID_SENSOR_MIC = "S8"
    export const TID_SENSOR_LOGO = "S9"

    export const TID_FILTER_TIMESPAN_SHORT = "F1"
    export const TID_FILTER_TIMESPAN_LONG = "F2"
    export const TID_FILTER_PIN_ANALOG = "F8"
    export const TID_FILTER_PIN_DIGITAL = "F9"

    export const TID_ACTUATOR_SWITCH_PAGE = "A1"
    export const TID_ACTUATOR_SPEAKER = "A2"
    export const TID_ACTUATOR_PAINT = "A5"
    export const TID_ACTUATOR_RADIO_SEND = "A6"
    // A3, A4 free

    export const TID_MODIFIER_PAGE_1 = "M1"
    export const TID_MODIFIER_PAGE_2 = "M2"
    export const TID_MODIFIER_PAGE_3 = "M3"
    export const TID_MODIFIER_PAGE_4 = "M4"
    export const TID_MODIFIER_PAGE_5 = "M5"
    export const TID_MODIFIER_PIN_ON = "M11"
    export const TID_MODIFIER_PIN_OFF = "M12"
    export const TID_MODIFIER_HAPPY = "M13"
    export const TID_MODIFIER_SAD = "M14"
    export const TID_MODIFIER_ICON_EDITOR = "M15"
    export const TID_MODIFIER_COLOR_RED = "M16"
    export const TID_MODIFIER_COLOR_DARKPURPLE = "M17"

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

    const always = new SensorDefn(TID_SENSOR_ALWAYS, "Always", Phase.Pre)
    always.hidden = true
    tilesDB.sensors[TID_SENSOR_ALWAYS] = always

    const button_a = new SensorDefn(TID_SENSOR_BUTTON_A, "A", Phase.Pre)
    button_a.serviceClassName = "button"
    button_a.eventCode = 0x1 // down
    button_a.serviceInstanceIndex = 0
    button_a.constraints = {
        provides: ["input"],
        allow: {
            categories: ["button-event"],
        },
    }
    tilesDB.sensors[TID_SENSOR_BUTTON_A] = button_a

    const button_b = new SensorDefn(TID_SENSOR_BUTTON_B, "B", Phase.Pre)
    copyJdSensor(button_b, button_a)
    button_b.serviceInstanceIndex = 1
    button_b.constraints = button_a.constraints
    tilesDB.sensors[TID_SENSOR_BUTTON_B] = button_b

    const timer = new SensorDefn(TID_SENSOR_TIMER, "Timer", Phase.Post)
    timer.constraints = {
        allow: {
            categories: ["timespan"],
        },
    }
    tilesDB.sensors[TID_SENSOR_TIMER] = timer

    const pin_1 = new SensorDefn(TID_SENSOR_PIN_1, "Pin 1", Phase.Post)
    pin_1.constraints = {
        allow: {
            categories: ["pin_mode"],
        },
    }
    tilesDB.sensors[TID_SENSOR_PIN_1] = pin_1

    const radio_receive = new SensorDefn(
        TID_SENSOR_RADIO_RECEIVE,
        "Receive",
        Phase.Post
    )
    tilesDB.sensors[TID_SENSOR_RADIO_RECEIVE] = radio_receive

    const timespan_filters = [
        TID_FILTER_TIMESPAN_SHORT,
        TID_FILTER_TIMESPAN_LONG,
    ]
    const timespan_names = ["short", "long"]
    timespan_filters.forEach((tid, i) => {
        const timespan = new FilterDefn(tid, timespan_names[i], "timespan", 10)
        tilesDB.filters[tid] = timespan
    })

    const pin_filters = [TID_FILTER_PIN_ANALOG, TID_FILTER_PIN_DIGITAL]
    const pin_names = ["analog", "digital"]
    pin_filters.forEach((tid, i) => {
        const pin_filter = new FilterDefn(tid, pin_names[i], "pin_mode", 10)
        pin_filter.constraints = {
            disallow: {
                categories: ["pin_mode"],
            },
        }
        tilesDB.filters[tid] = pin_filter
    })

    function addActuator(tid: string, name: string, allow: string) {
        const actuator = new ActuatorDefn(tid, name)
        actuator.constraints = {
            allow: {
                categories: [allow],
            },
        }
        tilesDB.actuators[tid] = actuator
        return actuator
    }

    addActuator(TID_ACTUATOR_SWITCH_PAGE, "Switch page", "page")
    const paint = addActuator(TID_ACTUATOR_PAINT, "Paint", "icon_editor")
    paint.serviceClassName = "dotMatrix"
    paint.serviceCommand = jacs.CMD_SET_REG | 0x2
    paint.serviceInstanceIndex = 0

    addActuator(TID_ACTUATOR_RADIO_SEND, "Send", "message")
    const terminal = {
        handling: {
            terminal: true,
        },
    }
    for (let page = 1; page <= 5; page++) {
        const page_tid = TID_MODIFIER_PAGE_1[0] + page
        const tile_page = new ModifierDefn(
            page_tid,
            "page " + page.toString(),
            "page",
            10
        )
        tile_page.jdParam = page
        tile_page.constraints = terminal
        tilesDB.modifiers[page_tid] = tile_page
    }

    const pin_states = ["on", "off"]
    pin_states.forEach(state => {
        const state_tid =
            state == "on" ? TID_MODIFIER_PIN_ON : TID_MODIFIER_PIN_OFF
        const state_page = new ModifierDefn(state_tid, state, "pin_output", 10)
        state_page.constraints = terminal
        tilesDB.modifiers[state_tid] = state_page
    })

    const iconFieldEditor: FieldEditor = {
        init: img`
        . . . . .
        . . . . .
        . . 1 . . 
        . . . . .
        . . . . .
        `,
        clone: (img: Image) => img.clone(),
        editor: iconEditor,
        image: scaleUp,
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
            else this.field = iconFieldEditor.clone(iconFieldEditor.init)
        }

        getField() {
            return this.field
        }

        getIcon(): Image {
            return this.fieldEditor.image(this.field)
        }

        getNewInstance(field: any) {
            const newOne = new IconEditor(field ? field : this.field.clone())
            return newOne
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
}
