namespace microcode {
    class EditorButton extends Button {
        constructor(
            private editor: Editor,
            opts: {
                parent?: IPlaceable
                style?: ButtonStyle
                icon: string | Image
                ariaId?: string
                label?: string
                x: number
                y: number
                onClick?: (button: Button) => void
            }
        ) {
            super(opts)
            editor.changed()
        }

        destroy() {
            this.editor.changed()
            super.destroy()
        }
    }

    const TOOLBAR_HEIGHT = 17

    export class Editor extends Scene {
        navigator: RuleRowNavigator
        private progdef: ProgramDefn
        private currPage: number
        private pageBtn: Button
        private prevPageBtn: Button
        private nextPageBtn: Button
        private pageEditor: PageEditor
        public cursor: Cursor
        private _changed: boolean
        private hudroot: Placeable
        private scrollroot: Placeable
        private scrollanim: Animation
        public picker: Picker

        constructor(app: App) {
            super(app, "editor")
            this.color = 6
        }

        public changed() {
            this._changed = true
        }

        public saveAndCompileProgram() {
            this.app.save(SAVESLOT_AUTO, this.progdef)
            new jacs.TopWriter().emitProgram(this.progdef)
        }

        private nextPage() {
            let index = this.currPage + 1
            index %= this.progdef.pages.length
            this.switchToPage(index, false)
        }

        private prevPage() {
            let index = this.currPage - 1
            if (index < 0) {
                index = this.progdef.pages.length - 1
            }
            this.switchToPage(index, false)
        }

        private pickPage() {
            // TODO: supply button labels
            const btns: PickerButtonDef[] = PAGE_IDS.map(pageId => {
                return {
                    icon: pageId,
                }
            })
            this.picker.addGroup({ label: "", btns })
            this.picker.show({
                onClick: iconId => {
                    const index = PAGE_IDS.indexOf(iconId)
                    this.switchToPage(index)
                },
            })
        }

        private switchToPage(index: number, initCursor: boolean = true) {
            if (index < 0 || index >= this.progdef.pages.length) {
                return
            }
            if (this.pageEditor) {
                this.pageEditor.destroy()
            }
            this.currPage = index
            this.pageBtn.setIcon(PAGE_IDS[this.currPage])
            this.pageEditor = new PageEditor(
                this,
                this.scrollroot,
                this.progdef.pages[this.currPage]
            )
            this.scrollroot.xfrm.localPos = new Vec2(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2
            )
            this.rebuildNavigator()
            if (initCursor) {
                const btn = this.navigator.initialCursor(this.cursor)
                if (btn) this.snapCursorTo(btn)
            }
        }

        public snapCursorTo(btn: Button) {
            this.cursor.snapTo(
                btn.xfrm.worldPos.x,
                btn.xfrm.worldPos.y,
                btn.ariaId
            )
        }

        private scrollAndMove(dir: CursorDir) {
            const target = this.cursor.move(dir)

            if (!target) return

            if (target.rootXfrm.tag === "hud") {
                this.cursor.moveTo(target.xfrm.worldPos, target.ariaId)
                return
            }

            const occ = target.occlusions(
                new Bounds({
                    left: Screen.LEFT_EDGE,
                    top: Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2,
                    width: Screen.WIDTH,
                    height: Screen.HEIGHT - (TOOLBAR_HEIGHT + 2),
                })
            )
            if (occ.has) {
                if (this.scrollanim.playing) {
                    return
                }
                const xocc = occ.left ? occ.left : -occ.right
                const yocc = occ.top ? occ.top : -occ.bottom
                const endValue = Vec2.TranslateToRef(
                    this.scrollroot.xfrm.localPos,
                    new Vec2(xocc, yocc),
                    new Vec2()
                )
                this.scrollanim.clearFrames()
                this.scrollanim.addFrame(
                    new EaseFrame({
                        duration: 0.05,
                        //curve: curves.easeOut(curves.easing.sq2),
                        curve: curves.linear(),
                        startValue: this.scrollroot.xfrm.localPos,
                        endValue,
                    })
                )
                this.scrollanim.start()
                const dest = new Vec2(
                    target.xfrm.worldPos.x + xocc,
                    target.xfrm.worldPos.y + yocc
                )
                this.cursor.moveTo(dest, target.ariaId)
            } else {
                this.cursor.moveTo(target.xfrm.worldPos, target.ariaId)
            }
        }

        /* override */ startup() {
            const makeOnEvent = (id: number, dir: CursorDir) => {
                control.onEvent(ControllerButtonEvent.Pressed, id, () =>
                    this.scrollAndMove(dir)
                )
                if (Options.repeatKey)
                    control.onEvent(ControllerButtonEvent.Repeated, id, () =>
                        this.scrollAndMove(dir)
                    )
            }

            super.startup()
            makeOnEvent(controller.right.id, CursorDir.Right)
            makeOnEvent(controller.left.id, CursorDir.Left)
            makeOnEvent(controller.up.id, CursorDir.Up)
            makeOnEvent(controller.down.id, CursorDir.Down)
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => this.cursor.click()
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    if (!this.cursor.cancel()) {
                        if (this.navigator.getRow() == 0) {
                            this.app.popScene()
                            this.app.pushScene(new Home(this.app))
                        } else this.scrollAndMove(CursorDir.Back)
                    }
                }
            )
            this.hudroot = new Placeable()
            this.hudroot.xfrm.localPos = new Vec2(0, Screen.TOP_EDGE)
            this.hudroot.xfrm.tag = "hud"
            this.scrollroot = new Placeable()
            this.scrollroot.xfrm.localPos = new Vec2(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2
            )
            this.scrollanim = new Animation(
                (v: Vec2) => this.scrollAnimCallback(v),
                {
                    done: () => this.scrollAnimComplete(),
                }
            )
            this.cursor = new Cursor()
            this.picker = new Picker(this.cursor)
            this.currPage = 0
            this.pageBtn = new EditorButton(this, {
                parent: this.hudroot,
                style: ButtonStyles.BorderedPurple,
                icon: PAGE_IDS[this.currPage],
                x: 0,
                y: 8,
                onClick: () => this.pickPage(),
            })
            this.nextPageBtn = new EditorButton(this, {
                parent: this.hudroot,
                style: ButtonStyles.BorderedPurple,
                icon: "next_page",
                x: 19,
                y: 8,
                onClick: () => this.nextPage(),
            })
            this.prevPageBtn = new EditorButton(this, {
                parent: this.hudroot,
                style: ButtonStyles.BorderedPurple,
                icon: "prev_page",
                x: -19,
                y: 8,
                onClick: () => this.prevPage(),
            })
            this.progdef = this.app.load(SAVESLOT_AUTO)
        }

        /* override */ shutdown() {
            this.progdef = undefined
            this.navigator.clear()
        }

        /* override */ activate() {
            this.pageBtn.setIcon(PAGE_IDS[this.currPage])
            if (!this.pageEditor) {
                this.switchToPage(this.currPage)
            }
        }

        public addButtons(btns: Button[]) {
            this.navigator.addButtons(btns)
        }

        private rebuildNavigator() {
            if (this.picker.visible) return

            if (this.navigator) {
                this.navigator.clear()
            } else this.navigator = new RuleRowNavigator()

            this.navigator.addButtons([
                this.prevPageBtn,
                this.pageBtn,
                this.nextPageBtn,
            ])

            this.pageEditor.addToNavigator()

            this.cursor.navigator = this.navigator
        }

        private scrollAnimCallback(v: Vec2) {
            this.scrollroot.xfrm.localPos = v
        }

        private scrollAnimComplete() {
            this.changed()
        }

        /* override */ update() {
            if (this.pageEditor) {
                this.pageEditor.update()
            }
            if (this._changed) {
                this._changed = false
                this.rebuildNavigator()
            }
            this.scrollanim.update()
            this.cursor.update()
        }

        /* override */ draw() {
            Screen.drawTransparentImage(
                editorBackground,
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE
            )
            if (this.pageEditor) {
                this.pageEditor.draw()
            }
            this.pageBtn.draw()
            this.prevPageBtn.draw()
            this.nextPageBtn.draw()
            this.picker.draw()
            this.cursor.draw()
        }
    }

    class PageEditor extends Component implements IPlaceable {
        private xfrm_: Affine
        rules: RuleEditor[]

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() {
            return this.xfrm_
        }

        constructor(
            private editor: Editor,
            parent: IPlaceable,
            private pagedef: PageDefn
        ) {
            super("page_editor")
            this.xfrm_ = new Affine()
            this.xfrm_.parent = parent.xfrm
            this.rules = pagedef.rules.map(
                (ruledef, index) => new RuleEditor(editor, this, ruledef, index)
            )
            this.ensureFinalEmptyRule()
            this.layout()
        }

        /* override */ destroy() {
            this.rules.forEach(rule => rule.destroy())
            this.rules = undefined
            super.destroy()
        }

        private ensureFinalEmptyRule() {
            if (this.rules) {
                this.trimRules()
                const ruledefn = new RuleDefn()
                this.rules.push(
                    new RuleEditor(
                        this.editor,
                        this,
                        ruledefn,
                        this.rules.length
                    )
                )
                this.pagedef.rules.push(ruledefn)
            }
        }

        private trimRules() {
            if (!this.rules.length) {
                return
            }
            let last = this.rules[this.rules.length - 1]
            while (last.isEmpty()) {
                last.destroy()
                this.rules.pop()
                this.pagedef.rules.pop()
                if (!this.rules.length) {
                    return
                }
                last = this.rules[this.rules.length - 1]
            }
        }

        private layout() {
            if (this.rules) {
                this.rules.forEach(rule => {
                    rule.layout()
                })
                let left = 10
                let top = 10
                this.rules.forEach((rule, index) => {
                    if (index) {
                        top += this.rules[index - 1].bounds.height >> 1
                        top += rule.bounds.height >> 1
                        top += 3
                    }
                    rule.xfrm.localPos.x = left
                    rule.xfrm.localPos.y = top
                })
                // Make all rules the same width
                let maxRuleWidth = 0
                this.rules.forEach(rule => {
                    maxRuleWidth = Math.max(maxRuleWidth, rule.bounds.width)
                })
                this.rules.forEach(rule => {
                    rule.bounds.width = maxRuleWidth
                })
            }
        }

        public addToNavigator() {
            this.rules.forEach(rule => {
                this.editor.navigator.addRule(rule.ruledef)
                rule.addToNavigator()
            })
        }

        public changed() {
            this.ensureFinalEmptyRule()
            this.layout()
            this.editor.changed()
        }

        public deleteRuleAt(index: number) {
            const rule = this.rules[index]
            this.pagedef.deleteRuleAt(index)
            this.rules.splice(index, 1)
            rule.destroy()
            this.rules.forEach((rule, index) => (rule.index = index))
            this.changed()
        }

        public insertRuleAt(index: number) {
            this.pagedef.insertRuleAt(index)
            const rules: RuleEditor[] = []
            for (let i = 0; i < index; ++i) {
                rules.push(this.rules[i])
            }
            rules.push(new RuleEditor(this.editor, this, new RuleDefn(), index))
            for (let i = index; i < this.rules.length; ++i) {
                rules.push(this.rules[i])
            }
            this.rules = rules
            this.rules.forEach((rule, index) => (rule.index = index))
            this.changed()
        }

        /* override */ update() {
            this.rules.forEach(rule => rule.update())
        }

        /* override */ draw() {
            this.rules.forEach(rule => rule.draw())
        }
    }

    type ButtonRuleRep = { [name: string]: Button[] }

    const repNames = ["sensors", "filters", "actuators", "modifiers"]

    class RuleEditor extends Component implements IPlaceable {
        private xfrm_: Affine
        handleBtn: Button
        whenInsertBtn: Button
        doInsertBtn: Button
        arrow: Sprite
        rule: ButtonRuleRep
        bounds: Bounds
        whenBounds: Bounds

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() {
            return this.xfrm_
        }

        constructor(
            private editor: Editor,
            private page: PageEditor,
            public ruledef: RuleDefn,
            public index: number
        ) {
            super("rule_editor")
            this.xfrm_ = new Affine()
            this.xfrm_.parent = page.xfrm
            this.handleBtn = new EditorButton(editor, {
                parent: this,
                icon: "default",
                ariaId: "rule",
                x: 0,
                y: 0,
                onClick: () => this.showRuleHandleMenu(),
            })
            this.arrow = new Sprite({
                parent: this,
                img: icons.get("rule_arrow"),
            })
            this.rule = {
                sensors: [],
                filters: [],
                actuators: [],
                modifiers: [],
            }
            this.instantiateProgramTiles()
        }

        private destroyWhenInsertButton() {
            if (this.whenInsertBtn) this.whenInsertBtn.destroy()
            this.whenInsertBtn = undefined
        }

        private needsWhenInsert() {
            if (
                this.rule["sensors"].length == 0 ||
                this.getSuggestions("filters", this.rule["filters"].length)
                    .length
            ) {
                this.whenInsertBtn = new EditorButton(this.editor, {
                    parent: this,
                    style: ButtonStyles.Transparent,
                    icon: "when_insertion_point",
                    ariaId: "when",
                    x: 0,
                    y: 0,
                    onClick: () => this.showWhenInsertMenu(),
                })
            } else {
                this.destroyWhenInsertButton()
            }
        }

        private destroyDoInsertButton() {
            if (this.doInsertBtn) this.doInsertBtn.destroy()
            this.doInsertBtn = undefined
        }

        private needsDoInsert() {
            if (
                this.rule["actuators"].length == 0 ||
                this.getSuggestions("modifiers", this.rule["modifiers"].length)
                    .length
            ) {
                this.doInsertBtn = new EditorButton(this.editor, {
                    parent: this,
                    style: ButtonStyles.Transparent,
                    icon: "do_insertion_point",
                    ariaId: "do",
                    x: 0,
                    y: 0,
                    onClick: () => this.showDoInsertMenu(),
                })
            } else {
                this.destroyDoInsertButton()
            }
        }

        destroy() {
            this.destroyProgramTiles()
            this.handleBtn.destroy()
            this.destroyWhenInsertButton()
            this.destroyDoInsertButton()
            this.handleBtn = undefined
            this.whenInsertBtn = undefined
            this.doInsertBtn = undefined
            super.destroy()
        }

        private destroyProgramTiles() {
            let changed = false
            repNames.forEach(name => {
                if (this.rule[name].length) {
                    this.rule[name].forEach(btn => btn.destroy())
                    this.rule[name] = []
                    changed = true
                }
            })
            if (changed) this.editor.changed()
        }

        private instantiateProgramTiles() {
            this.destroyProgramTiles()
            const rule = this.ruledef.getRuleRep()
            let changed = false
            repNames.forEach(name => {
                const tiles = rule[name]
                tiles.forEach((tile, index) => {
                    const button = new EditorButton(this.editor, {
                        parent: this,
                        style: tile.buttonStyle(),
                        icon: tile.getIcon(),
                        label: TID_MODIFIER_ICON_EDITOR,
                        x: 0,
                        y: 0,
                        onClick: () => this.editTile(name, index),
                    })
                    this.rule[name].push(button)
                    changed = true
                })
            })
            this.needsWhenInsert()
            this.needsDoInsert()
            if (changed) this.page.changed()
        }

        private showRuleHandleMenu() {
            // Add rule conditions
            const iconIds = [] // .concat(RC_IDS);
            // "Insert rule above this one"
            iconIds.push("plus")
            // "Delete rule"
            iconIds.push("delete")
            const btns: PickerButtonDef[] = iconIds.map(iconId => {
                return {
                    icon: iconId,
                }
            })
            this.editor.picker.addGroup({ label: "", btns })
            this.editor.picker.show({
                onClick: iconId => this.handleRuleHandleMenuSelection(iconId),
            })
        }

        private nextEmpty(name: string, index: number) {
            return (
                (name == "sensors" &&
                    this.ruledef.filters.length == 0 &&
                    this.whenInsertBtn) ||
                (name == "filters" &&
                    index == this.ruledef.filters.length - 1 &&
                    (this.whenInsertBtn ||
                        this.ruledef.actuators.length == 0)) ||
                (name == "actuators" &&
                    this.ruledef.modifiers.length == 0 &&
                    this.doInsertBtn) ||
                (name == "modifiers" &&
                    index == this.ruledef.modifiers.length - 1 &&
                    this.doInsertBtn)
            )
        }

        private editTile(name: string, index: number) {
            const ruleTiles = this.ruledef.getRuleRep()[name]
            const tileUpdated = (editedAdded: boolean = true) => {
                Language.ensureValid(this.ruledef)
                this.editor.saveAndCompileProgram()
                this.instantiateProgramTiles()
                if (editedAdded && this.nextEmpty(name, index)) {
                    control.raiseEvent(KEY_DOWN, controller.right.id)
                }
                this.page.changed()
            }
            if (index < ruleTiles.length) {
                const theOne = ruleTiles[index]
                const fieldEditor = theOne.fieldEditor
                if (fieldEditor) {
                    fieldEditor.editor(
                        theOne.getField(),
                        this.editor.picker,
                        tileUpdated,
                        () => {
                            ruleTiles.splice(index, 1)
                            tileUpdated(false)
                        }
                    )
                    return
                }
            }
            const suggestions = this.getSuggestions(name, index)
            const btns: PickerButtonDef[] = suggestions.map(elem => {
                return {
                    icon: <string>elem.getIcon(),
                    label: elem.name,
                }
            })
            // special case for field editor
            if (btns.length == 1 && suggestions[0].fieldEditor) {
                const theOne = suggestions[0]
                const fieldEditor = theOne.fieldEditor
                fieldEditor.editor(
                    theOne.getField(),
                    this.editor.picker,
                    () => {
                        const newOne = theOne.getNewInstance()
                        if (index >= ruleTiles.length) {
                            ruleTiles.push(newOne)
                        } else {
                            ruleTiles[index] = newOne
                        }
                        tileUpdated()
                    }
                )
                return
            }
            let onDelete = undefined
            if (index < ruleTiles.length) {
                onDelete = () => {
                    ruleTiles.splice(index, 1)
                    tileUpdated(false)
                }
            }
            if (btns.length) {
                this.editor.picker.addGroup({ label: "", btns })
                this.editor.picker.show({
                    onClick: iconId => {
                        // get from the database
                        const newOne = tilesDB[name][iconId]
                        if (index >= ruleTiles.length) {
                            ruleTiles.push(newOne)
                        } else {
                            ruleTiles[index] = newOne
                        }
                        tileUpdated()
                    },
                    onDelete,
                })
            }
            return
        }

        private handleRuleHandleMenuSelection(iconId: string) {
            if (iconId === "plus") {
                this.page.insertRuleAt(this.index)
            } else if (iconId === "delete") {
                this.page.deleteRuleAt(this.index)
            }
        }

        private showWhenInsertMenu() {
            if (this.ruledef.sensors.length) {
                this.editTile("filters", this.ruledef.filters.length)
            } else {
                this.editTile("sensors", 0)
            }
        }

        private showDoInsertMenu() {
            if (this.ruledef.actuators.length) {
                this.editTile("modifiers", this.ruledef.modifiers.length)
            } else {
                this.editTile("actuators", 0)
            }
        }

        private getSuggestions(name: string, index: number) {
            return Language.getTileSuggestions(this.ruledef, name, index)
        }

        public addToNavigator() {
            const btns: Button[] = []
            btns.push(this.handleBtn)
            this.rule.sensors.forEach(b => btns.push(b))
            this.rule.filters.forEach(b => btns.push(b))

            if (this.whenInsertBtn) btns.push(this.whenInsertBtn)

            this.rule.actuators.forEach(b => btns.push(b))
            this.rule.modifiers.forEach(b => btns.push(b))

            if (this.doInsertBtn) btns.push(this.doInsertBtn)

            this.editor.addButtons(btns)
        }

        public isEmpty() {
            return this.ruledef.isEmpty()
        }

        public layout() {
            const ruleRep = this.rule
            const v = new Vec2()
            this.whenBounds = new Bounds()

            const whenTiles = ruleRep.sensors.concat(ruleRep.filters)
            const doTiles = ruleRep.actuators.concat(ruleRep.modifiers)
            if (this.whenInsertBtn) whenTiles.push(this.whenInsertBtn)
            if (this.doInsertBtn) doTiles.push(this.doInsertBtn)

            const firstWhenTile = whenTiles[0]
            const lastWhenTile = whenTiles[whenTiles.length - 1]

            this.handleBtn.xfrm.localPos = v
            v.x += this.handleBtn.width >> 1
            this.whenBounds.left = v.x

            v.x += firstWhenTile.width >> 1
            v.x += 2

            const layoutButtons = (btns: Button[]) => {
                btns.forEach((btn, index) => {
                    if (index) {
                        v.x += btns[index - 1].width >> 1
                        v.x += btn.width >> 1
                        v.x += 1
                    }
                    btn.xfrm.localPos = v
                })
            }

            layoutButtons(whenTiles)

            v.x += lastWhenTile.bounds.width >> 1
            this.whenBounds.right = v.x

            v.x += this.arrow.bounds.width >> 1
            v.x += 1

            this.arrow.xfrm.localPos.x = v.x
            v.x += this.arrow.bounds.width
            v.x += 2

            layoutButtons(doTiles)

            if (this.doInsertBtn) {
                this.doInsertBtn.xfrm.localPos = v
            }

            this.bounds = undefined

            const updateSizeFromButtons = (btns: Button[]) => {
                btns.forEach(btn => {
                    if (!this.bounds) {
                        this.bounds = btn.bounds
                            .clone()
                            .translate(btn.xfrm.localPos)
                    } else {
                        this.bounds.add(
                            Bounds.Translate(btn.bounds, btn.xfrm.localPos)
                        )
                    }
                })
            }

            updateSizeFromButtons(this.rule.sensors)
            updateSizeFromButtons(this.rule.filters)
            updateSizeFromButtons(this.rule.actuators)
            updateSizeFromButtons(this.rule.modifiers)
            if (this.whenInsertBtn) updateSizeFromButtons([this.whenInsertBtn])
            if (this.doInsertBtn) updateSizeFromButtons([this.doInsertBtn])

            if (!this.bounds) {
                this.bounds = new Bounds()
            } else {
                this.bounds.grow(1)
            }

            // Ensure that the rule "tray" is at least as wide as the screen
            this.bounds.width = Math.max(this.bounds.width, 160)

            this.whenBounds.left = this.bounds.left
            this.whenBounds.top = this.bounds.top
            this.whenBounds.height = this.bounds.height
        }

        /* override */ draw() {
            Screen.fillBoundsXfrm(this.xfrm, this.bounds, 11)
            Screen.fillBoundsXfrm(this.xfrm, this.whenBounds, 13)
            Screen.outlineBoundsXfrm(this.xfrm, this.bounds, 15)
            this.handleBtn.draw()
            if (this.whenInsertBtn) this.whenInsertBtn.draw()
            this.arrow.draw()
            if (this.doInsertBtn) this.doInsertBtn.draw()
            repNames.forEach(name => {
                const buttons = this.rule[name]
                buttons.forEach(btn => btn.draw())
            })
        }
    }
}
