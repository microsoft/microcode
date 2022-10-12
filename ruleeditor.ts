namespace microcode {

    type ButtonRuleRep = { [name: string]: Button[] }

    const repNames = ["sensors", "filters", "actuators", "modifiers"]

    export class RuleEditor extends Component implements IPlaceable {
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

        private deleteIncompatibleTiles(name: string, index: number) {
            const ruleTiles = this.ruledef.getRuleRep()[name]

            while (index < ruleTiles.length) {
                const suggestions = this.getSuggestions(name, index)
                const compatible = suggestions.find(
                    t => t.tid == ruleTiles[index].tid
                )

                if (compatible) index++
                else ruleTiles.splice(index, ruleTiles.length - index)
            }
        }

        private editTile(name: string, index: number) {
            const ruleTiles = this.ruledef.getRuleRep()[name]
            const tileUpdated = (tile: TileDefn) => {
                const editedAdded = !!tile
                if (tile) {
                    if (index >= ruleTiles.length) {
                        reportEvent("tile.add", { tid: tile.tid })
                        ruleTiles.push(tile)
                    } else {
                        reportEvent("tile.update", { tid: tile.tid })
                        ruleTiles[index] = tile
                        if (name == "sensors")
                            this.deleteIncompatibleTiles("filters", 0)
                        else if (name == "actuators")
                            this.deleteIncompatibleTiles("modifiers", 0)
                        else this.deleteIncompatibleTiles(name, index + 1)
                    }
                } else {
                    ruleTiles.splice(index, 1)
                    reportEvent("tile.delete")
                    if (name == "filters" || name == "modifiers")
                        this.deleteIncompatibleTiles(name, index)
                }
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

                        tileUpdated(newOne)
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
                            tileUpdated(theOne)
                        },
                        () => {
                            this.editor.releaseBackground()

                            tileUpdated(undefined)
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
            let selected = undefined
            if (index < ruleTiles.length) {
                onDelete = () => {
                    tileUpdated(undefined)
                }
                selected = btns.indexOf(btns.find(b => b.iconId === ruleTiles[index].tid))
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
                        }
                        tileUpdated(theOne)
                    },
                    onDelete,
                    selected
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
