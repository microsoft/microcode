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
    const TOOLBAR_MARGIN = 2

    //% shim=TD_NOOP
    function connectJacdac() {
        const buf = Buffer.fromUTF8(JSON.stringify({ type: "connect" }))
        control.simmessages.send("usb", buf)
    }

    export class Editor extends Scene {
        navigator: RuleRowNavigator
        private progdef: ProgramDefn
        private currPage: number
        private connectBtn: Button
        private pageBtn: Button
        public pageEditor: PageEditor
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

        public nonEmptyPages(): number[] {
            return this.progdef.pages
                .map((p, i) =>
                    p.rules.length > 1 ||
                    (p.rules.length === 1 && !p.rules[0].isEmpty())
                        ? i
                        : -1
                )
                .filter(i => i > -1)
        }

        public ruleWidth() {
            let w = 0
            const rules = this.pageEditor.ruleEditors
            for (const rule of rules) {
                w = Math.max(w, rule.innerWidth)
            }
            return w + 24
        }

        public pageHeight() {
            const rules = this.pageEditor.ruleEditors
            return (
                TOOLBAR_HEIGHT +
                TOOLBAR_MARGIN +
                PageEditor.MARGIN +
                PageEditor.RULE_MARGIN * (rules.length - 1) +
                icondb.rule_arrow.height * rules.length
            )
        }

        public renderPage(p: number) {
            this.switchToPage(p)
            this.update()
            this.draw()
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

        public switchToPage(index: number) {
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
            const w = btn.xfrm.worldPos
            this.cursor.snapTo(w.x, w.y, btn.ariaId, btn.bounds)
            btn.reportAria(true)
        }

        public hoverCursorTo(btn: Button) {
            const w = btn.xfrm.worldPos
            this.cursor.setAriaContent(btn.ariaId, w)
            btn.reportAria(false)
        }

        private moveTo(target: Button) {
            if (target)
                this.cursor.moveTo(
                    target.xfrm.worldPos,
                    target.ariaId,
                    target.bounds
                )
        }
        private scrollAndMove(dir: CursorDir, skipBack = false) {
            try {
                const target = this.cursor.move(dir)
                this.scrollAndMoveButton(target)
            } catch (e) {
                if (dir === CursorDir.Up && e.kind === BACK_BUTTON_ERROR_KIND) {
                    if (!skipBack) this.back()
                } else throw e
            }
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
                top: Screen.TOP_EDGE + TOOLBAR_HEIGHT + TOOLBAR_MARGIN,
                width: Screen.WIDTH,
                height: Screen.HEIGHT - (TOOLBAR_HEIGHT + TOOLBAR_MARGIN),
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
                const tw = target.xfrm.worldPos
                const cursorDest = new Vec2(tw.x + xocc, tw.y + yocc)
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
            }

            super.startup()
            makeOnEvent(controller.right.id, CursorDir.Right)
            makeOnEvent(controller.left.id, CursorDir.Left)
            makeOnEvent(controller.up.id, CursorDir.Up)
            makeOnEvent(controller.down.id, CursorDir.Down)
            if (!Options.menuProfiling)
                control.onEvent(
                    ControllerButtonEvent.Pressed,
                    controller.menu.id,
                    () => {
                        // go back to home screen
                        this.app.popScene()
                        this.app.pushScene(new Home(this.app))
                    }
                )
            this.hudroot = new Placeable()
            this.hudroot.xfrm.localPos = new Vec2(0, Screen.TOP_EDGE)
            this.hudroot.xfrm.tag = "hud"
            this.scrollroot = new Placeable()
            this.scrollroot.xfrm.localPos = new Vec2(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE + TOOLBAR_HEIGHT + TOOLBAR_MARGIN
            )
            this.scrollDest.copyFrom(this.scrollroot.xfrm.localPos)
            this.scrollStartMs = 0
            this.cursor = new Cursor()
            this.picker = new Picker(this.cursor)
            this.currPage = 0
            this.connectBtn = new EditorButton(this, {
                parent: this.hudroot,
                style: ButtonStyles.BorderedPurple,
                icon: icondb.microbit_logo_btn,
                ariaId: "connect",
                x: Screen.LEFT_EDGE + 12,
                y: 8,
                onClick: () => connectJacdac(),
            })
            this.pageBtn = new EditorButton(this, {
                parent: this.hudroot,
                style: ButtonStyles.BorderedPurple,
                icon: PAGE_IDS[this.currPage],
                x: Screen.RIGHT_EDGE - 12,
                y: 8,
                onClick: () => this.pickPage(),
            })
            this.progdef = this.app.load(SAVESLOT_AUTO)
            if (!this.progdef) {
                // onboarding experience
                // load first sample if this is the first program being loaded
                this.app.saveSource(SAVESLOT_AUTO, samples(true)[1].source)
                this.progdef = this.app.load(SAVESLOT_AUTO)
            }

            this.configureP1Keys()
            this.configureP2Keys()
        }

        private configureP1Keys() {
            const forward = () => this.cursor.click()
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                forward
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id + keymap.PLAYER_OFFSET,
                forward
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => this.back()
            )
        }

        private configureP2Keys() {
            // P2 bindings
            const nextPage = () =>
                this.switchToPage(
                    (this.currPage + 1) % this.progdef.pages.length
                )
            const prevPage = () =>
                this.switchToPage(
                    (this.currPage + this.progdef.pages.length - 1) %
                        this.progdef.pages.length
                )
            // page up, page down
            control.onEvent(
                ControllerButtonEvent.Pressed,
                ControllerButton.Up + keymap.PLAYER_OFFSET,
                nextPage
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                ControllerButton.Down + keymap.PLAYER_OFFSET,
                prevPage
            )
            // next, prev page
            control.onEvent(
                ControllerButtonEvent.Pressed,
                ControllerButton.Left + keymap.PLAYER_OFFSET,
                prevPage
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                ControllerButton.Right + keymap.PLAYER_OFFSET,
                nextPage
            )
        }

        back() {
            if (!this.cursor.cancel()) {
                if (this.navigator.getRow() == 0) {
                    this.app.popScene()
                    this.app.pushScene(new Home(this.app))
                } else {
                    if (this.navigator.atRuleStart()) {
                        const target = this.navigator.initialCursor(0, 0)
                        this.moveTo(target)
                    } else this.scrollAndMove(CursorDir.Back)
                }
            }
        }

        protected handleClick(x: number, y: number) {
            const target = this.cursor.navigator.screenToButton(
                x - Screen.HALF_WIDTH,
                y - Screen.HALF_HEIGHT
            )
            if (target) {
                this.snapCursorTo(target)
                target.click()
            } else if (this.picker.visible) {
                this.picker.hide()
            }
        }

        protected handleMove(x: number, y: number) {
            const target = this.cursor.navigator.screenToButton(
                x - Screen.HALF_WIDTH,
                y - Screen.HALF_HEIGHT
            )
            if (target) {
                this.hoverCursorTo(target)
            }
        }

        protected handleWheel(dx: number, dy: number) {
            if (dy < 0) {
                this.scrollAndMove(CursorDir.Up, true)
            } else if (dy > 0) {
                this.scrollAndMove(CursorDir.Down)
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

            this.navigator.addButtons([this.connectBtn, this.pageBtn])

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

            if (elapsedTimeMs < 63) {
                Vec2.LerpToRefFix(
                    this.scrollroot.xfrm.localPos,
                    this.scrollDest,
                    elapsedTimeMs << 2,
                    this.scrollroot.xfrm.localPos
                )
            } else {
                this.scrollroot.xfrm.localPos.copyFrom(this.scrollDest)
            }

            this.cursor.update()
        }

        /* override */ draw() {
            if (!this.backgroundCaptured) {
                this.drawBackground()
                this.drawEditor()
                this.drawNav()
            }
            this.picker.draw()
            this.cursor.draw()
        }

        private drawEditor() {
            control.enablePerfCounter()
            if (this.pageEditor) this.pageEditor.draw()
        }

        private drawBackground() {
            control.enablePerfCounter()
            let x = Screen.LEFT_EDGE
            while (x < Screen.RIGHT_EDGE) {
                Screen.drawTransparentImage(
                    editorBackground,
                    x,
                    Screen.TOP_EDGE
                )
                x += editorBackground.width
            }
        }

        private drawNav() {
            control.enablePerfCounter()
            // if dot matrix is visible, then we're connected to some Jacdac bus
            // TODO: move cursor to next button when visible?
            this.connectBtn.setVisible(jdc.numServiceInstances(0x110d154b) == 0)
            if (this.connectBtn.visible()) this.connectBtn.draw()
            this.pageBtn.draw()
        }
    }

    class PageEditor extends Component implements IPlaceable {
        private xfrm_: Affine
        public ruleEditors: RuleEditor[]

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
            this.ruleEditors = pagedef.rules.map(
                (ruledef, index) => new RuleEditor(editor, this, ruledef, index)
            )
            this.ensureFinalEmptyRule()
            this.layout()
        }

        /* override */ destroy() {
            this.ruleEditors.forEach(rule => rule.destroy())
            this.ruleEditors = undefined
            super.destroy()
        }

        private ensureFinalEmptyRule() {
            if (this.ruleEditors) {
                this.trimRules()
                const ruledefn = new RuleDefn()
                this.ruleEditors.push(
                    new RuleEditor(
                        this.editor,
                        this,
                        ruledefn,
                        this.ruleEditors.length
                    )
                )
                this.pagedef.rules.push(ruledefn)
            }
        }

        private trimRules() {
            if (!this.ruleEditors.length) {
                return
            }
            let last = this.ruleEditors[this.ruleEditors.length - 1]
            while (last.isEmpty()) {
                last.destroy()
                this.ruleEditors.pop()
                this.pagedef.rules.pop()
                if (!this.ruleEditors.length) {
                    return
                }
                last = this.ruleEditors[this.ruleEditors.length - 1]
            }
        }

        public static MARGIN = 10
        public static RULE_MARGIN = 3
        public layout() {
            if (!this.ruleEditors) return
            this.ruleEditors.forEach(rule => {
                rule.layout()
            })
            let left = PageEditor.MARGIN
            let top = PageEditor.MARGIN
            this.ruleEditors.forEach((rule, index) => {
                if (index) {
                    top += this.ruleEditors[index - 1].bounds.height >> 1
                    top += rule.bounds.height >> 1
                    top += PageEditor.RULE_MARGIN
                }
                rule.xfrm.localPos.x = left
                rule.xfrm.localPos.y = top
            })
            // Make all rules the same width
            let maxRuleWidth = 0
            this.ruleEditors.forEach(rule => {
                maxRuleWidth = Math.max(maxRuleWidth, rule.bounds.width)
            })
            this.ruleEditors.forEach(rule => {
                rule.bounds.width = maxRuleWidth
            })
        }

        public addToNavigator() {
            this.ruleEditors.forEach(rule => {
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
            const rule = this.ruleEditors[index]
            this.pagedef.deleteRuleAt(index)
            this.ruleEditors.splice(index, 1)
            rule.destroy()
            this.ruleEditors.forEach((rule, index) => (rule.index = index))
            this.changed()
            this.editor.saveAndCompileProgram()
        }

        public insertRuleAt(index: number) {
            const newRule = this.pagedef.insertRuleAt(index)
            if (newRule) {
                this.editor.saveAndCompileProgram()
                const rules: RuleEditor[] = []
                for (let i = 0; i < index; ++i) {
                    rules.push(this.ruleEditors[i])
                }
                rules.push(new RuleEditor(this.editor, this, newRule, index))
                for (let i = index; i < this.ruleEditors.length; ++i) {
                    rules.push(this.ruleEditors[i])
                }
                this.ruleEditors = rules
                this.ruleEditors.forEach((rule, index) => (rule.index = index))
                this.changed()
            }
        }

        /* override */ update() {
            this.ruleEditors.forEach(rule => rule.update())
        }

        /* override */ draw() {
            control.enablePerfCounter()
            this.ruleEditors.forEach(rule => rule.draw())
        }
    }

    type ButtonRuleRep = { [name: string]: Button[] }

    const repNames = ["sensors", "filters", "actuators", "modifiers"]

    class RuleEditor extends Component implements IPlaceable {
        private xfrm_: Affine
        innerWidth: number
        handleBtn: Button
        whenInsertBtn: Button
        doInsertBtn: Button
        arrow: Sprite
        ruleButtons: ButtonRuleRep
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
                style: ButtonStyles.Transparent,
                onClick: () => this.showRuleHandleMenu(),
            })
            this.arrow = new Sprite({
                parent: this,
                img: icons.get("rule_arrow"),
            })
            this.ruleButtons = {
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
                this.ruleButtons["sensors"].length == 0 ||
                this.getSuggestions(
                    "filters",
                    this.ruleButtons["filters"].length
                ).length
            ) {
                this.whenInsertBtn = new EditorButton(this.editor, {
                    parent: this,
                    style: ButtonStyles.Transparent,
                    icon: "when_insertion_point",
                    ariaId:
                        this.ruleButtons["sensors"].length == 0
                            ? "when"
                            : undefined,
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
                this.ruleButtons["actuators"].length == 0 ||
                this.getSuggestions(
                    "modifiers",
                    this.ruleButtons["modifiers"].length
                ).length
            ) {
                this.doInsertBtn = new EditorButton(this.editor, {
                    parent: this,
                    style: ButtonStyles.Transparent,
                    icon: "do_insertion_point",
                    ariaId:
                        this.ruleButtons["actuators"].length == 0
                            ? "do"
                            : undefined,
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
                if (this.ruleButtons[name].length) {
                    this.ruleButtons[name].forEach(btn => btn.destroy())
                    this.ruleButtons[name] = []
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
                    this.ruleButtons[name].push(button)
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
            const newFieldEditor = (tile: TileDefn) => {
                const newOne = tile.getNewInstance()
                const fieldEditor = newOne.fieldEditor
                this.editor.captureBackground()
                fieldEditor.editor(
                    newOne.getField(),
                    this.editor.picker,
                    () => {
                        this.editor.releaseBackground()
                        if (index >= ruleTiles.length) {
                            ruleTiles.push(newOne)
                        } else {
                            ruleTiles[index] = newOne
                        }
                        tileUpdated()
                    }
                )
            }
            if (index < ruleTiles.length) {
                const theOne = ruleTiles[index]
                const fieldEditor = theOne.fieldEditor
                if (fieldEditor) {
                    this.editor.captureBackground()
                    fieldEditor.editor(
                        theOne.getField(),
                        this.editor.picker,
                        () => {
                            this.editor.releaseBackground()
                            tileUpdated()
                        },
                        () => {
                            this.editor.releaseBackground()
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
            if (suggestions.length == 1 && suggestions[0].fieldEditor) {
                let theOne =
                    index > 0 && ruleTiles[index - 1].fieldEditor // this is a hack to use the value from previous
                        ? ruleTiles[index - 1] // field editor (should really check they are the same)
                        : suggestions[0]
                newFieldEditor(theOne)
                return
            }
            let onDelete = undefined
            if (index < ruleTiles.length) {
                onDelete = () => {
                    reportEvent("tile.delete")
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
                        let theOne = tilesDB[name][id]
                        if (theOne.fieldEditor) {
                            // there is more work to do                l
                            theOne =
                                index > 0 && ruleTiles[index - 1].fieldEditor // this is a hack to use the value from previous
                                    ? ruleTiles[index - 1] // field editor (should really check they are the same)
                                    : theOne
                            newFieldEditor(theOne)
                        } else {
                            if (index >= ruleTiles.length) {
                                reportEvent("tile.add", { tid: theOne.tid })
                                ruleTiles.push(theOne)
                            } else {
                                reportEvent("tile.insert", { tid: theOne.tid })
                                ruleTiles[index] = theOne
                            }
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
                reportEvent("rule.add")
                this.page.insertRuleAt(this.index)
            } else if (iconId === "delete") {
                reportEvent("rule.delete")
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
            this.ruleButtons.sensors.forEach(b => btns.push(b))
            this.ruleButtons.filters.forEach(b => btns.push(b))

            if (this.whenInsertBtn) btns.push(this.whenInsertBtn)

            this.ruleButtons.actuators.forEach(b => btns.push(b))
            this.ruleButtons.modifiers.forEach(b => btns.push(b))

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
            const ruleRep = this.ruleButtons
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
            this.innerWidth = this.bounds.width
            this.bounds.width = Math.max(this.bounds.width, Screen.WIDTH)

            this.whenBounds.left = this.bounds.left
            this.whenBounds.top = this.bounds.top
            this.whenBounds.height = this.bounds.height
        }

        isOffScreen(): boolean {
            const y = this.xfrm.worldPos.y
            const b = this.bounds
            return (
                y + b.top > Screen.BOTTOM_EDGE || y + b.bottom < Screen.TOP_EDGE
            )
        }

        /* override */ draw() {
            control.enablePerfCounter()
            if (this.isOffScreen()) return

            this.drawBackground()
            this.handleBtn.draw()
            if (this.whenInsertBtn) this.whenInsertBtn.draw()
            this.arrow.draw()
            if (this.doInsertBtn) this.doInsertBtn.draw()
            repNames.forEach(name => {
                const buttons = this.ruleButtons[name]
                for (let i = 0; i < buttons.length; ++i) {
                    const btn = buttons[i]
                    if (!btn.isOffScreenX()) btn.draw()
                }
            })
        }

        private drawBackground() {
            control.enablePerfCounter()
            Screen.fillBoundsXfrm(this.xfrm, this.bounds, 11)
            Screen.fillBoundsXfrm(this.xfrm, this.whenBounds, 13)
            Screen.outlineBoundsXfrm(this.xfrm, this.bounds, 1, 12)
        }
    }
}
