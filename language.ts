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
        editor: (
            field: any,
            picker: Picker,
            onHide?: () => void,
            onDelete?: () => void
        ) => void // use picker to update field
        toImage: (field: any) => Image // produce an image for the field for tile
        buttonStyle: () => ButtonStyle
        serialize: (field: any) => string
        deserialize: (s: string) => any
    }

    export class TileDefn {
        constructor(
            public type: TileType,
            public tid: string,
            public name: string
        ) {
            this.priority = 0
        }

        priority: number
        hidden: boolean // Hide from UI?
        constraints: Constraints
        fieldEditor: FieldEditor
        jdParam: any
        
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
            return this.fieldEditor ? this.fieldEditor.buttonStyle() : ButtonStyles.ShadowedWhite
        }

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
                    dst.handling[key] = src.handling[key]
                }
            }
        }

        isCompatibleWith(c: Constraints): boolean {
            if (!this.constraints) return true
            if (!this.constraints.requires) return true
            let compat = false
            this.constraints.requires.forEach(
                req => (compat = compat || c.provides.some(pro => pro === req))
            )
            return compat
        }
    }

    export enum Phase {
        Pre,
        Post,
    }

    export class SensorDefn extends TileDefn {
        public serviceClassName: string
        public eventCode: number
        public serviceInstanceIndex: number = 0

        constructor(tid: string, name: string, public phase: Phase) {
            super(TileType.SENSOR, tid, name)
        }
    }

    export class FilterModifierBase extends TileDefn {
        constructor(
            type: TileType,
            tid: string,
            name: string,
            public category: string
        ) {
            super(type, tid, name)
        }

        serviceCommandArg(): string | Buffer {
            return this.jdParam
        }

        isCompatibleWith(c: Constraints): boolean {
            if (!super.isCompatibleWith(c)) return false

            const allows =
                c.allow.categories.some(cat => cat === this.category) ||
                c.allow.tiles.some(tid => tid === this.tid)
            if (!allows) return false

            const disallows =
                !c.disallow.categories.some(cat => cat === this.category) &&
                !c.disallow.tiles.some(tid => tid === this.tid)
            if (!disallows) return false

            // TODO: check handling

            return true
        }
    }

    export class FilterDefn extends FilterModifierBase {
        eventCode: number
        constructor(
            tid: string,
            name: string,
            category: string,
            priority: number
        ) {
            super(TileType.FILTER, tid, name, category)
            this.priority = priority
        }
    }

    export class ActuatorDefn extends TileDefn {
        public serviceClassName: string
        public serviceCommand: number
        public serviceInstanceIndex: number = 0
        public serviceArgFromModifier: (jdParam: any) => string | Buffer

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
            super(TileType.MODIFIER, tid, name, category)
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

        public toObj(): any {
            const addField = (t: TileDefn) => {
                if (t.fieldEditor) {
                    const ret = `${t.tid}(${t.fieldEditor.serialize(
                        t.getField()
                    )})`
                    return ret
                } else {
                    return t.tid
                }
            }
            const obj = {
                S: this.sensors.map(t => addField(t)),
                A: this.actuators.map(t => addField(t)),
                F: this.filters.map(t => addField(t)),
                M: this.modifiers.map(t => addField(t)),
            }
            if (!obj.S) delete obj.S
            if (!obj.A) delete obj.A
            if (!obj.F.length) delete obj.F
            if (!obj.M.length) delete obj.M
            return obj
        }

        public static FromObj(obj: any): RuleDefn {
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
        public static getTileSuggestions(
            rule: RuleDefn,
            name: string,
            index: number
        ): TileDefn[] {
            const all = Object.keys(tilesDB[name])
                .map(id => tilesDB[name][id])
                .filter((tile: TileDefn) => !tile.hidden)
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
                    last.constraints &&
                    last.constraints.handling &&
                    last.constraints.handling["terminal"]
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
