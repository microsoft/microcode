namespace kojac {

    class EditorButton extends Button {
        constructor(
            public editor: Editor,
            opts: {
                style?: ButtonStyle,
                icon: string,
                label?: string,
                hud?: boolean,
                x: number,
                y: number,
                onClick?: (button: Button) => void
            }
        ) {
            super(editor, opts);
            editor.changed();
        }

        destroy() {
            this.editor.changed();
            super.destroy();
        }
    }

    export class Editor extends Stage {
        private quadtree: QuadTree;
        private progdef: ProgramDefn;
        private currPage: number;
        private pageBtn: Button;
        private prevPageBtn: Button;
        private nextPageBtn: Button;
        private okBtn: Button;
        private cancelBtn: Button;
        private pageEditor: PageEditor;
        public cursor: Cursor;
        private _changed: boolean;

        constructor(app: App) {
            super(app, "editor");
        }

        public changed() { this._changed = true; }

        private okClicked() {
            this.app.stageManager.pop();
        }

        private cancelClicked() {
            this.app.stageManager.pop();
        }

        startup() {
            super.startup();
            controller.up.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveUp());
            controller.up.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveUp());
            controller.down.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveDown());
            controller.down.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveDown());
            controller.left.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveLeft());
            controller.left.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveLeft());
            controller.right.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveRight());
            controller.right.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveRight());
            controller.A.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.click());
            this.cursor = new Cursor(this);
            this.currPage = 0;
            this.pageBtn = new EditorButton(this, {
                style: "white",
                icon: PAGE_IDS[this.currPage],
                hud: true,
                x: scene.screenWidth() >> 1,
                y: 8
            });
            this.nextPageBtn = new EditorButton(this, {
                style: "white",
                icon: "next_page",
                hud: true,
                x: (scene.screenWidth() >> 1) + 16,
                y: 8
            });
            this.prevPageBtn = new EditorButton(this, {
                style: "white",
                icon: "prev_page",
                hud: true,
                x: (scene.screenWidth() >> 1) - 16,
                y: 8
            });
            this.okBtn = new EditorButton(this, {
                style: "white",
                icon: "ok",
                hud: true,
                x: scene.screenWidth() - 8,
                y: 8,
                onClick: () => this.okClicked()
            });
            this.cancelBtn = new EditorButton(this, {
                style: "white",
                icon: "cancel",
                hud: true,
                x: scene.screenWidth() - 24,
                y: 8,
                onClick: () => this.cancelClicked()
            });
        }

        shutdown() {
            this.progdef = undefined;
            this.quadtree.clear();
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

        update(dt: number) {
            super.update(dt);
            if (this._changed) {
                this._changed = false;
                this.rebuildSpatialDb();
            }
        }

        private rebuildSpatialDb() {
            if (this.quadtree) {
                this.quadtree.clear();
            }
            this.quadtree = new QuadTree(new Bounds({
                left: 0,
                top: 0,
                width: 4096,
                height: 4096
            }), 1, 16);
            this.addToSpatialDb(this.pageBtn);
            this.addToSpatialDb(this.prevPageBtn);
            this.addToSpatialDb(this.nextPageBtn);
            this.addToSpatialDb(this.okBtn);
            this.addToSpatialDb(this.cancelBtn);
            this.pageEditor.addToSpatialDb();
            // Assign quadtree to cursor.
            this.cursor.quadtree = this.quadtree;
        }

        public addToSpatialDb(btn: Button) {
            if (this.quadtree) {
                this.quadtree.insert(Bounds.Translate(btn.hitbox, btn.pos), btn);
            }
        }

        draw(camera: scene.Camera) {
            super.draw(camera);
            /* Draw quadtree
            if (this.quadtree) {
                const ox = camera.drawOffsetX;
                const oy = camera.drawOffsetY;
                this.quadtree.forEach(bounds => {
                    screen.drawLine(bounds.left - ox, bounds.top - oy, bounds.left + bounds.width - ox, bounds.top - oy, 5);
                    screen.drawLine(bounds.left - ox, bounds.top + bounds.height - oy, bounds.left + bounds.width - ox, bounds.top + bounds.height - oy, 5);
                    screen.drawLine(bounds.left - ox, bounds.top - oy, bounds.left - ox, bounds.top + bounds.height - oy, 5);
                    screen.drawLine(bounds.left + bounds.width - ox, bounds.top - oy, bounds.left + bounds.width - ox, bounds.top + bounds.height - oy, 5);
                });
            }
            */
        }
    }

    class PageEditor extends Component {
        rules: RuleEditor[];

        constructor(public editor: Editor, pagedef: PageDefn) {
            super(editor, "page_editor");
            this.rules = pagedef.rules.map(ruledef => new RuleEditor(editor, ruledef));
            this.ensureFinalEmptyRule();
            this.layout();
            this.initCursor();
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
            let left = 10;
            let top = 36;
            this.rules.forEach(rule => {
                rule.layout(left, top);
                top += 18;
            });
        }

        private initCursor() {
            const rule = this.rules[0];
            let btn: Button;
            if (rule.sensor) {
                btn = rule.sensor;
            } else if (rule.filters.length) {
                btn = rule.filters[0];
            } else {
                btn = rule.whenInsertBtn;
            }
            this.editor.cursor.snapTo(btn.x, btn.y);
        }

        public addToSpatialDb() {
            this.rules.forEach(rule => rule.addToSpatialDb());
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
            super(editor, "rule_editor");
            this.whenLbl = new Kelpie(editor, icons.get("when"));
            this.doLbl = new Kelpie(editor, icons.get("do"));
            this.handleBtn = new EditorButton(editor, {
                icon: ruledef.condition,
                x: 0, y: 0
            });
            this.whenInsertBtn = new EditorButton(editor, {
                style: "beige",
                icon: "insertion_point",
                x: 0, y: 0
            });
            this.doInsertBtn = new EditorButton(editor, {
                style: "beige",
                icon: "insertion_point",
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
            this.editor.changed();
        }

        public addToSpatialDb() {
            if (this.sensor) { this.editor.addToSpatialDb(this.sensor); }
            if (this.actuator) { this.editor.addToSpatialDb(this.actuator); }
            this.filters.forEach(filter => this.editor.addToSpatialDb(filter));
            this.modifiers.forEach(modifier => this.editor.addToSpatialDb(modifier));
            this.editor.addToSpatialDb(this.handleBtn);
            this.editor.addToSpatialDb(this.whenInsertBtn);
            this.editor.addToSpatialDb(this.doInsertBtn);
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
            v.x += 2 + (this.whenLbl.width >> 1) + (this.whenInsertBtn.width >> 1);
            if (this.sensor) {
                this.sensor.pos = v;
                v.x += this.sensor.width;
            }
            this.filters.forEach(filter => {
                filter.pos = v;
                v.x += filter.width;
            });
            this.whenInsertBtn.pos = v;
            v.x += 4 + (this.whenInsertBtn.width >> 1) + (this.doLbl.width >> 1);
            this.doLbl.pos = v;
            v.x += 2 + (this.doLbl.width >> 1) + (this.doInsertBtn.width >> 1);
            if (this.actuator) {
                this.actuator.pos = v;
                v.x += this.actuator.width;
            }
            this.modifiers.forEach(modifier => {
                modifier.pos = v;
                v.x += modifier.width;
            });
            this.doInsertBtn.pos = v;



        }
    }
}