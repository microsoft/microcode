namespace microcode {
    export enum TileType {
        SENSOR = 1,
        FILTER = 2,
        ACTUATOR = 3,
        MODIFIER = 4,
    }

    // TODO: make into class
    export interface Constraints {
        provides?: string[]
        requires?: string[]
        only?: string[]
        allow?: {
            tiles?: string[]
            categories?: string[]
        }
        disallow?: {
            tiles?: string[]
            categories?: string[]
        }
        handling?: { [id: string]: any }
    }

    // TODO: make into class
    export interface FieldEditor {
        init: any
        clone: (field: any) => any
        editor: (
            field: any,
            picker: Picker,
            onHide: () => void,
            onDelete?: () => void
        ) => void // use picker to update field
        toImage: (field: any) => Image // produce an image for the field for tile
        buttonStyle: () => ButtonStyle
        serialize: (field: any) => string
        deserialize: (s: string) => any
        toBuffer: (field: any) => Buffer
        fromBuffer: (buf: BufferReader) => any
    }

    // let P be jdParam
    export enum JdKind {
        Literal = 1, // value is P
        Variable, // value is variables[P]
        Page, // value is page[P]
        EventCode,
        ServiceInstanceIndex,
        ServiceCommandArg, // argument of command sent will be set to P; P2 is duration in ms for Sequance
        ExtLibFn, // call external function P(P2)
        Timespan,
        RadioValue,
        Rotary,
        Temperature,

        Loop, // repeat modifier

        // Filter/actuator kinds
        Radio, // radio send/recv
        RandomToss, // random number
        NumFmt, // on actuator - P is numfmt

        // for each modifier (defaults to [defaultModifier]), do ...
        // P is a shortcut external function
        // P2 is service arg size
        Sequence,
    }

    // TODO: clean up with new enum representation
    // - get ride of TileType and tid
    // - use a list instead of priority and sorting
    // - move fieldEditor out of TileDefn, only need for a few tiles
    // - separate editor info (constraints) from compiler info
    export class TileDefn {
        constructor(public type: TileType, public tid: string) {
            this.priority = 0
        }

        priority: number
        constraints: Constraints
        fieldEditor: FieldEditor
        jdKind: JdKind
        jdParam: any
        jdParam2: number
        jdExternalClass: number

        isVisible() {
            if (this.jdExternalClass && !jacs.debugOut) {
                const count = jdc.numServiceInstances(this.jdExternalClass)
                // special case for buttons, which already exist on micro:bit (6 of them)
                // we also have light sensor on board micro:bit (1 of them), as well as in Kit A
                return this.jdExternalClass == 0x1473a263
                    ? count > 6
                    : count > 0
            }
            return true
        }

        getField(): any {
            return undefined
        }

        getIcon(): string | Image {
            return this.tid
        }

        getNewInstance(field: any = null): TileDefn {
            return this
        }

        buttonStyle(): ButtonStyle {
            return this.fieldEditor
                ? this.fieldEditor.buttonStyle()
                : ButtonStyles.FlatWhite
        }

        // the following is just set union - can be simplified
        // TODO: probably really want a Gen/Kill framework instead
        mergeConstraints(dst: Constraints) {
            const src = this.constraints
            if (!src) {
                return
            }
            if (src.provides) {
                src.provides.forEach(item => dst.provides.push(item))
            }
            if (src.requires) {
                src.requires.forEach(item => dst.requires.push(item))
            }
            if (src.only) {
                src.only.forEach(item => dst.only.push(item))
            }
            if (src.allow) {
                ;(src.allow.tiles || []).forEach(item =>
                    dst.allow.tiles.push(item)
                )
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
                    // TODO: deep copy
                    dst.handling[key] = src.handling[key]
                }
            }
        }

        isCompatibleWith(c: Constraints): boolean {
            if (!this.constraints) return true
            if (this.constraints.requires) {
                let compat = false
                this.constraints.requires.forEach(
                    req =>
                        (compat = compat || c.provides.some(pro => pro === req))
                )
                if (!compat) return false
            }
            return true
        }
    }

    export enum Phase {
        Pre,
        Post,
    }

    export class StmtTileDefn extends TileDefn {
        constructor(type: TileType, tid: string) {
            super(type, tid)
        }

        public serviceClassName: string
        public serviceInstanceIndex: number = 0
    }

    export class SensorDefn extends StmtTileDefn {
        public eventCode: number
        constructor(tid: string, public phase: Phase) {
            super(TileType.SENSOR, tid)
        }
    }

    export class FilterModifierBase extends TileDefn {
        constructor(type: TileType, tid: string, public category: string) {
            super(type, tid)
        }

        serviceCommandArg(): string | Buffer {
            if (
                typeof this.jdParam == "string" ||
                typeof this.jdParam == "object"
            )
                return this.jdParam
            return null
            // throw "bad jdParam: " + this.name + " / " + this.jdParam
        }

        isCompatibleWith(c: Constraints): boolean {
            if (!super.isCompatibleWith(c)) return false

            const only = c.only.some(cat => cat === this.category)
            if (only) return true
            if (c.only.length) return false

            const allows =
                c.allow.categories.some(cat => cat === this.category) ||
                c.allow.tiles.some(tid => tid === this.tid)
            if (!allows) return false

            const disallows =
                !c.disallow.categories.some(cat => cat === this.category) &&
                !c.disallow.tiles.some(tid => tid === this.tid)
            if (!disallows) return false

            return true
        }
    }

    export class FilterDefn extends FilterModifierBase {
        constructor(tid: string, category: string, priority: number) {
            super(TileType.FILTER, tid, category)
            this.priority = priority
        }
    }

    export class ActuatorDefn extends StmtTileDefn {
        public serviceCommand: number
        public defaultModifier: ModifierDefn

        constructor(tid: string) {
            super(TileType.ACTUATOR, tid)
        }
    }

    export class ModifierDefn extends FilterModifierBase {
        constructor(tid: string, category: string, priority: number) {
            super(TileType.MODIFIER, tid, category)
            this.priority = priority
        }
    }

    type RuleRep = { [name: string]: TileDefn[] }

    export class RuleDefn {
        sensors: SensorDefn[]
        filters: FilterDefn[]
        actuators: ActuatorDefn[]
        modifiers: ModifierDefn[]

        constructor() {
            this.sensors = []
            this.filters = []
            this.actuators = []
            this.modifiers = []
        }

        get sensor() {
            if (this.sensors.length == 0)
                return tilesDB.sensors[TID_SENSOR_START_PAGE]
            return this.sensors[0]
        }

        public getRuleRep(): RuleRep {
            return {
                sensors: this.sensors,
                filters: this.filters,
                actuators: this.actuators,
                modifiers: this.modifiers,
            }
        }

        public clone(): RuleDefn {
            const rule = new RuleDefn()
            rule.sensors = this.sensors.slice(0)
            rule.actuators = this.actuators.slice(0)
            rule.filters = this.filters.slice(0)
            rule.modifiers = this.modifiers.slice(0)
            return rule
        }

        public isEmpty(): boolean {
            return this.sensors.length === 0 && this.actuators.length === 0
        }

        public toBuffer(bw: BufferWriter) {
            if (this.isEmpty()) return
            bw.writeByte(tidToEnum(this.sensor.tid))
            this.filters.forEach(filter => bw.writeByte(tidToEnum(filter.tid)))
            this.actuators.forEach(act => bw.writeByte(tidToEnum(act.tid)))
            this.modifiers.forEach(mod => {
                bw.writeByte(tidToEnum(mod.tid))
                if (mod.fieldEditor) {
                    bw.writeBuffer(mod.fieldEditor.toBuffer(mod.getField()))
                }
            })
        }

        public static fromBuffer(br: BufferReader) {
            const defn = new RuleDefn()
            assert(!br.eof())
            const sensorEnum = br.readByte()
            assert(isSensor(sensorEnum))
            const sensorTid = enumToTid(sensorEnum)
            defn.sensors.push(tilesDB.sensors[sensorTid])
            assert(!br.eof())
            while (isFilter(br.peekByte())) {
                const filterEnum = br.readByte()
                const filterTid = enumToTid(filterEnum)
                defn.filters.push(tilesDB.filters[filterTid])
                assert(!br.eof())
            }
            assert(!br.eof())
            if (!isActuator(br.peekByte())) {
                return defn
            }
            assert(!br.eof())
            const actuatorEnum = br.readByte()
            const actuatorTid = enumToTid(actuatorEnum)
            defn.actuators.push(tilesDB.actuators[actuatorTid])
            assert(!br.eof())
            while (isModifier(br.peekByte())) {
                const modifierEnum = br.readByte()
                const modifierTid = enumToTid(modifierEnum)
                const modifier = tilesDB.modifiers[modifierTid]
                if (modifier.fieldEditor) {
                    const field = modifier.fieldEditor.fromBuffer(br)
                    const newOne = modifier.getNewInstance(field)
                    defn.modifiers.push(<any>newOne)
                } else {
                    defn.modifiers.push(modifier)
                }
                assert(!br.eof())
            }
            return defn
        }
    }

    export function ruleDefnToJson(rule: RuleDefn): any {
        const addField = (t: TileDefn) => {
            if (t.fieldEditor) {
                const ret = `${t.tid}(${t.fieldEditor.serialize(t.getField())})`
                return ret
            } else {
                return t.tid
            }
        }
        const obj = {
            S: rule.sensors.map(t => addField(t)),
            A: rule.actuators.map(t => addField(t)),
            F: rule.filters.map(t => addField(t)),
            M: rule.modifiers.map(t => addField(t)),
        }
        if (!obj.S.length) delete obj.S
        if (!obj.A.length) delete obj.A
        if (!obj.F.length) delete obj.F
        if (!obj.M.length) delete obj.M
        return obj
    }

    function ruleDefnFromJson(obj: any): RuleDefn {
        const extractField = (t: string) => (s: string) => {
            let hasField = s.indexOf("(")
            if (hasField >= 0) {
                const elem = s.substr(0, hasField)
                if (Object.keys(tilesDB[t]).indexOf(elem) >= 0) {
                    const tile = tilesDB[t][elem]
                    const field = tile.fieldEditor.deserialize(
                        s.substr(hasField + 1, s.length - 2 - hasField)
                    )
                    const newOne = tile.getNewInstance(field)
                    return newOne
                } else {
                    return undefined
                }
            } else {
                return Object.keys(tilesDB[t]).indexOf(s) >= 0
                    ? tilesDB[t][s]
                    : undefined
            }
        }
        const defn = new RuleDefn()
        const parseTile = (single: string, name: string) => {
            if (Array.isArray(obj[single])) {
                const tiles: any[] = obj[single]
                return <any>tiles.map(extractField(name)).filter(t => !!t)
            }
            return []
        }
        if (typeof obj === "string") {
            obj = JSON.parse(obj)
        }

        defn.sensors = parseTile("S", "sensors")
        defn.actuators = parseTile("A", "actuators")
        defn.filters = parseTile("F", "filters")
        defn.modifiers = parseTile("M", "modifiers")
        return defn
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
                const newRule = new RuleDefn()
                // STS Array.splice doesn't support insert :(
                // this.rules.splice(index, 0, new RuleDefn());
                const newRules: RuleDefn[] = []
                for (let i = 0; i < index; ++i) {
                    newRules.push(this.rules[i])
                }
                newRules.push(newRule)
                for (let i = index; i < this.rules.length; ++i) {
                    newRules.push(this.rules[i])
                }
                this.rules = newRules
                return newRule
            }
            return undefined
        }

        public toBuffer(bw: BufferWriter) {
            this.rules.forEach(rule => rule.toBuffer(bw))
            bw.writeByte(Tid.END_OF_PAGE)
        }

        public static fromBuffer(br: BufferReader) {
            const defn = new PageDefn()
            assert(!br.eof())
            while (br.peekByte() != Tid.END_OF_PAGE) {
                defn.rules.push(RuleDefn.fromBuffer(br))
                assert(!br.eof())
            }
            br.readByte()
            return defn
        }
    }

    function pageDefnToJson(page: PageDefn): any {
        const obj = {
            R: page.rules.map(ruleDefnToJson),
        }
        if (!obj.R.length) {
            delete obj.R
        }
        return obj
    }

    function pageDefnFromJson(obj: any): PageDefn {
        if (typeof obj === "string") {
            obj = JSON.parse(obj)
        }
        const defn = new PageDefn()
        if (Array.isArray(obj["R"])) {
            const rules: any[] = obj["R"]
            defn.rules = rules.map(ruleDefnFromJson)
        }
        return defn
    }

    export class ProgramDefn {
        pages: PageDefn[]

        constructor() {
            this.pages = PAGE_IDS().map(id => new PageDefn())
        }

        public clone(): ProgramDefn {
            const brain = new ProgramDefn()
            brain.pages = this.pages.map(page => page.clone())
            return brain
        }

        public trim() {
            this.pages.map(page => page.trim())
        }

        public toBuffer() {
            const bw = new BufferWriter()
            // TODO: magic number and version
            this.pages.forEach(page => page.toBuffer(bw))
            bw.writeByte(Tid.END_OF_PROG)
            console.log(`toBuffer: ${bw.length}b`)
            return bw.buffer
        }

        public static fromBuffer(br: BufferReader) {
            const defn = new ProgramDefn()
            defn.pages = []
            assert(!br.eof())
            while (br.peekByte() != Tid.END_OF_PROG) {
                defn.pages.push(PageDefn.fromBuffer(br))
                assert(!br.eof())
            }
            br.readByte()
            return defn
        }
    }

    export function progDefnToJson(prog: ProgramDefn): any {
        return {
            P: prog.pages.map(pageDefnToJson),
        }
    }

    export function progDefnFromJson(obj: any): ProgramDefn {
        if (typeof obj === "string") {
            obj = JSON.parse(obj)
        }
        const defn = new ProgramDefn()
        if (obj && obj["P"] && Array.isArray(obj["P"])) {
            const pages: any[] = obj["P"]
            defn.pages = pages.map(pageDefnFromJson)
        }
        return defn
    }

    function isTerminal(tile: TileDefn) {
        return (
            tile.constraints &&
            tile.constraints.handling &&
            tile.constraints.handling["terminal"]
        )
    }

    export class Language {
        public static getTileSuggestions(
            rule: RuleDefn,
            name: string,
            index: number
        ): TileDefn[] {
            const all = Object.keys(tilesDB[name])
                .map(id => tilesDB[name][id])
                .filter((tile: TileDefn) => tile.isVisible())
                .sort((t1, t2) => t1.priority - t2.priority)

            if (name === "sensors" || name === "actuators") return all

            // Collect existing tiles up to index.
            let existing: TileDefn[] = []
            const ruleRep = rule.getRuleRep()
            for (let i = 0; i < index; ++i) {
                existing.push(ruleRep[name][i])
            }

            // Return empty set if the last existing tile is a "terminal".
            if (existing.length) {
                const last = existing[existing.length - 1]
                if (
                    isTerminal(last) ||
                    (name === "filters" && isTerminal(rule.sensors[0])) ||
                    (name === "modifiers" && isTerminal(rule.actuators[0]))
                ) {
                    return []
                }
            }

            // Collect the built-up constraints.
            const constraints = mkConstraints()
            if (name === "modifiers" && rule.actuators.length) {
                rule.actuators[0].mergeConstraints(constraints)
            }
            if (rule.sensors.length) {
                rule.sensors[0].mergeConstraints(constraints)
            }
            existing.forEach(tile => tile.mergeConstraints(constraints))

            return all.filter(tile => tile.isCompatibleWith(constraints))
        }

        public static ensureValid(rule: RuleDefn) {
            // TODO: Handle more cases. ex:
            // - filters not valid for new sensor
            // - modifiers not valid for new sensor or actuator
            if (!rule.sensors.length) {
                rule.filters = []
            }
            if (!rule.actuators.length) {
                rule.modifiers = []
            }
        }
    }

    function mkConstraints(): Constraints {
        const c: Constraints = {
            provides: [],
            only: [],
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
}
