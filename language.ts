namespace microcode {
    export enum TileType {
        SENSOR = 1,
        FILTER = 2,
        ACTUATOR = 3,
        MODIFIER = 4,
    }

    export interface Constraints {
        provides?: string[]
        requires?: string[]
        allow?: {
            tiles?: string[]
            categories?: string[]
        }
        disallow?: {
            tiles?: string[]
            categories?: string[]
        }
        handling?: { [id: string]: string | number | boolean }
    }

    export interface FieldEditor {
        init: any
        clone: (field: any) => any
        editor: (field: any, picker: Picker, onHide: () => void) => void // use picker to update field
        image: (field: any) => Image // produce an image for the field for tile
    }

    export class TileDefn {
        constructor(
            public type: TileType,
            public tid: string,
            public name: string
        ) {}

        hidden: boolean // Hide from UI?
        constraints: Constraints
        fieldEditor: FieldEditor
        jdParam: string

        getField(): any {
            return undefined
        }

        getIcon(): string | Image {
            return this.tid
        }

        getNewInstance(): TileDefn {
            return this
        }
    }

    export enum Phase {
        Pre,
        Post,
    }

    export class SensorDefn extends TileDefn {
        constructor(tid: string, name: string, public phase: Phase) {
            super(TileType.SENSOR, tid, name)
        }
    }

    export class FilterModifierBase extends TileDefn {
        constructor(
            type: TileType,
            tid: string,
            name: string,
            public category: string,
            public priority: number
        ) {
            super(type, tid, name)
        }
    }

    export class FilterDefn extends FilterModifierBase {
        constructor(
            tid: string,
            name: string,
            category: string,
            priority: number
        ) {
            super(TileType.FILTER, tid, name, category, priority)
        }
    }

    export class ActuatorDefn extends TileDefn {
        constructor(tid: string, name: string) {
            super(TileType.ACTUATOR, tid, name)
        }
    }

    export class ModifierDefn extends FilterModifierBase {
        constructor(
            tid: string,
            name: string,
            category: string,
            priority: number
        ) {
            super(TileType.MODIFIER, tid, name, category, priority)
        }
    }

    export class RuleDefn {
        sensor: SensorDefn
        filters: FilterDefn[]
        actuator: ActuatorDefn
        modifiers: ModifierDefn[]

        constructor() {
            this.filters = []
            this.modifiers = []
        }

        public clone(): RuleDefn {
            const rule = new RuleDefn()
            rule.sensor = this.sensor
            rule.actuator = this.actuator
            rule.filters = this.filters.slice(0)
            rule.modifiers = this.modifiers.slice(0)
            return rule
        }

        public isEmpty(): boolean {
            return !this.sensor && !this.actuator
        }

        // TODO: field serialization/deserialization, if present
        public toObj(): any {
            const obj = {
                S: this.sensor ? this.sensor.tid : undefined,
                A: this.actuator ? this.actuator.tid : undefined,
                F: this.filters.map(elem => elem.tid),
                M: this.modifiers.map(elem => elem.tid),
            }
            if (!obj.S) {
                delete obj.S
            }
            if (!obj.A) {
                delete obj.A
            }
            if (!obj.F.length) {
                delete obj.F
            }
            if (!obj.M.length) {
                delete obj.M
            }
            return obj
        }

        public static FromObj(obj: any): RuleDefn {
            if (typeof obj === "string") {
                obj = JSON.parse(obj)
            }
            const defn = new RuleDefn()
            if (typeof obj["S"] === "string") {
                defn.sensor = tiles.sensors[obj["S"]]
            }
            if (typeof obj["A"] === "string") {
                defn.actuator = tiles.actuators[obj["A"]]
            }
            if (Array.isArray(obj["F"])) {
                const filters: any[] = obj["F"]
                defn.filters = filters.map(
                    (elem: string) => tiles.filters[elem]
                )
            }
            if (Array.isArray(obj["M"])) {
                const modifiers: any[] = obj["M"]
                defn.modifiers = modifiers.map(
                    (elem: string) => tiles.modifiers[elem]
                )
            }
            return defn
        }
    }

    export class PageDefn {
        rules: RuleDefn[]

        constructor() {
            this.rules = []
        }

        public clone(): PageDefn {
            const page = new PageDefn()
            page.rules = this.rules.map(rule => rule.clone())
            return page
        }

        public trim() {
            while (
                this.rules.length &&
                this.rules[this.rules.length - 1].isEmpty()
            ) {
                this.rules.pop()
            }
        }

        public deleteRuleAt(index: number) {
            if (index >= 0 && index < this.rules.length) {
                this.rules.splice(index, 1)
            }
        }

        public insertRuleAt(index: number) {
            if (index >= 0 && index < this.rules.length) {
                // STS Array.splice doesn't support insert :(
                // this.rules.splice(index, 0, new RuleDefn());
                const rules: RuleDefn[] = []
                for (let i = 0; i < index; ++i) {
                    rules.push(this.rules[i])
                }
                rules.push(new RuleDefn())
                for (let i = index; i < this.rules.length; ++i) {
                    rules.push(this.rules[i])
                }
                this.rules = rules
            }
        }

        public toObj(): any {
            const obj = {
                R: this.rules.map(elem => elem.toObj()),
            }
            if (!obj.R.length) {
                delete obj.R
            }
            return obj
        }

        public static FromObj(obj: any): PageDefn {
            if (typeof obj === "string") {
                obj = JSON.parse(obj)
            }
            const defn = new PageDefn()
            if (Array.isArray(obj["R"])) {
                const rules: any[] = obj["R"]
                defn.rules = rules.map((elem: any) => RuleDefn.FromObj(elem))
            }
            return defn
        }
    }

    export class ProgramDefn {
        pages: PageDefn[]

        constructor() {
            this.pages = PAGE_IDS.map(id => new PageDefn())
        }

        public clone(): ProgramDefn {
            const brain = new ProgramDefn()
            brain.pages = this.pages.map(page => page.clone())
            return brain
        }

        public trim() {
            this.pages.map(page => page.trim())
        }

        public toObj(): any {
            return {
                P: this.pages.map(elem => elem.toObj()),
            }
        }

        public static FromObj(obj: any): ProgramDefn {
            if (typeof obj === "string") {
                obj = JSON.parse(obj)
            }
            const defn = new ProgramDefn()
            if (obj && obj["P"] && Array.isArray(obj["P"])) {
                const pages: any[] = obj["P"]
                defn.pages = pages.map((elem: any) => PageDefn.FromObj(elem))
            }
            return defn
        }
    }

    export class Language {
        public static getSensorSuggestions(rule: RuleDefn): SensorDefn[] {
            let sensors = Object.keys(tiles.sensors)
                .map(id => tiles.sensors[id])
                .filter(tile => !tile.hidden)
            return sensors
        }

        public static getFilterSuggestions(
            rule: RuleDefn,
            index: number
        ): FilterDefn[] {
            let all = Object.keys(tiles.filters)
                .map(id => tiles.filters[id])
                .filter(tile => !tile.hidden)

            // Collect existing tiles up to index.
            let existing: TileDefn[] = []
            for (let i = 0; i < index; ++i) {
                existing.push(rule.filters[i])
            }

            // Return empty set if the last existing tile is a "terminal".
            if (existing.length) {
                const last = existing[existing.length - 1]
                if (
                    last.constraints &&
                    last.constraints.handling &&
                    last.constraints.handling["terminal"]
                ) {
                    return []
                }
            }

            // Collect the built-up constraints.
            const constraints = mkConstraints()
            mergeConstraints(
                constraints,
                rule.sensor ? rule.sensor.constraints : null
            )
            for (let i = 0; i < existing.length; ++i) {
                mergeConstraints(constraints, existing[i].constraints)
            }

            return this.getCompatibleSet(all, constraints)
        }

        public static getActuatorSuggestions(rule: RuleDefn): ActuatorDefn[] {
            let actuators = Object.keys(tiles.actuators)
                .map(id => tiles.actuators[id])
                .filter(tile => !tile.hidden)
            return actuators
        }

        public static getModifierSuggestions(
            rule: RuleDefn,
            index: number
        ): ModifierDefn[] {
            const all = Object.keys(tiles.modifiers)
                .map(id => tiles.modifiers[id])
                .filter(tile => !tile.hidden)

            // Collect existing tiles up to index.
            let existing: TileDefn[] = []
            for (let i = 0; i < index; ++i) {
                existing.push(rule.modifiers[i])
            }

            // Return empty set if the last existing tile is a "terminal".
            if (existing.length) {
                const last = existing[existing.length - 1]
                if (
                    last.constraints &&
                    last.constraints.handling &&
                    last.constraints.handling["terminal"]
                ) {
                    return []
                }
            }

            // Collect the built-up constraints.
            const constraints = mkConstraints()
            mergeConstraints(
                constraints,
                rule.actuator ? rule.actuator.constraints : null
            )
            mergeConstraints(
                constraints,
                rule.sensor ? rule.sensor.constraints : null
            )
            for (let i = 0; i < existing.length; ++i) {
                mergeConstraints(constraints, existing[i].constraints)
            }

            return this.getCompatibleSet(all, constraints)
        }

        private static getCompatibleSet(
            all: FilterModifierBase[],
            c: Constraints
        ): FilterModifierBase[] {
            let compat = all
                // Filter "requires" to matching "provides".
                .filter(tile => {
                    if (!tile.constraints) return true
                    if (!tile.constraints.requires) return true
                    let met = false
                    tile.constraints.requires.forEach(
                        req =>
                            (met = met || c.provides.some(pro => pro === req))
                    )
                    return met
                })
                // Filter "allows".
                .filter(
                    tile =>
                        c.allow.categories.some(cat => cat === tile.category) ||
                        c.allow.tiles.some(tid => tid === tile.tid)
                )
                // Filter "disallows".
                .filter(
                    tile =>
                        !c.disallow.categories.some(
                            cat => cat === tile.category
                        ) && !c.disallow.tiles.some(tid => tid === tile.tid)
                )

            // TODO: c.handling

            return compat
        }

        public static ensureValid(rule: RuleDefn) {
            // TODO: Handle more cases. ex:
            // - filters not valid for new sensor
            // - modifiers not valid for new sensor or actuator
            if (!rule.sensor) {
                rule.filters = []
            }
            if (!rule.actuator) {
                rule.modifiers = []
            }
        }
    }

    function mkConstraints(): Constraints {
        const c: Constraints = {
            provides: [],
            requires: [],
            allow: {
                tiles: [],
                categories: [],
            },
            disallow: {
                tiles: [],
                categories: [],
            },
            handling: {},
        }
        return c
    }

    function mergeConstraints(dst: Constraints, src?: Constraints) {
        if (!src) {
            return
        }
        if (src.provides) {
            src.provides.forEach(item => dst.provides.push(item))
        }
        if (src.requires) {
            src.requires.forEach(item => dst.requires.push(item))
        }
        if (src.allow) {
            ;(src.allow.tiles || []).forEach(item => dst.allow.tiles.push(item))
            ;(src.allow.categories || []).forEach(item =>
                dst.allow.categories.push(item)
            )
        }
        if (src.disallow) {
            ;(src.disallow.tiles || []).forEach(item =>
                dst.disallow.tiles.push(item)
            )
            ;(src.disallow.categories || []).forEach(item =>
                dst.disallow.categories.push(item)
            )
        }
        if (src.handling) {
            const keys = Object.keys(src.handling)
            for (const key of keys) {
                dst.handling[key] = src.handling[key]
            }
        }
    }

    type SensorMap = { [id: string]: SensorDefn }
    type FilterMap = { [id: string]: FilterDefn }
    type ActuatorMap = { [id: string]: ActuatorDefn }
    type ModifierMap = { [id: string]: ModifierDefn }

    export type TileDatabase = {
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
    export const TID_SENSOR_PIN_1 = "S6"

    export const TID_FILTER_TIMESPAN_SHORT = "F1"
    export const TID_FILTER_TIMESPAN_LONG = "F2"
    export const TID_FILTER_PIN_ANALOG = "F8"
    export const TID_FILTER_PIN_DIGITAL = "F9"

    export const TID_ACTUATOR_SWITCH_PAGE = "A1"
    export const TID_ACTUATOR_PIN_0 = "A3"
    export const TID_ACTUATOR_STAMP = "A4"
    export const TID_ACTUATOR_PAINT = "A5"

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

    export const tiles: TileDatabase = {
        sensors: {},
        filters: {},
        actuators: {},
        modifiers: {},
    }

    // initialize the database, imperatively!!!

    const always = new SensorDefn(TID_SENSOR_ALWAYS, "Always", Phase.Pre)
    always.hidden = true
    tiles.sensors[TID_SENSOR_ALWAYS] = always

    const button_a = new SensorDefn(TID_SENSOR_BUTTON_A, "A", Phase.Pre)
    button_a.constraints = {
        provides: ["input"],
        allow: {
            categories: ["button-event"],
        },
    }
    tiles.sensors[TID_SENSOR_BUTTON_A] = button_a

    const button_b = new SensorDefn(TID_SENSOR_BUTTON_B, "B", Phase.Pre)
    button_b.constraints = button_a.constraints
    tiles.sensors[TID_SENSOR_BUTTON_B] = button_b

    const timer = new SensorDefn(TID_SENSOR_TIMER, "Timer", Phase.Post)
    timer.constraints = {
        allow: {
            categories: ["timespan"],
        },
    }
    tiles.sensors[TID_SENSOR_TIMER] = timer

    const pin_1 = new SensorDefn(TID_SENSOR_PIN_1, "Pin 1", Phase.Post)
    pin_1.constraints = {
        allow: {
            categories: ["pin_mode"],
        },
    }
    tiles.sensors[TID_SENSOR_PIN_1] = pin_1

    const timespan_filters = [
        TID_FILTER_TIMESPAN_SHORT,
        TID_FILTER_TIMESPAN_LONG,
    ]
    const timespan_names = ["short", "long"]
    timespan_filters.forEach((tid, i) => {
        const timespan = new FilterDefn(tid, timespan_names[i], "timespan", 10)
        tiles.filters[tid] = timespan
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
        tiles.filters[tid] = pin_filter
    })

    const actuators = [
        TID_ACTUATOR_SWITCH_PAGE,
        TID_ACTUATOR_STAMP,
        TID_ACTUATOR_PAINT,
        TID_ACTUATOR_PIN_0,
    ]
    const actuator_name = ["Switch page", "Stamp", "Paint", "Pin 0"]
    const actuator_allow = ["page", "led_icon", "icon_editor", "pin_output"]

    actuators.forEach((tid, i) => {
        const actuator = new ActuatorDefn(tid, actuator_name[i])
        actuator.constraints = {
            allow: {
                categories: [actuator_allow[i]],
            },
        }
        tiles.actuators[tid] = actuator
    })

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
        tile_page.constraints = terminal
        tiles.modifiers[page_tid] = tile_page
    }

    const pin_states = ["on", "off"]
    pin_states.forEach(state => {
        const state_tid =
            state == "on" ? TID_MODIFIER_PIN_ON : TID_MODIFIER_PIN_OFF
        const state_page = new ModifierDefn(state_tid, state, "pin_output", 10)
        state_page.constraints = terminal
        tiles.modifiers[state_tid] = state_page
    })

    const happy = new ModifierDefn(TID_MODIFIER_HAPPY, "happy", "led_icon", 10)
    happy.constraints = terminal
    happy.jdParam = "\x08\x12\x10\x12\x08"
    tiles.modifiers[TID_MODIFIER_HAPPY] = happy

    const sad = new ModifierDefn(TID_MODIFIER_SAD, "sad", "led_icon", 10)
    sad.constraints = terminal
    sad.jdParam = "\x10\x0a\x08\x0a\x10"
    tiles.modifiers[TID_MODIFIER_SAD] = sad

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
    }

    class IconEditor extends ModifierDefn {
        field: Image
        constructor() {
            super(TID_MODIFIER_ICON_EDITOR, "icon editor", "icon_editor", 10)
            this.fieldEditor = iconFieldEditor
            this.field = iconFieldEditor.clone(iconFieldEditor.init)
        }

        getField() {
            return this.field
        }

        getIcon(): Image {
            return this.fieldEditor.image(this.field)
        }

        getNewInstance() {
            const newOne = new IconEditor()
            newOne.field = this.field.clone()
            return newOne
        }
    }

    tiles.modifiers[TID_MODIFIER_ICON_EDITOR] = new IconEditor()
}
