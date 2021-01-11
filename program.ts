namespace kodu {
    export const Feeling = {
        None: "feel.0",
        Happy: "feel.1",
        Angry: "feel.2",
        Heart: "feel.3",
        Sad: "feel.4"
    }

    export class Program {
        currPage: number;
        pages: Page[];
        done: boolean;
        wander: Wander;
        prevFeeling: string;
        feeling: string;
        executing: boolean;

        constructor(public char: Character) {
            this.prevFeeling = this.feeling = Feeling.None;
            this.currPage = 0;
            this.wander = new Wander(this);
            if (char.bdefn) {
                this.pages = char.bdefn.pages.map((elem, index) => new Page(this, elem, index));
            } else {
                this.pages = [];
            }
        }

        public destroy() {
            for (const page of this.pages) {
                page.destroy();
            }
            this.pages = undefined;
            this.char = undefined;
        }

        public execute() {
            if (this.executing) { return; } // Disallow recursion from [call page] actuator.
            this.executing = true;
            this.done = false;
            this.prevFeeling = this.feeling;
            const page = this.pages[this.currPage];
            if (page) {
                this.wander.prepare();
                page.execute();
                this.wander.update();
            }
            this.executing = false;
            this.updateExpression();
        }

        public switchPage(n: number) {
            this.currPage = n;
            const page = this.pages[this.currPage];
            if (page) {
                page.reset();
            }
            this.done = true;
        }

        public cameraFollow(char: Character) {
            this.char.stage.notify("camera:follow", char);
        }

        public feel(feeling: string) {
            this.feeling = feeling;
        }

        private updateExpression() {
            if (this.feeling !== this.prevFeeling) {
                this.char.showFeeling(this.feeling);
            }
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
        hasInput: boolean;
        hasMovement: boolean;

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
            this.hasInput =
                this.defn.sensor &&
                this.defn.sensor.constraints &&
                (this.defn.sensor.constraints.provides || []).some(item => item === "input");
            this.hasMovement =
                this.defn.actuator &&
                this.defn.actuator.category &&
                this.defn.actuator.category === "movement";
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
            if (this.hasInput) {
                this.page.prog.char.stage.notify("char:has-input", this.page.prog.char);
            }
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
                if (this.hasMovement) {
                    this.queueDefaultMovement();
                }
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

        private queueDefaultMovement() {
            // Don't enqueue a movement if moves are already queued.
            if (!this.state["direction"] && !this.prog.char.impulseQueue.length) {
                const dir = this.prog.wander.direction();
                const speed = this.prog.char.defn.defaults.speed;
                this.prog.char.queueImpulse(dir, speed, ImpulseType.Default);
                this.state["direction"] = dir;
            }
        }
    }

    class Wander {
        dest: Vec2;
        poked: boolean;
        timer: any;

        constructor(public prog: Program) {}

        public prepare() {
            this.poked = false;
            if (!this.dest) { this.pickDest(); }
        }

        public update() {
            if (this.poked) {
                if (this.timer) { return; }
                this.setTimer();
            } else {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    this.dest = null; // maybe keep this?
                }
            }
        }

        public direction(): Vec2 {
            this.poked = true;
            if (!this.dest) {
                this.pickDest();
            }
            const dx = (this.dest.x - this.prog.char.x);
            const dy = (this.dest.y - this.prog.char.y);
            const distSq = (dx * dx) + (dy * dy);

            if (!distSq) {
                return undefined;
            }

            const dist = Math.sqrt(distSq);
            return mkVec2(dx / dist, dy / dist);
        }

        private timerCallback() {
            this.pickDest();
            this.timer = null;
        }

        private setTimer() {
            this.timer = setTimeout(() => this.timerCallback(), 1000 * Math.floor(2 + Math.random() * 3));
        }

        margin = 10;

        private pickDest() {
            if (!this.prog.char.kelpie) { return; }
            const camx = this.prog.char.stage.camera.x;
            const camy = this.prog.char.stage.camera.y;
            const x = -(80 + this.margin) + camx + Math.random() * (160 + this.margin * 2);
            const y = -(60 + this.margin) + camy + Math.random() * (120 + this.margin * 2);
            this.dest = mkVec2(x, y);
        }

    }
}
