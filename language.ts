namespace microcode {

    export interface Constraints {
        provides?: number[]
        requires?: number[]
        only?: (string | number)[]
        allow?: (string | number)[]
        disallow?: (string | number)[]
    }

    export class FieldEditor {
        init(): any {
            return undefined
        }
        clone(field: any): any {
            return undefined
        }
        editor(
            field: any,
            picker: Picker,
            onHide: () => void,
            onDelete?: () => void
        ): void { }
        toImage(field: any): Image {
            return undefined
        }
        toBuffer(field: any): Buffer {
            return undefined
        }
        fromBuffer(buf: BufferReader): any {
            return undefined
        }
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

    export function mergeConstraints(src: Constraints, dst: Constraints) {
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
            src.allow.forEach(item => dst.allow.push(item))
        }
        if (src.disallow) {
            src.disallow.forEach(item => dst.disallow.push(item))
        }
    }

    export function isCompatibleWith(src: Constraints, c: Constraints): boolean {
        if (!src) return true
        if (src.requires) {
            let compat = false
            src.requires.forEach(
                req =>
                    (compat = compat || c.provides.some(pro => pro === req))
            )
            if (!compat) return false
        }
        return true
    }

    export function filterModifierCompat(c: Constraints, tid: string,
        category: string | number): boolean {

        const tidEnum = tidToEnum(tid)
        const only = c.only.some(cat => cat === category || cat === tidEnum)
        if (only) return true
        if (c.only.length) return false

        const allows = c.allow.some(
            cat => cat === category || cat === tidEnum
        )
        if (!allows) return false

        const disallows = !c.disallow.some(
            cat => cat === category || cat === tidEnum
        )
        if (!disallows) return false

        return true
    }
    
    export class TileDefn {
        constructor(public tid: string) { }

        getField(): any {
            return undefined
        }

        getIcon(): string | Image {
            return this.tid
        }

        getNewInstance(field: any = null): TileDefn {
            return this
        }
    }

    export class StmtTileDefn extends TileDefn { }
    export class SensorDefn extends StmtTileDefn { }

    export class FilterModifierBase extends TileDefn {
        constructor(tid: string) {
            super(tid)
        }

        serviceCommandArg(): string | Buffer {
            const param = jdParam(this.tid)
            if (typeof param == "string" || typeof param == "object")
                return param
            return null
        }

    }

    export class FilterDefn extends FilterModifierBase {
        constructor(tid: string) {
            super(tid)
        }
    }

    export class ActuatorDefn extends StmtTileDefn { }

    export class ModifierDefn extends FilterModifierBase {
        constructor(tid: string) {
            super(tid)
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
                const fieldEditor = getFieldEditor(mod)
                if (fieldEditor) {
                    bw.writeBuffer(fieldEditor.toBuffer(mod.getField()))
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
                if (
                    modifier instanceof ModifierEditor &&
                    modifier.fieldEditor
                ) {
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

    export class PageDefn {
        rules: RuleDefn[]

        constructor() {
            this.rules = []
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

    export class ProgramDefn {
        pages: PageDefn[]

        constructor() {
            this.pages = PAGE_IDS().map(id => new PageDefn())
        }

        public trim() {
            this.pages.map(page => page.trim())
        }

        public toBuffer() {
            const bw = new BufferWriter()
            const magic = Buffer.create(4)
            magic.setNumber(NumberFormat.UInt32LE, 0, 0x3e92f825)
            bw.writeBuffer(magic)
            this.pages.forEach(page => page.toBuffer(bw))
            bw.writeByte(Tid.END_OF_PROG)
            console.log(`toBuffer: ${bw.length}b`)
            return bw.buffer
        }

        public static fromBuffer(br: BufferReader) {
            const defn = new ProgramDefn()
            assert(!br.eof())
            const magic = br.readBuffer(4)
            if (magic.getNumber(NumberFormat.UInt32LE, 0) != 0x3e92f825) {
                console.log("bad magic")
                return defn
            }
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

    function isTerminal(tile: TileDefn) {
        return isTidTerminal(tidToEnum(tile.tid))
    }

    export class Language {
        public static getTileSuggestions(
            rule: RuleDefn,
            name: string,
            index: number
        ): TileDefn[] {
            const all = Object.keys(tilesDB[name])
                .map(id => tilesDB[name][id])
                .filter((tile: TileDefn) => isVisible(tidToEnum(tile.tid)))
                .sort((t1, t2) => priority(t1.tid) - priority(t2.tid))

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
                const src = getConstraints(rule.actuators[0].tid)
                mergeConstraints(src, constraints)
            }
            if (rule.sensors.length) {
                const src = getConstraints(rule.sensors[0].tid)
                mergeConstraints(src, constraints)
            }

            existing.forEach(tile => {
                const src = getConstraints(tile.tid)
                mergeConstraints(src, constraints)
            })

            return all.filter(tile => {
                const src = getConstraints(tile.tid)
                const cat = getCategory(tile.tid)
                return isCompatibleWith(src, constraints) && 
                    filterModifierCompat(constraints, tile.tid, cat)
            })
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
            allow: [],
            disallow: [],
        }
        return c
    }
}
