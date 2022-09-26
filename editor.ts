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
        private resetBtn: Button
        private pageEditor: PageEditor
        public cursor: Cursor
        private _changed: boolean
        private hudroot: Placeable
        private scrollroot: Placeable
        private scrollStartMs: number
        private scrollDest: Vec2
        public picker: Picker

        constructor(app: App) {
            super(app, "editor")
            this.scrollDest = new Vec2()
            this.color = 6
        }

        public changed() {
            this._changed = true
        }

        public renderProgram() {
            this.cursor.visible = false

            console.log(`program: render`)
            let imgs: Image[] = []
            let w = 0
            let h = 0
            const margin = 4
            for (let page = 0; page < 5; page++) {
                const progPage = this.progdef.pages[page]
                if (
                    progPage.rules.length > 1 ||
                    (progPage.rules.length === 1 &&
                        !progPage.rules[0].isEmpty())
                ) {
                    this.switchToPage(page)
                    this.update()
                    this.draw()
                    pause(1000)
                    const img = Screen.image.clone()
                    imgs.push(img)
                    w = Math.max(w, img.width)
                    h += img.height + margin
                }
            }
            console.log(`program: ${w}x${h} pixels`)
            const res = image.create(w, h)
            res.fill(this.color)
            let y = 0
            for (let i = 0; i < imgs.length; ++i) {
                const img = imgs[i]
                res.drawTransparentImage(img, 0, y)
                y += img.height + margin
            }

            this.cursor.visible = true
            return res
        }

        public saveAndCompileProgram() {
            this.app.save(SAVESLOT_AUTO, this.progdef)
            new jacs.TopWriter().emitProgram(this.progdef)
        }

        private pickPage() {
            const btns: PickerButtonDef[] = PAGE_IDS.map(pageId => {
                return {
                    icon: pageId,
                }
            })
            this.picker.addGroup({ btns })
            this.picker.show({
                onClick: iconId => {
                    const index = PAGE_IDS.indexOf(iconId)
                    this.switchToPage(index)
                },
            })
        }

        private switchToPage(index: number) {
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
            this.snapCursorTo(this.navigator.initialCursor(1, 1))
        }

        public snapCursorTo(btn: Button) {
            this.cursor.snapTo(
                btn.xfrm.worldPos.x,
                btn.xfrm.worldPos.y,
                btn.ariaId,
                btn.bounds
            )
            btn.reportAria()
        }

        private moveTo(target: Button) {
            if (target)
                this.cursor.moveTo(
                    target.xfrm.worldPos,
                    target.ariaId,
                    target.bounds
                )
        }
        private scrollAndMove(dir: CursorDir) {
            const target = this.cursor.move(dir)
            this.scrollAndMoveButton(target)
        }

        private scrollAndMoveButton(target: Button) {
            if (!target) {
                return
            }

            if (target.destroyed) {
                console.warn(
                    `scroll/move destroyed sprite '${target.id} ${target.ariaId}'`
                )
                return
            }

            if (target.rootXfrm.tag === "hud") {
                this.moveTo(target)
                return
            }

            const occBounds = new Bounds({
                left: Screen.LEFT_EDGE,
                top: Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2,
                width: Screen.WIDTH,
                height: Screen.HEIGHT - (TOOLBAR_HEIGHT + 2),
            })
            const occ = target.occlusions(occBounds)

            if (occ.has && !this.picker.visible) {
                // don't scroll if picker is visible
                if (this.scrollroot.xfrm.localPos.x !== this.scrollDest.x)
                    return // Already animating
                this.scrollStartMs = control.millis()
                const xocc = occ.left ? occ.left : -occ.right
                const yocc = occ.top ? occ.top : -occ.bottom
                Vec2.TranslateToRef(
                    this.scrollroot.xfrm.localPos,
                    new Vec2(xocc, yocc),
                    this.scrollDest
                )
                const cursorDest = new Vec2(
                    target.xfrm.worldPos.x + xocc,
                    target.xfrm.worldPos.y + yocc
                )
                this.cursor.moveTo(cursorDest, target.ariaId, target.bounds)
            } else {
                this.moveTo(target)
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
                controller.menu.id,
                () => {
                    // go back to home screen
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                }
            )
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
                        } else {
                            if (this.navigator.atRuleStart()) {
                                const target = this.navigator.initialCursor(
                                    0,
                                    0
                                )
                                this.moveTo(target)
                            } else this.scrollAndMove(CursorDir.Back)
                        }
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
            this.scrollDest.copyFrom(this.scrollroot.xfrm.localPos)
            this.scrollStartMs = 0
            this.cursor = new Cursor()
            this.picker = new Picker(this.cursor)
            this.currPage = 0
            this.pageBtn = new EditorButton(this, {
                parent: this.hudroot,
                style: ButtonStyles.BorderedPurple,
                icon: PAGE_IDS[this.currPage],
                x: Screen.RIGHT_EDGE - 32,
                y: 8,
                onClick: () => this.pickPage(),
            })
            this.resetBtn = new Button({
                parent: this.hudroot,
                icon: icons.get("reset"),
                style: ButtonStyles.BorderedPurple,
                ariaId: "reset",
                x: Screen.RIGHT_EDGE - 12,
                y: 8,
                onClick: () => this.saveAndCompileProgram(),
            })
            this.progdef = this.app.load(SAVESLOT_AUTO)
        }

        protected handleClick(x: number, y: number) {
            const target = this.cursor.navigator.screenToButton(x - 80, y - 60)
            if (target) {
                this.scrollAndMoveButton(target)
                target.click()
            } else if (this.picker.visible) {
                this.picker.hide()
            }
        }

        /* override */ shutdown() {
            this.progdef = undefined
            this.navigator.clear()
        }

        /* override */ activate() {
            super.activate()
            this.pageBtn.setIcon(PAGE_IDS[this.currPage])
            if (!this.pageEditor) {
                this.switchToPage(this.currPage)
            }
            this.saveAndCompileProgram()
        }

        public addButtons(btns: Button[]) {
            this.navigator.addButtons(btns)
        }

        private rebuildNavigator() {
            if (this.picker.visible) return

            if (this.navigator) {
                this.navigator.clear()
            } else this.navigator = new RuleRowNavigator()

            this.navigator.addButtons([this.pageBtn, this.resetBtn])

            this.pageEditor.addToNavigator()

            this.cursor.navigator = this.navigator
        }

        /* override */ update() {
            super.update()

            if (this.pageEditor) {
                this.pageEditor.update()
            }
            if (this._changed) {
                this._changed = false
                this.rebuildNavigator()
            }

            const currTimeMs = control.millis()
            const elapsedTimeMs = currTimeMs - this.scrollStartMs
            const pctTime = elapsedTimeMs / 50

            if (pctTime < 1) {
                Vec2.LerpToRef(
                    this.scrollroot.xfrm.localPos,
                    this.scrollDest,
                    pctTime,
                    this.scrollroot.xfrm.localPos
                )
            } else {
                this.scrollroot.xfrm.localPos.copyFrom(this.scrollDest)
            }

            this.cursor.update()
        }

        /* override */ draw() {
            Screen.drawTransparentImage(
                editorBackground,
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE
            )
            if (this.pageEditor) this.pageEditor.draw()
            this.pageBtn.draw()
            this.resetBtn.draw()
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
            this.editor.saveAndCompileProgram()
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
            this.editor.saveAndCompileProgram()
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
        queuedCursorMove: CursorDir

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
                icon: "rule_handle",
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
                        ariaId: tile.tid,
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
            const btns: PickerButtonDef[] = [
                {
                    icon: "plus",
                    ariaId: "add_rule",
                },
                {
                    icon: "delete",
                },
            ]
            this.editor.picker.addGroup({ btns })
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
                    // Queue a move to the right
                    this.queuedCursorMove = CursorDir.Right
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
                this.editor.picker.addGroup({ btns })
                this.editor.picker.show({
                    title: accessibility.ariaToTooltip(name),
                    navigator: () => new SimpleGridNavigator(),
                    onClick: id => {
                        // get from the database
                        const newOne = tilesDB[name][id].getNewInstance()
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

        update() {
            if (this.queuedCursorMove) {
                switch (this.queuedCursorMove) {
                    case CursorDir.Right:
                        control.raiseEvent(KEY_DOWN, controller.right.id)
                        break
                    // Add other cases as needed
                }
                this.queuedCursorMove = undefined
            }
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
            v.x += this.handleBtn.width
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

            updateSizeFromButtons(whenTiles)
            updateSizeFromButtons(doTiles)

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
            // don't render when out of screenR
            if (
                this.xfrm.worldPos.y + this.bounds.top > Screen.BOTTOM_EDGE ||
                this.xfrm.worldPos.y + this.bounds.bottom < Screen.TOP_EDGE
            ) {
                return
            }

            Screen.fillBoundsXfrm(this.xfrm, this.bounds, 11)
            Screen.fillBoundsXfrm(this.xfrm, this.whenBounds, 13)
            Screen.outlineBoundsXfrm(this.xfrm, this.bounds, 1, 12)
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
