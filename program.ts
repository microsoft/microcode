namespace kojac {
    export class Program {
        currPage: number;
        pages: Page[];
        done: boolean;
        executing: boolean;

        constructor(public progdef: ProgramDefn) {
            this.currPage = 0;
            this.pages = progdef.pages.map((elem, index) => new Page(this, elem, index));
        }

        public destroy() {
            for (const page of this.pages) {
                page.destroy();
            }
            this.pages = undefined;
            this.progdef = undefined;
        }

        public execute() {
            if (this.executing) { return; } // Disallow recursion from [call page] actuator.
            this.executing = true;
            this.done = false;
            const page = this.pages[this.currPage];
            if (page) {
                page.execute();
            }
            this.executing = false;
        }

        public switchPage(n: number) {
            this.currPage = n;
            const page = this.pages[this.currPage];
            if (page) {
                page.reset();
            }
            this.done = true;
        }
    }

    class Page {
        rules: Rule[];

        constructor(public prog: Program, public defn: PageDefn, public index: number) {
            this.rules = this.defn.rules.map(elem => new Rule(this, elem));
        }

        public destroy() {
            for (const rule of this.rules) {
                rule.destroy();
            }
            this.rules = undefined;
            this.defn = undefined;
            this.prog = undefined;
        }

        public execute() {
            for (const rule of this.rules) {
                rule.execute();
                if (this.prog.done) { break; }
            }
        }

        public reset() {
            for (const rule of this.rules) {
                rule.reset();
            }
        }
    }

    export class Rule {
        prevState: any;
        state: any;
        sensorFn: LibraryFn;
        filterFns: LibraryFn[];
        actuatorFn: LibraryFn;
        modifierFns: LibraryFn[];

        get prog(): Program { return this.page.prog; }

        constructor(public page: Page, public defn: RuleDefn) {
            this.prevState = {};
            this.state = {};
            this.sensorFn = Library.getFunction((this.defn.sensor || tiles.sensors[tid.sensor.always]).tid);
            this.filterFns = (this.defn.filters || [])
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map(elem => Library.getFunction(elem.tid));
            this.actuatorFn = Library.getFunction((this.defn.actuator || <any>{}).tid);
            this.modifierFns = (this.defn.modifiers || [])
                .slice()
                .sort((a, b) => a.priority - b.priority)
                .map(elem => Library.getFunction(elem.tid));
        }

        public destroy() {
            this.state = this.prevState = undefined;
            this.sensorFn = undefined;
            this.filterFns = undefined;
            this.actuatorFn = undefined;
            this.modifierFns = undefined;
            this.page = undefined;
            this.defn = undefined;
        }

        public execute() {
            this.prevState = this.state;
            this.state = {};
            if (!this.defn.sensor || this.defn.sensor.phase === "pre") {
                this.sensorFn(this);
            }
            this.filterFns.forEach(fn => fn(this));
            if (this.defn.sensor && this.defn.sensor.phase === "post") {
                this.sensorFn(this);
            }
            if (this.evalRuleCondition()) {
                this.modifierFns.forEach(fn => fn(this));
                this.actuatorFn(this);
           }
        }

        public reset() {
            this.prevState = {};
            this.state = {};
        }

        private evalRuleCondition(): boolean {
            switch (this.defn.condition) {
                case RuleCondition.LOW:
                    return !this.state["exec"];
                case RuleCondition.LOW_TO_HIGH:
                    // Strong false check against prev state to ensure it was evaluated, and resulted in "no exec".
                    return this.prevState["exec"] === false && this.state["exec"];
                case RuleCondition.HIGH_TO_LOW:
                    return this.prevState["exec"] && !this.state["exec"];
                default:
                    return this.state["exec"];
            }
        }
    }
}
