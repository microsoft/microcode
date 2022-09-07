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
    export const TID_SENSOR_TIMER = "S4"
    export const TID_SENSOR_RADIO_RECEIVE = "S7"
    export const TID_SENSOR_MIC = "S8"

    export const TID_FILTER_TIMESPAN_SHORT = "F1"
    export const TID_FILTER_TIMESPAN_LONG = "F2"
    // filters for TID_SENSOR_PRESS
    export const TID_FILTER_BUTTON_A = "F3"
    export const TID_FILTER_BUTTON_B = "F4"
    export const TID_FILTER_BUTTON_AB = "F5"
    export const TID_FILTER_PIN_0 = "F8"
    export const TID_FILTER_PIN_1 = "F6"
    export const TID_FILTER_PIN_2 = "F9"
    export const TID_FILTER_LOGO = "F7"

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

    const press_event = new SensorDefn(TID_SENSOR_PRESS, "press", Phase.Pre)
    press_event.serviceClassName = "button"
    press_event.eventCode = 0x1 // down
    press_event.serviceInstanceIndex = 0
    press_event.constraints = {
        provides: ["input"],
        allow: {
            categories: ["press_event"],
        },
    }
    tilesDB.sensors[TID_SENSOR_PRESS] = press_event

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

    const radio_receive = new SensorDefn(
        TID_SENSOR_RADIO_RECEIVE,
        "Receive",
        Phase.Post
    )
    tilesDB.sensors[TID_SENSOR_RADIO_RECEIVE] = radio_receive

    function addTimespan(tid: string, name: string, ms: number) {
        const timespan = new FilterDefn(tid, name, "timespan", 10)
        timespan.jdParam = ms
        tilesDB.filters[tid] = timespan
    }
    addTimespan(TID_FILTER_TIMESPAN_SHORT, "short", 250)
    addTimespan(TID_FILTER_TIMESPAN_LONG, "long", 1000)

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

    /*
    const pin_states = ["on", "off"]
    pin_states.forEach(state => {
        const state_tid =
            state == "on" ? TID_MODIFIER_PIN_ON : TID_MODIFIER_PIN_OFF
        const state_page = new ModifierDefn(state_tid, state, "pin_output", 10)
        state_page.constraints = terminal
        tilesDB.modifiers[state_tid] = state_page
    }) */

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
