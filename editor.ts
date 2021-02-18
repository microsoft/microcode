namespace kojac {

    export class Editor extends Stage {
        private progdef: ProgramDefn;
        private currPage: number;
        private pageBtn: Button;
        private prevPageBtn: Button;
        private nextPageBtn: Button;
        private okBtn: Button;
        private cancelBtn: Button;
        private pageEditor: PageEditor;

        constructor(app: App) {
            super(app, "editor");
        }

        startup() {
            super.startup();
            controller.right.onEvent(ControllerButtonEvent.Released, function() {
                this.app.popStage();
            });
            this.currPage = 0;
            this.pageBtn = new Button(this, StageLayer.HUD, {
                style: "white",
                icon: PAGE_IDS[this.currPage],
                x: scene.screenWidth() >> 1,
                y: 8
            });
            this.okBtn = new Button(this, StageLayer.HUD, {
                style: "white",
                icon: "ok",
                x: scene.screenWidth() - 8,
                y: 8
            });
            this.cancelBtn = new Button(this, StageLayer.HUD, {
                style: "white",
                icon: "cancel",
                x: scene.screenWidth() - 24,
                y: 8
            });
        }

        shutdown() {
            this.progdef = undefined;
            super.shutdown();
        }

        activate() {
            super.activate();
            scene.setBackgroundColor(11);
            this.progdef = this.app.load(SAVESLOT_AUTO);
            this.currPage = 0;
            this.pageBtn.setIcon(PAGE_IDS[this.currPage]);
            this.pageEditor = new PageEditor(this, this.progdef.pages[this.currPage]);
        }
    }

    class PageEditor extends Component {
        rules: RuleEditor[];

        constructor(public editor: Editor, pagedef: PageDefn) {
            super(editor, StageLayer.World, "page_editor");
            this.rules = pagedef.rules.map(ruledef => new RuleEditor(editor, ruledef));
            this.ensureFinalEmptyRule();
        }

        destroy() {
            this.rules.forEach(rule => rule.destroy());
            this.rules = undefined;
            super.destroy();
        }

        private ensureFinalEmptyRule() {
            this.trimRules();
            this.rules.push(new RuleEditor(this.editor, new RuleDefn()));
        }

        private trimRules() {
            if (!this.rules.length) { return; }
            let last = this.rules[this.rules.length - 1];
            while (last.isEmpty()) {
                last.destroy();
                this.rules.pop();
                if (!this.rules.length) { return; }
                last = this.rules[this.rules.length - 1];
            }
        }

        public layout() {
            let top = 20;
            this.rules.forEach(rule => {
                rule.layout(0, top);
                top += 18;
            });
        }
    }

    class RuleEditor extends Component {
        whenLbl: Kelpie;
        doLbl: Kelpie;
        handleBtn: Button;
        whenInsertBtn: Button;
        doInsertBtn: Button;
        sensor: Button;
        filters: Button[];
        actuator: Button;
        modifiers: Button[];

        constructor(public editor: Editor, ruledef: RuleDefn) {
            super(editor, StageLayer.World, "rule_editor");
            this.whenLbl = new Kelpie(editor, StageLayer.World, icons.get("when"));
            this.doLbl = new Kelpie(editor, StageLayer.World, icons.get("do"));
            this.handleBtn = new Button(editor, StageLayer.World, {
                icon: ruledef.condition,
                x: 0, y: 0
            });
            this.filters = [];
            this.modifiers = [];
        }

        destroy() {
            this.destroyProgramTiles();
            this.whenLbl.destroy();
            this.doLbl.destroy();
            this.handleBtn.destroy();
            this.whenInsertBtn.destroy();
            this.doInsertBtn.destroy();
            this.whenLbl = undefined;
            this.doLbl = undefined;
            this.handleBtn = undefined;
            this.whenInsertBtn = undefined;
            this.doInsertBtn = undefined;
            super.destroy();
        }

        private destroyProgramTiles() {
            if (this.sensor) { this.sensor.destroy(); }
            if (this.actuator) { this.actuator.destroy(); }
            this.filters.forEach(filter => filter.destroy());
            this.modifiers.forEach(modifier => modifier.destroy());
            this.sensor = undefined;
            this.actuator = undefined;
            this.filters = undefined;
            this.modifiers = undefined;
        }

        public isEmpty() {
            return (
                !this.sensor &&
                !this.actuator &&
                this.filters.length === 0 &&
                this.modifiers.length === 0);
        }

        public layout(left: number, top: number) {
            const v = new Vec2(left, top);
            this.handleBtn.pos = v;
            v.x += (this.handleBtn.width >> 1) + (this.whenLbl.width >> 1);
            this.whenLbl.pos = v;
            //left += (this.whenLbl.width >> 1) + (this.whenInsertBtn.width >> 1);



        }
    }
}