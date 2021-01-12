namespace kojac {

    class BrainUI extends Component {
        pages: PageUI[];

        constructor(public kstage: KodeStage, brain: BrainDefn, public left: number, public top: number) {
            super(kstage, "brainui");
            this.pages = brain.pages.map((elem, index) => new PageUI(kstage, this, elem, index));
        }

        public layout() {
            let top = this.top;
            for (const page of this.pages) {
                page.layout(this.left, top);
                top += page.height;
            }
        }

        public destroy() {
            this.pages = null;
        }

        public toDefn(): BrainDefn {
            const brain = new BrainDefn();
            brain.pages = this.pages.map(page => page.toDefn());
            return brain;
        }
    }

    class PageUI extends Component {
        rules: RuleUI[];
        pageBtn: Button;

        height = 0;
        left = 0;
        top = 0;

        constructor(public kstage: KodeStage, brainui: BrainUI, public defn: PageDefn, index: number) {
            super(kstage, "pageui");
            this.rules = defn.rules.map((elem, index) => new RuleUI(kstage, this, elem, index));
            this.ensureFinalEmptyRule();
            this.pageBtn = new Button(
                kstage,
                "clear",
                tid.modifier[`page_${index + 1}`],
                null,
                0, 0, false);
            this.pageBtn.z = 800;
        }

        public layout(left: number, top: number) {
            this.left = left;
            this.top = top;
            this.pageBtn.moveTo(left, top);
            top += this.pageBtn.height + 2;

            for (const rule of this.rules) {
                rule.layout(left, top);
                top += rule.height;
            }
            this.height = (top - this.top) + 2;
        }

        public destroy() {
            this.rules = undefined;
            this.pageBtn = undefined;
        }

        public trim() {
            //while (this.rules.length && this.rules[this.rules.length - 1].isEmpty()) {
            //    const rule = this.rules.pop();
            //    rule.destroy();
           // }
        }

        public ensureFinalEmptyRule() {
            this.trim();
            if (!this.rules.length || !this.rules[this.rules.length - 1].isEmpty()) {
                this.rules.push(new RuleUI(this.kstage, this, new RuleDefn(), this.rules.length));
            }
        }

        public deleteRuleAt(index: number) {
            if (index >= 0 && index < this.rules.length) {
                this.defn.deleteRuleAt(index);
                const rule = this.rules[index];
                this.rules.splice(index, 1);
                rule.destroy();
            }
            // Renumber the rules
            for (let i = 0; i < this.rules.length; ++i) {
                this.rules[i].index = i;
            }
            this.ensureFinalEmptyRule();
        }

        public insertRuleAt(index: number) {
            if (index >= 0 && index < this.rules.length) {
                this.defn.insertRuleAt(index);
                // STS Array.splice doesn't support insert :(
                //this.rules.splice(index, 0, new RuleUI(this.kstage, this, new RuleDefn(), index));
                const rules: RuleUI[] = [];
                for (let i = 0; i < index; ++i) {
                    rules.push(this.rules[i]);
                }
                rules.push(new RuleUI(this.kstage, this, new RuleDefn(), index));
                for (let i = index; i < this.rules.length; ++i) {
                    rules.push(this.rules[i]);
                }
                this.rules = rules;
            }
            // Renumber the rules
            for (let i = 0; i < this.rules.length; ++i) {
                this.rules[i].index = i;
            }
            this.ensureFinalEmptyRule();
        }

        public toDefn(): PageDefn {
            const page = new PageDefn();
            page.rules = this.rules.map(rule => rule.toDefn());
            return page;
        }
    }

    class RuleUI extends Component {
        sensor: Button;
        filters: Button[];
        actuator: Button;
        modifiers: Button[];
        handleBtn: Button;
        whenBtn: Button;
        doBtn: Button;
        whenInsertBtn: Button;
        doInsertBtn: Button;

        top = 0;
        left = 0;
        height = 0;

        constructor(public kstage: KodeStage, public pageui: PageUI, public defn: RuleDefn, public index: number) {
            super(kstage, "ruleui");
            this.filters = [];
            this.modifiers = [];
            this.handleBtn = new Button(
                kstage,
                null,
                defn.condition,
                null,
                0, 0, false,
                (button) => this.handleRuleHandleClick(button));
            this.handleBtn.z = 800;
            this.whenBtn = new Button(
                kstage,
                null,
                "when",
                null,
                0, 0, false);
            this.whenBtn.z = 800;
            this.whenInsertBtn = new Button(
                kstage,
                "beige",
                "insertion-point",
                null,
                0, 0, false,
                (button) => this.handleWhenInsertClick(button));
            this.whenInsertBtn.z = 800;
            this.doBtn = new Button(
                kstage,
                null,
                "do",
                null,
                0, 0, false);
            this.doBtn.z = 800;
            this.doInsertBtn = new Button(
                kstage,
                "beige",
                "insertion-point",
                null,
                0, 0, false,
                (button) => this.handleDoInsertClick(button));
            this.doInsertBtn.z = 800;

            this.instantiateTiles(defn);
        }

        public layout(left: number, top: number) {
            this.top = top;
            this.left = left;
            this.handleBtn.moveTo(left, top);
            left += (this.handleBtn.width >> 1) + (this.whenBtn.width >> 1);
            this.whenBtn.moveTo(left, top);
            left += (this.whenBtn.width >> 1) + (this.whenInsertBtn.width >> 1);
            if (this.sensor) {
                this.sensor.moveTo(left, top);
                left += (this.sensor.width);
            }
            this.filters.forEach(filter => {
                filter.moveTo(left, top);
                left += (filter.width);
            });
            this.whenInsertBtn.moveTo(left, top);
            left += 4 + (this.whenInsertBtn.width >> 1) + (this.doBtn.width >> 1);
            this.doBtn.moveTo(left, top);
            left += (this.doBtn.width >> 1) + (this.doInsertBtn.width >> 1);
            if (this.actuator) {
                this.actuator.moveTo(left, top);
                left += (this.actuator.width);
            }
            this.modifiers.forEach(modifier => {
                modifier.moveTo(left, top);
                left += (modifier.width);
            });
            this.doInsertBtn.moveTo(left, top);
            this.height = this.whenBtn.height + 2;
        }

        public destroy() {
            this.destroyTiles();
            this.handleBtn.destroy();
            this.whenBtn.destroy();
            this.whenInsertBtn.destroy();
            this.doBtn.destroy();
            this.doInsertBtn.destroy();
            this.handleBtn = undefined;
            this.whenBtn = undefined;
            this.whenInsertBtn = undefined;
            this.doBtn = undefined;
            this.doInsertBtn = undefined;
            super.destroy();
        }

        destroyTiles() {
            if (this.sensor) { this.sensor.destroy(); }
            if (this.actuator) { this.actuator.destroy(); }
            if (this.filters) { this.filters.forEach(elem => elem.destroy()); }
            if (this.modifiers) { this.modifiers.forEach(elem => elem.destroy()); }
            this.sensor = undefined;
            this.actuator = undefined;
            this.filters = undefined;
            this.modifiers = undefined;
        }

        public isEmpty(): boolean {
            return (
                !this.sensor &&
                !this.actuator &&
                this.filters.length === 0 &&
                this.modifiers.length === 0);
        }

        public toDefn(): RuleDefn {
            return this.defn.clone();
        }

        instantiateTiles(defn: RuleDefn) {
            this.destroyTiles();
            if (defn.sensor) {
                this.sensor = this.createSensorBtn(defn.sensor.tid);
            }
            this.filters = defn.filters.map((elem, index) => {
                return this.createFilterBtn(elem.tid, index);
            });
            if (defn.actuator) {
                this.actuator = this.createActuatorBtn(defn.actuator.tid);
            }
            this.modifiers = defn.modifiers.map((elem, index) => {
                return this.createModifierBtn(elem.tid, index);
            });
        }

        handleSensorClick(button: Button) {
            const suggestions = Language.getSensorSuggestions(this.defn);
            const items = suggestions.map(elem => {
                return <MenuItemDefn>{
                    icon: elem.tid,
                    label: elem.name
                };
            });
            items.push({
                icon: "delete",
                label: "Delete",
                style: "danger"
            });
            this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                if (selection.id !== this.sensor.id) {
                    if (selection.id === "delete") {
                        this.defn.sensor = null;
                    } else {
                        this.defn.sensor = tiles.sensors[selection.id];
                    }
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                }
            });
        }

        handleActuatorClick(button: Button) {
            const suggestions = Language.getActuatorSuggestions(this.defn);
            const items = suggestions.map(elem => {
                return <MenuItemDefn>{
                    icon: elem.tid,
                    label: elem.name
                };
            });
            items.push({
                icon: "delete",
                label: "Delete",
                style: "danger"
            });
            this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                if (selection.id !== this.actuator.id) {
                    if (selection.id === "delete") {
                        this.defn.actuator = null;
                    } else {
                        this.defn.actuator = tiles.actuators[selection.id];
                    }
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                }
            });
        }

        handleFilterClick(button: Button) {
            const index: number = button.data["index"];
            const suggestions = Language.getFilterSuggestions(this.defn, index);
            const items = suggestions.map(elem => {
                return <MenuItemDefn>{
                    icon: elem.tid,
                    label: elem.name
                };
            });
            items.push({
                icon: "delete",
                label: "Delete",
                style: "danger"
            });
            this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                if (this.defn.filters[index].tid !== selection.id) {
                    if (selection.id === "delete") {
                        this.defn.filters.splice(index, 1);
                    } else {
                        this.defn.filters[index] = tiles.filters[selection.id];
                    }
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                }
            });
        }

        handleModifierClick(button: Button) {
            const index: number = button.data["index"];
            const suggestions = Language.getModifierSuggestions(this.defn, index);
            const items = suggestions.map(elem => {
                return <MenuItemDefn>{
                    icon: elem.tid,
                    label: elem.name
                };
            });
            items.push({
                icon: "delete",
                label: "Delete",
                style: "danger"
            });
            this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                if (this.defn.modifiers[index].tid !== selection.id) {
                    if (selection.id === "delete") {
                        this.defn.modifiers.splice(index, 1);
                    } else {
                        this.defn.modifiers[index] = tiles.modifiers[selection.id];
                    }
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                }
            });
        }
 
        handleWhenInsertClick(button: Button) {
            if (this.sensor) {
                const index = this.defn.filters.length;
                const suggestions = Language.getFilterSuggestions(this.defn, index);
                const items = suggestions.map(elem => {
                    return {
                        icon: elem.tid,
                        label: elem.name
                    };
                });
                this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                    this.defn.filters.push(tiles.filters[selection.id]);
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                });
            } else {
                const suggestions = Language.getSensorSuggestions(this.defn);
                const items = suggestions.map(elem => {
                    return {
                        icon: elem.tid,
                        label: elem.name
                    };
                });
                this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                    this.defn.sensor = tiles.sensors[selection.id];
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                });
            }
        }

        handleDoInsertClick(button: Button) {
            if (this.actuator) {
                const index = this.defn.modifiers.length;
                const suggestions = Language.getModifierSuggestions(this.defn, index);
                const items = suggestions.map(elem => {
                    return {
                        icon: elem.tid,
                        label: elem.name
                    };
                });
                this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                    this.defn.modifiers.push(tiles.modifiers[selection.id]);
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                });
            } else {
                const suggestions = Language.getActuatorSuggestions(this.defn);
                const items = suggestions.map(elem => {
                    return <MenuItemDefn>{
                        icon: elem.tid,
                        label: elem.name
                    };
                });
                this.kstage.showMenu(button.x + 16, button.y, items, "down", (selection: Button) => {
                    this.defn.actuator = tiles.actuators[selection.id];
                    Language.ensureValid(this.defn);
                    this.instantiateTiles(this.defn);
                    this.pageui.ensureFinalEmptyRule();
                });
            }
        }

        handleRuleHandleClick(button: Button) {
            const items: MenuItemDefn[] = [
                {
                    icon: RuleCondition.HIGH,
                    label: "\"Is true\"",
                    style: "white"
                }, {
                    icon: RuleCondition.LOW,
                    label: "\"Is false\"",
                    style: "white"
                }, {
                    icon: RuleCondition.LOW_TO_HIGH,
                    label: "\"Becomes true\"",
                    style: "white"
                }, {
                    icon: RuleCondition.HIGH_TO_LOW,
                    label: "\"Becomes false\"",
                    style: "white"
                }, {
                    icon: "plus",
                    label: "Insert Rule",
                    style: "white"
                }, {
                    icon: "delete",
                    label: "Delete Rule",
                    style: "danger"
                }
            ];
            this.kstage.showMenu(button.x + 16, button.y, items, "right", (selection: Button) => {
                if (selection.id.indexOf("RC") === 0) {
                    this.defn.condition = selection.id;
                    this.handleBtn.setIcon(selection.id);
                } else if (selection.id === "delete") {
                    this.pageui.deleteRuleAt(this.index);
                } else if (selection.id === "plus") {
                    this.pageui.insertRuleAt(this.index);
                }
            });
        }

        createSensorBtn(id: string): Button {
            const defn = tiles.sensors[id];
            if (defn) {
                const button = new Button(
                    this.stage,
                    "beige",
                    defn.tid,
                    defn.name,
                    0, 0, false,
                    (button) => this.handleSensorClick(button));
                button.z = 800;
                button.data["defn"] = defn;
                return button;
            }
            return undefined;
        }

        createActuatorBtn(id: string): Button {
            const defn = tiles.actuators[id];
            if (defn) {
                const button = new Button(
                    this.stage,
                    "beige",
                    defn.tid,
                    defn.name,
                    0, 0, false,
                    (button) => this.handleActuatorClick(button));
                button.z = 800;
                button.data["defn"] = defn;
                return button;
            }
            return undefined;
        }

        createFilterBtn(id: string, index: number): Button {
            const defn = tiles.filters[id];
            if (defn) {
                const button = new Button(
                    this.stage,
                    "beige",
                    defn.tid,
                    defn.name,
                    0, 0, false,
                    (button) => this.handleFilterClick(button));
                button.z = 800;
                button.data["defn"] = defn;
                button.data["index"] = index;
                return button;
            }
            return undefined;
        }

        createModifierBtn(id: string, index: number): Button {
            const defn = tiles.modifiers[id];
            if (defn) {
                const button = new Button(
                    this.stage,
                    "beige",
                    defn.tid,
                    defn.name,
                    0, 0, false,
                    (button) => this.handleModifierClick(button));
                button.z = 800;
                button.data["defn"] = defn;
                button.data["index"] = index;
                return button;
            }
            return undefined;
        }
    }

    const STAGE_ID = "kode";

    export class KodeStage extends Stage {
        static ID = STAGE_ID;
        okBtn: Button;
        cancelBtn: Button;
        charBtn: Button;
        brain: BrainUI;
        menu: Menu;

        constructor(app: App, public char: Character) {
            super(app, STAGE_ID);
        }

        public showMenu(x: number, y: number, items: MenuItemDefn[], direction: MenuDirection, onSelect: (selection: Button) => void) {
            this.hideMenu();
            const curx = this.cursor.x;
            const cury = this.cursor.y;
            const camx = this.camera.x;
            const camy = this.camera.y;
            this.menu = new Menu(this, items, false);
            this.menu.show(x, y, direction, (selection) => {
                this.hideMenu();
                onSelect(selection);
                this.cursor.x = curx;
                this.cursor.y = cury;
                this.camera.x = camx;
                this.camera.y = camy;
                this.brain.layout();
            });
        }

        hideMenu() {
            if (this.menu) {
                this.menu.destroy();
                this.menu = null;
            }
        }

        handleBPressed() {
            this.hideMenu();
        }

        handleMenuPressed() {
            // Execute next frame so we're out of the event handler when we destroy the stage.
            setTimeout(() => {
                // Don't like this. Assumes this is a pushed scene.
                this.app.popStage();
            }, 1);
        }

        handleCancelBtnClicked() {
            // Execute next frame so we're out of the event handler when we destroy the stage.
            setTimeout(() => {
                // Don't like this. Assumes this is a pushed scene.
                this.app.popStage();
            }, 1);
        }

        handleOkBtnClicked() {
            // Execute next frame so we're out of the event handler when we destroy the stage.
            setTimeout(() => {
                const bdefn = this.brain.toDefn();
                this.char.bdefn = bdefn;
                // Don't like this. Assumes this is a pushed scene.
                this.app.saveProject();
                this.app.popStage();
            }, 1);
        }

        handleCursorCanvasClick(x: number, y: number) {
            this.hideMenu();
        }

        handleCursorButtonClick(button: Button) {
            button.click();
        }

        handleCharBtnClick() {
            this.cursor.moveTo(0, 0);
            this.camera.moveTo(0, 0);            
        }

        updateHover() {
            const buttons = this.components
                .filter(comp => comp.kind === "button") as Button[];
            const overlapping = this.cursor.getAllOverlapping()
                .filter(spr => spr.data["kind"] === "button")
                .sort((a, b) => b.z - a.z)
                .map(spr => spr.data["component"] as Button);
            const button = overlapping.shift();
            buttons.forEach(elem => elem.hover(elem === button));
        }

        initScene() {
            super.initScene();
            scene.setBackgroundColor(11);
            this.cancelBtn = new Button(
                this,
                "white",
                "cancel",
                "Cancel",
                136, 8, true,
                () => this.handleCancelBtnClicked());
            this.okBtn = new Button(
                this,
                "white",
                "ok",
                "OK",
                152, 8, true,
                () => this.handleOkBtnClicked());
            this.cursor.moveTo(0, 0);
            this.camera.moveTo(0, 0);
            this.charBtn = new Button(this, "clear", this.char.defn.id, "", 8, 8, true, () => this.handleCharBtnClick());
            this.brain = new BrainUI(this, this.char.bdefn.clone(), -72, -32);
            this.brain.layout();

            this.start();

            /*
            game.onUpdateInterval(5000, function () {
                // Watch for sprite leaks.
                console.log("# sprites: " + game.currentScene().allSprites.length);
                // Watch for memory leaks.
                // control.heapSnapshot()
            });
            */
            game.onUpdateInterval(5000, () => {
                this.components.forEach((item: any) => {
                    if (item.x === 0 && item.y === 0) {
                        let f = 0;
                    }
                }); 
            });
        }

        shutdownScene() {
            this.char = null;
            super.shutdownScene();
        }

        notify(event: string, parm?: any) {
            if (event === "cursor:moved") {
                this.updateHover();
            } else {
                super.notify(event, parm);
            }
        }
    }
}