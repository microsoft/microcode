namespace kojac {

    export enum TileType {
        SENSOR = 1,
        FILTER = 2,
        ACTUATOR = 3,
        MODIFIER = 4
    };

    export interface Constraints {
        provides?: string[];
        requires?: string[];
        allow?: {
            tiles?: string[];
            categories?: string[];
        };
        disallow?: {
            tiles?: string[];
            categories?: string[];
        };
        handling?: { [id: string]: string | number | boolean };
    }

    export interface TileDefn {
        type: TileType;
        tid: string;
        name: string;
        weight?: number; // Influences sort order
        hidden?: boolean;   // Hide from UI?
        category?: string;
        constraints?: Constraints;
    }

    export type SensorDefn = TileDefn & {
        type: TileType.SENSOR;
        phase: "pre" | "post";  // whether to execute before or after filters evaluate.
    };
    export type FilterDefn = TileDefn & {
        type: TileType.FILTER;
        category: string;
        priority: number;   // for runtime reordering. 10 is default.
    };
    export type ActuatorDefn = TileDefn & { type: TileType.ACTUATOR; };
    export type ModifierDefn = TileDefn & {
        type: TileType.MODIFIER;
        category: string;
        priority: number;   // for runtime reordering. 10 is default.
    };

    export const RuleCondition = {
        DEFAULT: "RC0",
        HIGH: "RC1",
        LOW: "RC2",
        HIGH_TO_LOW: "RC3",
        LOW_TO_HIGH: "RC4"
    }

    export const RC_IDS = [RuleCondition.HIGH, RuleCondition.LOW, RuleCondition.HIGH_TO_LOW, RuleCondition.LOW_TO_HIGH];

    export class RuleDefn {
        condition: string;
        sensor: SensorDefn;
        filters: FilterDefn[];
        actuator: ActuatorDefn;
        modifiers: ModifierDefn[];

        constructor() {
            this.condition = RuleCondition.DEFAULT;
            this.filters = [];
            this.modifiers = [];
        }

        public clone(): RuleDefn {
            const rule = new RuleDefn();
            rule.condition = this.condition;
            rule.sensor = this.sensor;
            rule.actuator = this.actuator;
            rule.filters = this.filters.slice(0);
            rule.modifiers = this.modifiers.slice(0);
            return rule;
        }

        public isEmpty(): boolean {
            return !this.sensor && !this.actuator;
        }

        public toObj(): any {
            const obj = {
                C: this.condition,
                S: this.sensor ? this.sensor.tid : undefined,
                A: this.actuator ? this.actuator.tid : undefined,
                F: this.filters.map(elem => elem.tid),
                M: this.modifiers.map(elem => elem.tid)
            };
            if (!obj.C) { delete obj.C; }
            if (!obj.S) { delete obj.S; }
            if (!obj.A) { delete obj.A; }
            if (!obj.F.length) { delete obj.F; }
            if (!obj.M.length) { delete obj.M; }
            return obj;
        }

        public static FromObj(obj: any): RuleDefn {
            if (typeof obj === 'string') {
                obj = JSON.parse(obj);
            }
            const defn = new RuleDefn;
            if (typeof obj["C"] === 'string') {
                defn.condition = obj["C"];
            }
            if (typeof obj["S"] === 'string') {
                defn.sensor = tiles.sensors[obj["S"]];
            }
            if (typeof obj["A"] === 'string') {
                defn.actuator = tiles.actuators[obj["A"]];
            }
            if (Array.isArray(obj["F"])) {
                const filters: any[] = obj["F"];
                defn.filters = filters.map((elem: string) => tiles.filters[elem]);
            }
            if (Array.isArray(obj["M"])) {
                const modifiers: any[] = obj["M"];
                defn.modifiers = modifiers.map((elem: string) => tiles.modifiers[elem]);
            }
            return defn;
        }
    }

    export class PageDefn {
        rules: RuleDefn[];

        constructor() {
            this.rules = [];
        }

        public clone(): PageDefn {
            const page = new PageDefn();
            page.rules = this.rules.map(rule => rule.clone());
            return page;
        }

        public trim() {
            while (this.rules.length && this.rules[this.rules.length - 1].isEmpty()) {
                this.rules.pop();
            }
        }

        public deleteRuleAt(index: number) {
            if (index >= 0 && index < this.rules.length) {
                this.rules.splice(index, 1);
            }
        }

        public insertRuleAt(index: number) {
            if (index >= 0 && index < this.rules.length) {
                // STS Array.splice doesn't support insert :(
                // this.rules.splice(index, 0, new RuleDefn());
                const rules: RuleDefn[] = [];
                for (let i = 0; i < index; ++i) {
                    rules.push(this.rules[i]);
                }
                rules.push(new RuleDefn());
                for (let i = index; i < this.rules.length; ++i) {
                    rules.push(this.rules[i]);
                }
                this.rules = rules;
            }
        }

        public toObj(): any {
            const obj = {
                R: this.rules.map(elem => elem.toObj())
            };
            if (!obj.R.length) {
                delete obj.R;
            }
            return obj;
        }

        public static FromObj(obj: any): PageDefn {
            if (typeof obj === 'string') {
                obj = JSON.parse(obj);
            }
            const defn = new PageDefn;
            if (Array.isArray(obj["R"])) {
                const rules: any[] = obj["R"];
                defn.rules = rules.map((elem: any) => RuleDefn.FromObj(elem));
            }
            return defn;
        }
    }

    export class ProgramDefn {
        pages: PageDefn[];

        constructor() {
            this.pages = PAGE_IDS.map(id => new PageDefn());
        }

        public clone(): ProgramDefn {
            const brain = new ProgramDefn();
            brain.pages = this.pages.map(page => page.clone());
            return brain;
        }

        public trim() {
            this.pages.map(page => page.trim());
        }

        public toObj(): any {
            return {
                P: this.pages.map(elem => elem.toObj())
            };
        }

        public static FromObj(obj: any): ProgramDefn {
            if (typeof obj === 'string') {
                obj = JSON.parse(obj);
            }
            const defn = new ProgramDefn();
            if (obj && obj["P"] && Array.isArray(obj["P"])) {
                const pages: any[] = obj["P"];
                defn.pages = pages.map((elem: any) => PageDefn.FromObj(elem));
            }
            return defn;
        }
    }

    export class Language {
        public static getSensorSuggestions(rule: RuleDefn): SensorDefn[] {
            let sensors = Object.keys(tiles.sensors)
                .map(id => tiles.sensors[id])
                .filter(tile => !tile.hidden)
                .sort((a, b) => {
                    const wa = a.weight || 100;
                    const wb = b.weight || 100;
                    return wa - wb;
                });
            return sensors;
        }

        public static getFilterSuggestions(rule: RuleDefn, index: number): FilterDefn[] {
            let all = Object.keys(tiles.filters)
                .map(id => tiles.filters[id])
                .filter(tile => !tile.hidden)
                .sort((a, b) => {
                    const wa = a.weight || 100;
                    const wb = b.weight || 100;
                    return wa - wb;
                });

            // Collect existing tiles up to index.
            let existing: TileDefn[] = [];
            for (let i = 0; i < index; ++i) {
                existing.push(rule.filters[i]);
            }

            // Return empty set if the last existing tile is a "terminal".
            if (existing.length) {
                const last = existing[existing.length - 1];
                if (last.constraints && last.constraints.handling && last.constraints.handling["terminal"]) { return []; }
            }

            // Collect the built-up constraints.
            const constraints = mkConstraints();
            mergeConstraints(constraints, rule.sensor ? rule.sensor.constraints : null)
            for (let i = 0; i < existing.length; ++i) {
                mergeConstraints(constraints, existing[i].constraints);
            }

            return this.getCompatibleSet(all, constraints);
        }

        public static getActuatorSuggestions(rule: RuleDefn): ActuatorDefn[] {
            let actuators = Object.keys(tiles.actuators)
                .map(id => tiles.actuators[id])
                .filter(tile => !tile.hidden)
                .sort((a, b) => {
                    const wa = a.weight || 100;
                    const wb = b.weight || 100;
                    return wa - wb;
                });
            return actuators;
        }

        public static getModifierSuggestions(rule: RuleDefn, index: number): ModifierDefn[] {
            const all = Object.keys(tiles.modifiers)
                .map(id => tiles.modifiers[id])
                .filter(tile => !tile.hidden)
                .sort((a, b) => {
                    const wa = a.weight || 100;
                    const wb = b.weight || 100;
                    return wa - wb;
                });

            // Collect existing tiles up to index.
            let existing: TileDefn[] = [];
            for (let i = 0; i < index; ++i) {
                existing.push(rule.modifiers[i]);
            }

            // Return empty set if the last existing tile is a "terminal".
            if (existing.length) {
                const last = existing[existing.length - 1];
                if (last.constraints && last.constraints.handling && last.constraints.handling["terminal"]) { return []; }
            }

            // Collect the built-up constraints.
            const constraints = mkConstraints();
            mergeConstraints(constraints, rule.actuator ? rule.actuator.constraints : null);
            mergeConstraints(constraints, rule.sensor ? rule.sensor.constraints : null)
            for (let i = 0; i < existing.length; ++i) {
                mergeConstraints(constraints, existing[i].constraints);
            }

            return this.getCompatibleSet(all, constraints);
        }

        private static getCompatibleSet<T extends TileDefn>(all: T[], c: Constraints): T[] {
            let compat = all
                // Filter "requires" to matching "provides".
                .filter(tile => {
                    if (!tile.constraints) return true;
                    if (!tile.constraints.requires) return true;
                    let met = false;
                    tile.constraints.requires.forEach(req => met = met || c.provides.some(pro => pro === req));
                    return met;
                })
                // Filter "allows".
                .filter(tile => c.allow.categories.some(cat => cat === tile.category) || c.allow.tiles.some(tid => tid === tile.tid))
                // Filter "disallows".
                .filter(tile => !c.disallow.categories.some(cat => cat === tile.category) && !c.disallow.tiles.some(tid => tid === tile.tid));

            // TODO: c.handling

            return compat;
        }

        public static ensureValid(rule: RuleDefn) {
            // TODO: Handle more cases. ex:
            // - filters not valid for new sensor
            // - modifiers not valid for new sensor or actuator
            if (!rule.sensor) {
                rule.filters = [];
            }
            if (!rule.actuator) {
                rule.modifiers = [];
            }
        }
    }

    function mkConstraints(): Constraints {
        const c: Constraints = {
            provides: [],
            requires: [],
            allow: {
                tiles: [],
                categories: []
            },
            disallow: {
                tiles: [],
                categories: []
            },
            handling: {}
        };
        return c;
    }

    function mergeConstraints(dst: Constraints, src?: Constraints) {
        if (!src) { return; }
        if (src.provides) {
            src.provides.forEach(item => dst.provides.push(item));
        }
        if (src.requires) {
            src.requires.forEach(item => dst.requires.push(item));
        }
        if (src.allow) {
            (src.allow.tiles || []).forEach(item => dst.allow.tiles.push(item));
            (src.allow.categories || []).forEach(item => dst.allow.categories.push(item));
        }
        if (src.disallow) {
            (src.disallow.tiles || []).forEach(item => dst.disallow.tiles.push(item));
            (src.disallow.categories || []).forEach(item => dst.disallow.categories.push(item));
        }
        if (src.handling) {
            const keys = Object.keys(src.handling);
            for (const key of keys) {
                dst.handling[key] = src.handling[key];
            }
        }
    }

    type SensorMap = { [id: string]: SensorDefn; };
    type FilterMap = { [id: string]: FilterDefn; };
    type ActuatorMap = { [id: string]: ActuatorDefn; };
    type ModifierMap = { [id: string]: ModifierDefn; };

    export type TileDatabase = {
        sensors: SensorMap;
        filters: FilterMap;
        actuators: ActuatorMap;
        modifiers: ModifierMap;
    };

    // Once a tid is assigned, it can NEVER BE CHANGED OR REPURPOSED.
    // Every tid must be unique in the set of all tids.
    export const tid = {
        sensor: <any>{
            always: "S1",
            button_a: "S2",
            button_b: "S3",
            timer: "S4",
            pin_1: "S6",
        },
        filter: <any>{
            timespan_short: "F1",
            timespan_long: "F2",
            pin_analog: "F8",
            pin_digital: "F9",
        },
        actuator: <any>{
            switch_page: "A1",
            pin_0: "A3",
            log: "A4",
            plot: "A5",
        },
        modifier: <any>{
            page_1: "M1",
            page_2: "M2",
            page_3: "M3",
            page_4: "M4",
            page_5: "M5",
            pin_on: "M11",
            pin_off: "M12",
            color_white: "M13",
            color_red: "M14",
            color_pink: "M15",
            color_orange: "M16",
            color_yellow: "M17",
            color_teal: "M18",
            color_green: "M19",
            color_blue: "M20",
            color_lightblue: "M21",
            color_purple: "M22",
            color_lightpurple: "M23",
            color_darkpurple: "M24",
            color_tan: "M25",
            color_brown: "M26",
            color_black: "M27",
        }
    }

    export const PAGE_IDS = [
        tid.modifier.page_1,
        tid.modifier.page_2,
        tid.modifier.page_3,
        tid.modifier.page_4,
        tid.modifier.page_5
    ];

    export const tiles: TileDatabase = {
        sensors: {
            [tid.sensor.always]: {
                type: TileType.SENSOR,
                tid: tid.sensor.always,
                name: "Always",
                phase: "pre",
                hidden: true
            },
            [tid.sensor.button_a]: {
                type: TileType.SENSOR,
                tid: tid.sensor.button_a,
                name: "A",
                phase: "pre",
                constraints: {
                    provides: ["input"],
                    allow: {
                        categories: ["button-event"]
                    }
                }
            },
            [tid.sensor.button_b]: {
                type: TileType.SENSOR,
                tid: tid.sensor.button_b,
                name: "B",
                phase: "pre",
                constraints: {
                    provides: ["input"],
                    allow: {
                        categories: ["button-event"]
                    }
                }
            },
            [tid.sensor.timer]: {
                type: TileType.SENSOR,
                tid: tid.sensor.timer,
                name: "Timer",
                phase: "post",
                constraints: {
                    allow: {
                        categories: ["timespan"]
                    }
                }
            },
            [tid.sensor.pin_1]: {
                type: TileType.SENSOR,
                tid: tid.sensor.pin_1,
                name: "Pin 1",
                phase: "post",
                constraints: {
                    allow: {
                        categories: ["pin_mode"]
                    }
                }
            }
        },
        filters: {
            [tid.filter.timespan_short]: {
                type: TileType.FILTER,
                tid: tid.filter.timespan_short,
                name: "short",
                category: "timespan",
                priority: 10,
                constraints: {
                }
            },
            [tid.filter.timespan_long]: {
                type: TileType.FILTER,
                tid: tid.filter.timespan_long,
                name: "long",
                category: "timespan",
                priority: 10,
                constraints: {
                }
            },
            [tid.filter.pin_analog]: {
                type: TileType.FILTER,
                tid: tid.filter.pin_analog,
                name: "analog",
                category: "pin_mode",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["pin_mode"]
                    }
                }
            },
            [tid.filter.pin_digital]: {
                type: TileType.FILTER,
                tid: tid.filter.pin_digital,
                name: "digital",
                category: "pin_mode",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["pin_mode"]
                    }
                }
            },
        },
        actuators: {
            [tid.actuator.switch_page]: {
                type: TileType.ACTUATOR,
                tid: tid.actuator.switch_page,
                name: "Switch page",
                constraints: {
                    allow: {
                        categories: ["page"]
                    }
                }
            },
            [tid.actuator.pin_0]: {
                type: TileType.ACTUATOR,
                tid: tid.actuator.pin_0,
                name: "Pin 0",
                constraints: {
                    allow: {
                        categories: ["pin_output"]
                    }
                }
            },
            [tid.actuator.log]: {
                type: TileType.ACTUATOR,
                tid: tid.actuator.log,
                name: "Log",
                constraints: {
                    allow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.actuator.plot]: {
                type: TileType.ACTUATOR,
                tid: tid.actuator.plot,
                name: "Plot",
                constraints: {
                    allow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.actuator.showLed]: {
                type: TileType.ACTUATOR,
                tid: tid.actuator.showLed,
                name: "ShowLed"
            },
        },
        modifiers: {
            [tid.modifier.page_1]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.page_1,
                name: "page 1",
                category: "page",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.page_2]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.page_2,
                name: "page 2",
                category: "page",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.page_3]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.page_3,
                name: "page 3",
                category: "page",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.page_4]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.page_4,
                name: "page 4",
                category: "page",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.page_5]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.page_5,
                name: "page 5",
                category: "page",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.pin_on]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.pin_on,
                name: "on",
                category: "pin_output",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.pin_off]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.pin_off,
                name: "off",
                category: "pin_output",
                priority: 10,
                constraints: {
                    handling: {
                        "terminal": true
                    }
                }
            },
            [tid.modifier.color_white]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_white,
                name: "white",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_red]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_red,
                name: "red",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_pink]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_pink,
                name: "pink",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_orange]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_orange,
                name: "orange",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_yellow]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_yellow,
                name: "yellow",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_teal]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_teal,
                name: "teal",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_green]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_green,
                name: "green",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_blue]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_blue,
                name: "blue",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_lightblue]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_lightblue,
                name: "light blue",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_purple]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_purple,
                name: "purple",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_lightpurple]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_lightpurple,
                name: "light purple",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_darkpurple]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_darkpurple,
                name: "dark purple",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_tan]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_tan,
                name: "tan",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_brown]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_brown,
                name: "brown",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
            [tid.modifier.color_black]: {
                type: TileType.MODIFIER,
                tid: tid.modifier.color_black,
                name: "black",
                category: "color",
                priority: 10,
                constraints: {
                    disallow: {
                        categories: ["color"]
                    }
                }
            },
        }
    }
}
