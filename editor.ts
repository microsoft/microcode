namespace kojac {

    class EditorButton extends Button {
        constructor(
            private editor: Editor,
            opts: {
                parent?: IPlaceable,
                style?: ButtonStyle,
                icon: string,
                label?: string,
                x: number,
                y: number,
                onClick?: (button: Button) => void
            }
        ) {
            super(opts);
            editor.changed();
        }

        destroy() {
            this.editor.changed();
            super.destroy();
        }
    }

    const TOOLBAR_HEIGHT = 17;
    const TOOLBAR_COLOR = 11;

    export class Editor extends Scene {
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
        private hudroot: Placeable;
        private scrollroot: Placeable;
        private scrollanim: Animation;
        public picker: Picker;

        constructor(app: App) {
            super(app, "editor");
        }

        public changed() { this._changed = true; }

        private okClicked() {
            this.app.save(SAVESLOT_AUTO, this.progdef);
            while (controller.A.isPressed()) { pause(10); }
            this.app.popScene();
            this.app.pushScene(new Home(this.app));
        }

        private cancelClicked() {
            while (controller.A.isPressed()) { pause(10); }
            this.app.popScene();
            this.app.pushScene(new Home(this.app));
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
            // TODO: supply button labels
            const btns: PickerButtonDef[] = PAGE_IDS.map(pageId => {
                return {
                    icon: pageId
                }
            });
            this.picker.addGroup({ label: "", btns });
            this.picker.show({
                onClick: (iconId) => {
                    const index = PAGE_IDS.indexOf(iconId);
                    this.switchToPage(index);
                },
                title: "Select",
            });
        }

        private switchToPage(index: number) {
            if (index < 0 || index >= this.progdef.pages.length) { return; }
            if (this.pageEditor) {
                this.pageEditor.destroy();
            }
            this.currPage = index;
            this.pageBtn.setIcon(PAGE_IDS[this.currPage]);
            this.pageEditor = new PageEditor(this, this.scrollroot, this.progdef.pages[this.currPage]);
            this.scrollroot.xfrm.localPos = new Vec2(Screen.LEFT_EDGE, Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2);
        }

        private moveTo(target: Button) {
            if (target.rootXfrm.tag === "hud") {
                this.cursor.moveTo(target.xfrm.worldPos);
                return;
            }
            const occ = target.occlusions(new Bounds({
                left: Screen.LEFT_EDGE,
                top: Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2,
                width: Screen.WIDTH,
                height: Screen.HEIGHT - (TOOLBAR_HEIGHT + 2)
            }));
            if (occ.has) {
                if (this.scrollanim.playing) { return; }
                const xocc = occ.left ? occ.left : -occ.right;
                const yocc = occ.top ? occ.top : -occ.bottom;
                const endValue = Vec2.TranslateToRef(
                    this.scrollroot.xfrm.localPos,
                    new Vec2(xocc, yocc),
                    new Vec2());
                this.scrollanim.clearFrames();
                this.scrollanim.addFrame(new EaseFrame({
                    duration: 0.05,
                    //curve: curves.easeOut(curves.easing.sq2),
                    curve: curves.linear(),
                    startValue: this.scrollroot.xfrm.localPos,
                    endValue
                }));
                this.scrollanim.start();
                const dest = new Vec2(target.xfrm.worldPos.x + xocc, target.xfrm.worldPos.y + yocc);
                this.cursor.moveTo(dest);
            } else {
                this.cursor.moveTo(target.xfrm.worldPos);
            }
        }

        private moveUp() {
            const target = this.cursor.queryUp();
            if (target) { this.moveTo(target); }
        }

        private moveDown() {
            const target = this.cursor.queryDown();
            if (target) { this.moveTo(target); }
        }

        private moveLeft() {
            const target = this.cursor.queryLeft();
            if (target) { this.moveTo(target); }
        }

        private moveRight() {
            const target = this.cursor.queryRight();
            if (target) { this.moveTo(target); }
        }

        private cancel() {
            if (!this.cursor.cancel()) {
                this.cursor.moveTo(this.pageBtn.xfrm.worldPos);
            }
        }

        /* override */ startup() {
            super.startup();
            control.onEvent(ControllerButtonEvent.Pressed, controller.right.id, () => this.moveRight());
            control.onEvent(ControllerButtonEvent.Pressed, controller.up.id, () => this.moveUp());
            control.onEvent(ControllerButtonEvent.Pressed, controller.down.id, () => this.moveDown());
            control.onEvent(ControllerButtonEvent.Pressed, controller.left.id, () => this.moveLeft());
            
            control.onEvent(ControllerButtonEvent.Repeated, controller.right.id, () => this.moveRight());
            control.onEvent(ControllerButtonEvent.Repeated, controller.up.id, () => this.moveUp());
            control.onEvent(ControllerButtonEvent.Repeated, controller.down.id, () => this.moveDown());
            control.onEvent(ControllerButtonEvent.Repeated, controller.left.id, () => this.moveLeft());
            
            control.onEvent(ControllerButtonEvent.Pressed, controller.A.id, () => this.cursor.click());
            control.onEvent(ControllerButtonEvent.Pressed, controller.B.id, () => this.cancel());
            this.hudroot = new Placeable();
            this.hudroot.xfrm.localPos = new Vec2(0, Screen.TOP_EDGE);
            this.hudroot.xfrm.tag = "hud";
            this.scrollroot = new Placeable();
            this.scrollroot.xfrm.localPos = new Vec2(Screen.LEFT_EDGE, Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2);
            this.scrollanim = new Animation((v: Vec2) => this.scrollAnimCallback(v), {
                done: () => this.scrollAnimComplete()
            });
            this.cursor = new Cursor();
            this.picker = new Picker(this.cursor);
            this.currPage = 0;
            this.pageBtn = new EditorButton(this,
                {
                    parent: this.hudroot,
                    style: "white",
                    icon: PAGE_IDS[this.currPage],
                    x: 0,
                    y: 8,
                    onClick: () => this.pickPage()
                });
            this.nextPageBtn = new EditorButton(this,
                {
                    parent: this.hudroot,
                    style: "white",
                    icon: "next_page",
                    x: 16,
                    y: 8,
                    onClick: () => this.nextPage()
                });
            this.prevPageBtn = new EditorButton(this,
                {
                    parent: this.hudroot,
                    style: "white",
                    icon: "prev_page",
                    x: -16,
                    y: 8,
                    onClick: () => this.prevPage()
                });
            this.okBtn = new EditorButton(this,
                {
                    parent: this.hudroot,
                    style: "white",
                    icon: "ok",
                    x: Screen.RIGHT_EDGE - 8,
                    y: 8,
                    onClick: () => this.okClicked()
                });
            this.cancelBtn = new EditorButton(this,
                {
                    parent: this.hudroot,
                    style: "white",
                    icon: "cancel",
                    x: Screen.RIGHT_EDGE - 24,
                    y: 8,
                    onClick: () => this.cancelClicked()
                });
            this.progdef = this.app.load(SAVESLOT_AUTO);
        }

        /* override */ shutdown() {
            this.progdef = undefined;
            this.quadtree.clear();
            this.quadtree = undefined;
        }

        /* override */ activate() {
            this.pageBtn.setIcon(PAGE_IDS[this.currPage]);
            if (!this.pageEditor) {
                this.switchToPage(this.currPage);
                this.pageEditor.initCursor();
            }
        }

        private rebuildQuadTree() {
            if (this.quadtree) {
                this.quadtree.clear();
            }
            this.quadtree = new QuadTree(new Bounds({
                left: -512,
                top: -512,
                width: 1024,
                height: 1024
            }), 1, 16);
            this.addToQuadTree(this.pageBtn);
            this.addToQuadTree(this.prevPageBtn);
            this.addToQuadTree(this.nextPageBtn);
            this.addToQuadTree(this.okBtn);
            this.addToQuadTree(this.cancelBtn);
            this.pageEditor.addToQuadTree();

            this.cursor.quadtree = this.quadtree;
        }

        public addToQuadTree(btn: Button) {
            if (this.quadtree) {
                this.quadtree.insert(btn.hitbox, btn);
            }
        }

        private scrollAnimCallback(v: Vec2) {
            this.scrollroot.xfrm.localPos = v;
        }

        private scrollAnimComplete() {
            this.changed();
        }

        /* override */ update() {
            if (this.pageEditor) {
                this.pageEditor.update();
            }
            if (this._changed) {
                this._changed = false;
                this.rebuildQuadTree();
            }
            this.scrollanim.update();
            this.cursor.update();
        }

        /* override */ draw() {
            if (this.pageEditor) {
                this.pageEditor.draw();
            }
            Screen.fillRect(Screen.LEFT_EDGE, Screen.TOP_EDGE, Screen.WIDTH, TOOLBAR_HEIGHT, TOOLBAR_COLOR)
            this.pageBtn.draw();
            this.prevPageBtn.draw();
            this.nextPageBtn.draw();
            this.okBtn.draw();
            this.cancelBtn.draw();
            this.picker.draw();
            this.cursor.draw();

            //this.quadtree.dbgDraw(5);
        }
    }

    class PageEditor extends Component implements IPlaceable {
        private xfrm_: Affine;
        rules: RuleEditor[];

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() { return this.xfrm_; }

        constructor(private editor: Editor, parent: IPlaceable, private pagedef: PageDefn) {
            super("page_editor");
            this.xfrm_ = new Affine();
            this.xfrm_.parent = parent.xfrm;
            this.rules = pagedef.rules.map((ruledef, index) => new RuleEditor(editor, this, ruledef, index));
            this.ensureFinalEmptyRule();
            this.layout();
        }

        /* override */ destroy() {
            this.rules.forEach(rule => rule.destroy());
            this.rules = undefined;
            super.destroy();
        }

        private ensureFinalEmptyRule() {
            if (this.rules) {
                this.trimRules();
                const ruledefn = new RuleDefn();
                this.rules.push(new RuleEditor(this.editor, this, ruledefn, this.rules.length));
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

        private layout() {
            if (this.rules) {
                let left = 10;
                let top = 10;
                this.rules.forEach(rule => {
                    rule.layout();
                    rule.xfrm.localPos.x = left;
                    rule.xfrm.localPos.y = top;
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
            this.editor.cursor.snapTo(btn.xfrm.worldPos.x, btn.xfrm.worldPos.y);
        }

        public addToQuadTree() {
            this.rules.forEach(rule => rule.addToQuadTree());
        }

        public changed() {
            this.ensureFinalEmptyRule();
            this.layout();
            this.editor.changed();
        }

        public deleteRuleAt(index: number) {
            const rule = this.rules[index];
            this.pagedef.deleteRuleAt(index);
            this.rules.splice(index, 1);
            rule.destroy();
            this.rules.forEach((rule, index) => rule.index = index);
            this.changed();
        }

        public insertRuleAt(index: number) {
            this.pagedef.insertRuleAt(index);
            const rules: RuleEditor[] = [];
            for (let i = 0; i < index; ++i) {
                rules.push(this.rules[i]);
            }
            rules.push(new RuleEditor(this.editor, this, new RuleDefn(), index));
            for (let i = index; i < this.rules.length; ++i) {
                rules.push(this.rules[i]);
            }
            this.rules = rules;
            this.rules.forEach((rule, index) => rule.index = index);
            this.changed();
        }

        /* override */ update() {
            this.rules.forEach(rule => rule.update());
        }

        /* override */ draw() {
            this.rules.forEach(rule => rule.draw());
        }
    }

    class RuleEditor extends Component implements IPlaceable {
        private xfrm_: Affine;
        whenLbl: Sprite;
        doLbl: Sprite;
        handleBtn: Button;
        whenInsertBtn: Button;
        doInsertBtn: Button;
        sensor: Button;
        filters: Button[];
        actuator: Button;
        modifiers: Button[];

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() { return this.xfrm_; }

        constructor(private editor: Editor, private page: PageEditor, private ruledef: RuleDefn, public index: number) {
            super("rule_editor");
            this.xfrm_ = new Affine();
            this.xfrm_.parent = page.xfrm;
            this.whenLbl = new Sprite({
                parent: this,
                img: icons.get("when")
            });
            this.doLbl = new Sprite({
                parent: this,
                img: icons.get("do")
            });
            this.handleBtn = new EditorButton(editor,
                {
                    parent: this,
                    icon: ruledef.condition,
                    x: 0, y: 0,
                    onClick: () => this.showRuleHandleMenu()
                });
            this.whenInsertBtn = new EditorButton(editor,
                {
                    parent: this,
                    style: "beige",
                    icon: "insertion_point",
                    x: 0, y: 0,
                    onClick: () => this.showWhenInsertMenu()
                });
            this.doInsertBtn = new EditorButton(editor,
                {
                    parent: this,
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
                this.filters = [];
                this.editor.changed();
            }
            if (this.modifiers) {
                this.modifiers.forEach(modifier => modifier.destroy());
                this.modifiers = [];
                this.editor.changed();
            }
        }

        private instantiateProgramTiles() {
            this.destroyProgramTiles();
            this.filters = [];
            this.modifiers = [];
            if (this.ruledef.sensor) {
                this.sensor = new EditorButton(this.editor,
                    {
                        parent: this,
                        style: "white",
                        icon: this.ruledef.sensor.tid,
                        x: 0, y: 0,
                        onClick: () => this.handleSensorClicked()
                    });
                this.page.changed();
            }
            if (this.ruledef.actuator) {
                this.actuator = new EditorButton(this.editor,
                    {
                        parent: this,
                        style: "white",
                        icon: this.ruledef.actuator.tid,
                        x: 0, y: 0,
                        onClick: () => this.handleActuatorClicked()
                    });
                this.page.changed();
            }
            this.ruledef.filters.forEach((defn, index) => {
                const filter = new EditorButton(this.editor,
                    {
                        parent: this,
                        style: "white",
                        icon: defn.tid,
                        x: 0, y: 0,
                        onClick: () => this.handleFilterClicked(index)
                    });
                this.filters.push(filter);
                this.page.changed();
            });
            this.ruledef.modifiers.forEach((defn, index) => {
                const modifier = new EditorButton(this.editor,
                    {
                        parent: this,
                        style: "white",
                        icon: defn.tid,
                        x: 0, y: 0,
                        onClick: () => this.handleModifierClicked(index)
                    });
                this.modifiers.push(modifier);
                this.page.changed();
            });
        }

        private handleSensorClicked() {
            this.pickSensor();
        }

        private handleActuatorClicked() {
            this.pickActuator();
        }

        private handleFilterClicked(index: number) {
            this.pickFilter(index);
        }

        private handleModifierClicked(index: number) {
            this.pickModifier(index);
        }

        private showRuleHandleMenu() {
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
            this.editor.picker.addGroup({ label: "", btns });
            this.editor.picker.show({
                onClick: (iconId) => this.handleRuleHandleMenuSelection(iconId),
                title: "Select",
            });
        }

        private handleRuleHandleMenuSelection(iconId: string) {
            if (RC_IDS.indexOf(iconId) >= 0) {
                this.setRuleCondition(iconId);
            } else if (iconId === "plus") {
                this.page.insertRuleAt(this.index);
            } else if (iconId === "delete") {
                this.page.deleteRuleAt(this.index);
            }
        }

        private setRuleCondition(rc: string) {
            this.handleBtn.setIcon(rc);
            this.ruledef.condition = rc;
            this.page.changed();
        }

        private pickSensor() {
            const suggestions = Language.getSensorSuggestions(this.ruledef);
            const btns: PickerButtonDef[] = suggestions.map(elem => {
                return {
                    icon: elem.tid,
                    label: elem.name
                };
            });
            if (this.ruledef.sensor) {
                btns.push({
                    icon: "delete"
                });
            }
            if (btns.length) {
                this.editor.picker.addGroup({ label: "", btns });
                this.editor.picker.show({
                    title: "Select",
                    onClick: (iconId) => {
                        if (iconId === "delete") {
                            this.ruledef.sensor = undefined;
                        } else {
                            this.ruledef.sensor = tiles.sensors[iconId];
                        }
                        Language.ensureValid(this.ruledef);
                        this.instantiateProgramTiles();
                        this.page.changed();
                    }
                });
            }
        }

        private pickActuator() {
            const suggestions = Language.getActuatorSuggestions(this.ruledef);
            const btns: PickerButtonDef[] = suggestions.map(elem => {
                return {
                    icon: elem.tid,
                    label: elem.name
                };
            });
            if (this.ruledef.actuator) {
                btns.push({
                    icon: "delete"
                });
            }
            if (btns.length) {
                this.editor.picker.addGroup({ label: "", btns });
                this.editor.picker.show({
                    title: "Select",
                    onClick: (iconId) => {
                        if (iconId === "delete") {
                            this.ruledef.actuator = undefined;
                        } else {
                            this.ruledef.actuator = tiles.actuators[iconId];
                        }
                        Language.ensureValid(this.ruledef);
                        this.instantiateProgramTiles();
                        this.page.changed();
                    }
                });
            }
        }

        private pickFilter(index: number) {
            const suggestions = Language.getFilterSuggestions(this.ruledef, index);
            const btns: PickerButtonDef[] = suggestions.map(elem => {
                return {
                    icon: elem.tid,
                    label: elem.name
                };
            });
            if (index < this.ruledef.filters.length) {
                btns.push({
                    icon: "delete"
                });
            }
            if (btns.length) {
                this.editor.picker.addGroup({ label: "", btns });
                this.editor.picker.show({
                    title: "Select",
                    onClick: (iconId) => {
                        if (iconId === "delete") {
                            this.ruledef.filters.splice(index, 1);
                        } else {
                            if (index >= this.ruledef.filters.length) {
                                this.ruledef.filters.push(tiles.filters[iconId]);
                            } else {
                                this.ruledef.filters[index] = tiles.filters[iconId];
                            }
                        }
                        Language.ensureValid(this.ruledef);
                        this.instantiateProgramTiles();
                        this.page.changed();
                    }
                });
            }
        }

        private pickModifier(index: number) {
            const suggestions = Language.getModifierSuggestions(this.ruledef, index);
            const btns: PickerButtonDef[] = suggestions.map(elem => {
                return {
                    icon: elem.tid,
                    label: elem.name
                };
            });
            if (index < this.ruledef.modifiers.length) {
                btns.push({
                    icon: "delete"
                });
            }
            if (btns.length) {
                this.editor.picker.addGroup({ label: "", btns });
                this.editor.picker.show({
                    title: "Select",
                    onClick: (iconId) => {
                        if (iconId === "delete") {
                            this.ruledef.modifiers.splice(index, 1);
                        } else {
                            if (index >= this.ruledef.modifiers.length) {
                                this.ruledef.modifiers.push(tiles.modifiers[iconId]);
                            } else {
                                this.ruledef.modifiers[index] = tiles.modifiers[iconId];
                            }
                        }
                        Language.ensureValid(this.ruledef);
                        this.instantiateProgramTiles();
                        this.page.changed();
                    }
                });
            }
        }

        private showWhenInsertMenu() {
            if (this.sensor) {
                const index = this.ruledef.filters.length;
                this.pickFilter(index);
            } else {
                this.pickSensor();
            }
        }

        private showDoInsertMenu() {
            if (this.actuator) {
                const index = this.ruledef.modifiers.length;
                this.pickModifier(index);
            } else {
                this.pickActuator();
            }            
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

        public layout() {
            const v = new Vec2();
            this.handleBtn.xfrm.localPos = v;
            v.x += (this.handleBtn.width >> 1) + (this.whenLbl.width >> 1);
            this.whenLbl.xfrm.localPos = v;
            v.x += 2 + (this.whenLbl.width >> 1) + (this.whenInsertBtn.width >> 1);
            if (this.sensor) {
                this.sensor.xfrm.localPos = v;
                v.x += this.sensor.width;
            }
            this.filters.forEach(filter => {
                filter.xfrm.localPos = v;
                v.x += filter.width;
            });
            this.whenInsertBtn.xfrm.localPos = v;
            v.x += 2 + (this.whenInsertBtn.width >> 1) + (this.doLbl.width >> 1);
            this.doLbl.xfrm.localPos = v;
            v.x += 2 + (this.doLbl.width >> 1) + (this.doInsertBtn.width >> 1);
            if (this.actuator) {
                this.actuator.xfrm.localPos = v;
                v.x += this.actuator.width;
            }
            this.modifiers.forEach(modifier => {
                modifier.xfrm.localPos = v;
                v.x += modifier.width;
            });
            this.doInsertBtn.xfrm.localPos = v;
        }

        /* override */ draw() {
            this.whenLbl.draw();
            this.doLbl.draw();
            this.handleBtn.draw();
            this.whenInsertBtn.draw();
            this.doInsertBtn.draw();
            if (this.sensor) { this.sensor.draw(); }
            if (this.actuator) { this.actuator.draw(); }
            this.filters.forEach(filter => filter.draw());
            this.modifiers.forEach(modifier => modifier.draw());
        }
    }
}