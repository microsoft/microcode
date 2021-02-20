namespace kojac {

    class EditorButton extends Button {
        constructor(
            private editor: Editor,
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
            this.app.save(SAVESLOT_AUTO, this.progdef);
            this.app.stageManager.pop();
        }

        private cancelClicked() {
            this.app.stageManager.pop();
        }

        private nextPage() {
            let index = this.currPage + 1;
            index %= this.progdef.pages.length;
            this.switchToPage(index);
        }

        private prevPage() {
            let index = this.currPage - 1;
            if (index < 0) {
                index = this.progdef.pages.length - 1;
            }
            this.switchToPage(index);
        }

        private pickPage() {
            const picker = new Picker(this, {
                cursor: this.cursor,
                onClick: (iconId) => {
                    const index = PAGE_IDS.indexOf(iconId);
                    this.switchToPage(index);
                },
                title: "Select",
                backgroundImage: scene.backgroundImage()
            });
            // TODO: supply button labels
            const btns: PickerButtonDef[] = PAGE_IDS.map(pageId => {
                return {
                    icon: pageId
                }
            });
            picker.addGroup({ label: "", btns });
            picker.show();
        }

        private switchToPage(index: number) {
            if (index < 0 || index >= this.progdef.pages.length) { return; }
            if (this.pageEditor) {
                this.pageEditor.destroy();
            }
            this.currPage = index;
            this.pageBtn.setIcon(PAGE_IDS[this.currPage]);
            this.pageEditor = new PageEditor(this, this.progdef.pages[this.currPage]);
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
            controller.B.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.cancel());
            this.cursor = new Cursor(this);
            this.currPage = 0;
            this.pageBtn = new EditorButton(this, {
                style: "white",
                icon: PAGE_IDS[this.currPage],
                hud: true,
                x: scene.screenWidth() >> 1,
                y: 8,
                onClick: () => this.pickPage()
            });
            this.nextPageBtn = new EditorButton(this, {
                style: "white",
                icon: "next_page",
                hud: true,
                x: (scene.screenWidth() >> 1) + 16,
                y: 8,
                onClick: () => this.nextPage()
            });
            this.prevPageBtn = new EditorButton(this, {
                style: "white",
                icon: "prev_page",
                hud: true,
                x: (scene.screenWidth() >> 1) - 16,
                y: 8,
                onClick: () => this.prevPage()
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
            this.progdef = this.app.load(SAVESLOT_AUTO);
        }

        shutdown() {
            this.progdef = undefined;
            this.quadtree.clear();
            super.shutdown();
        }

        activate() {
            super.activate();
            //scene.setBackgroundColor(11);
            scene.setBackgroundImage(icondb.gradient_0);
            this.pageBtn.setIcon(PAGE_IDS[this.currPage]);
            if (!this.pageEditor) {
                this.switchToPage(this.currPage);
                this.pageEditor.initCursor();
            }
        }

        update(dt: number) {
            super.update(dt);
            if (this._changed) {
                this._changed = false;
                this.rebuildQuadTree();
            }
        }

        private rebuildQuadTree() {
            if (this.quadtree) {
                this.quadtree.clear();
            }
            this.quadtree = new QuadTree(new Bounds({
                left: 0,
                top: 0,
                width: 4096,
                height: 4096
            }), 1, 16);
            this.addToQuadTree(this.pageBtn);
            this.addToQuadTree(this.prevPageBtn);
            this.addToQuadTree(this.nextPageBtn);
            this.addToQuadTree(this.okBtn);
            this.addToQuadTree(this.cancelBtn);
            this.pageEditor.addToQuadTree();
            // Assign quadtree to cursor.
            this.cursor.quadtree = this.quadtree;
        }

        public addToQuadTree(btn: Button) {
            if (this.quadtree) {
                this.quadtree.insert(Bounds.Translate(btn.hitbox, btn.pos), btn);
            }
        }

        draw(camera: scene.Camera) {
            super.draw(camera);
            //this.quadtree.draw(new Vec2(camera.drawOffsetX, camera.drawOffsetY), 5);
        }
    }

    class PageEditor extends Component {
        rules: RuleEditor[];

        public get z() { return 0; }

        constructor(private editor: Editor, private pagedef: PageDefn) {
            super(editor, "page_editor");
            this.rules = pagedef.rules.map(ruledef => new RuleEditor(editor, this, ruledef));
            this.ensureFinalEmptyRule();
            this.layout();
        }

        destroy() {
            this.rules.forEach(rule => rule.destroy());
            this.rules = undefined;
            super.destroy();
        }

        private ensureFinalEmptyRule() {
            if (this.rules) {
                this.trimRules();
                const ruledefn = new RuleDefn();
                this.rules.push(new RuleEditor(this.editor, this, ruledefn));
                this.pagedef.rules.push(ruledefn);
            }
        }

        private trimRules() {
            if (!this.rules.length) { return; }
            let last = this.rules[this.rules.length - 1];
            while (last.isEmpty()) {
                last.destroy();
                this.rules.pop();
                this.pagedef.rules.pop();
                if (!this.rules.length) { return; }
                last = this.rules[this.rules.length - 1];
            }
        }

        public layout() {
            if (this.rules) {
                let left = 10;
                let top = 36;
                this.rules.forEach(rule => {
                    rule.layout(left, top);
                    top += 22;
                });
            }
        }

        public initCursor() {
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

        public addToQuadTree() {
            this.rules.forEach(rule => rule.addToQuadTree());
        }

        public changed() {
            this.ensureFinalEmptyRule();
            this.layout();
            this.editor.changed();
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

        public get z() { return 0; }

        constructor(private editor: Editor, private page: PageEditor, private ruledef: RuleDefn) {
            super(editor, "rule_editor");
            this.whenLbl = new Kelpie(editor, icons.get("when"));
            this.doLbl = new Kelpie(editor, icons.get("do"));
            this.handleBtn = new EditorButton(editor, {
                icon: ruledef.condition,
                x: 0, y: 0,
                onClick: () => this.showRuleHandleMenu()
            });
            this.whenInsertBtn = new EditorButton(editor, {
                style: "beige",
                icon: "insertion_point",
                x: 0, y: 0,
                onClick: () => this.showWhenInsertMenu()
            });
            this.doInsertBtn = new EditorButton(editor, {
                style: "beige",
                icon: "insertion_point",
                x: 0, y: 0,
                onClick: () => this.showDoInsertMenu()
            });
            this.instantiateProgramTiles();
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
            if (this.sensor) {
                this.sensor.destroy();
                this.sensor = undefined;
                this.editor.changed();
            }
            if (this.actuator) {
                this.actuator.destroy();
                this.actuator = undefined;
                this.editor.changed();
            }
            if (this.filters) {
                this.filters.forEach(filter => filter.destroy());
                this.filters = undefined;
                this.editor.changed();
            }
            if (this.modifiers) {
                this.modifiers.forEach(modifier => modifier.destroy());
                this.modifiers = undefined;
                this.editor.changed();
            }
        }

        private instantiateProgramTiles() {
            this.destroyProgramTiles();
            this.filters = [];
            this.modifiers = [];
            if (this.ruledef.sensor) {
                this.sensor = new EditorButton(this.editor, {
                    style: "white",
                    icon: this.ruledef.sensor.tid,
                    x: 0, y: 0
                });
                this.page.changed();
            }
        }

        private showRuleHandleMenu() {
            const picker = new Picker(this.stage, {
                cursor: this.editor.cursor,
                onClick: (iconId) => this.handleRuleHandleMenuSelection(iconId),
                title: "Select",
                backgroundImage: scene.backgroundImage()
                
            });
            // Add rule conditions
            const iconIds = [].concat(RC_IDS);
            // "Insert rule above this one"
            iconIds.push("plus");
            // "Delete rule"
            iconIds.push("delete");
            // TODO: supply button labels
            const btns: PickerButtonDef[] = iconIds.map(iconId => {
                return {
                    icon: iconId
                }
            });
            picker.addGroup({ label: "", btns });
            picker.show();
        }

        private handleRuleHandleMenuSelection(iconId: string) {
            if (RC_IDS.indexOf(iconId) >= 0) {
                this.setRuleCondition(iconId);
            } else if (iconId === "plus") {
                // TODO
            } else if (iconId === "delete") {
                // TODO
            }
        }

        private setRuleCondition(rc: string) {
            this.handleBtn.setIcon(rc);
            this.ruledef.condition = rc;
            this.page.changed();
        }

        private showWhenInsertMenu() {
            if (this.sensor) {
                const index = this.ruledef.filters.length;
                const suggestions = Language.getFilterSuggestions(this.ruledef, index);
                const btns: PickerButtonDef[] = suggestions.map(elem => {
                    return {
                        icon: elem.tid,
                        label: elem.name
                    };
                });
                const picker = new Picker(this.stage, {
                    title: "Select",
                    cursor: this.editor.cursor,
                    onClick: (iconId) => {

                    }
                });
                picker.addGroup({ label: "", btns });

/*
                this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                    this.defn.filters.push(tiles.filters[selection.id]);
                    Language.ensureValid(this.ruledef);
                    this.instantiateTiles(this.ruledef);
                    this.pageui.ensureFinalEmptyRule();
                });
                */
                picker.show();
            } else {
                const suggestions = Language.getSensorSuggestions(this.ruledef);
                const btns: PickerButtonDef[] = suggestions.map(elem => {
                    return {
                        icon: elem.tid,
                        label: elem.name
                    };
                });
                const picker = new Picker(this.stage, {
                    title: "Select",
                    cursor: this.editor.cursor,
                    onClick: (iconId) => {
                        this.ruledef.sensor = tiles.sensors[iconId];
                        Language.ensureValid(this.ruledef);
                        this.instantiateProgramTiles();
                    }
                });
                picker.addGroup({ label: "", btns });
                /*
                this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                    this.defn.sensor = tiles.sensors[selection.id];
                    Language.ensureValid(this.ruledef);
                    this.instantiateTiles(this.ruledef);
                    this.pageui.ensureFinalEmptyRule();
                });
                */
                picker.show();
            }
        }

        private showDoInsertMenu() {
            
        }

        public addToQuadTree() {
            if (this.sensor) { this.editor.addToQuadTree(this.sensor); }
            if (this.actuator) { this.editor.addToQuadTree(this.actuator); }
            this.filters.forEach(filter => this.editor.addToQuadTree(filter));
            this.modifiers.forEach(modifier => this.editor.addToQuadTree(modifier));
            this.editor.addToQuadTree(this.handleBtn);
            this.editor.addToQuadTree(this.whenInsertBtn);
            this.editor.addToQuadTree(this.doInsertBtn);
        }

        public isEmpty() {
            return (
                this.ruledef.condition === RuleCondition.DEFAULT &&
                !this.ruledef.sensor &&
                !this.ruledef.actuator &&
                this.ruledef.filters.length === 0 &&
                this.ruledef.modifiers.length === 0);
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