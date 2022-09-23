namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (dir: CursorDir) => Button
        getOverlapping: () => Button[]
        screenToButton: (x: number, y: number) => Button
        initialCursor: (row: number, col: number) => Button
    }

    export class RowNavigator implements INavigator {
        protected buttonGroups: Button[][]
        protected row: number
        protected col: number

        constructor() {
            this.buttonGroups = []
        }

        public clear() {
            this.buttonGroups = []
        }

        public addButtons(btns: Button[]) {
            this.buttonGroups.push(btns)
        }

        public screenToButton(x: number, y: number): Button {
            let tx = -80 + x
            let ty = -60 + y
            let hitBtn: Button = undefined
            const p = new Vec2(tx, ty)
            let row = 0
            this.buttonGroups.forEach(g => {
                let col = 0
                g.forEach(btn => {
                    if (
                        !hitBtn &&
                        Bounds.Translate(
                            btn.bounds,
                            btn.xfrm.worldPos
                        ).contains(p)
                    ) {
                        hitBtn = btn
                        this.row = row
                        this.col = col
                    }
                    col++
                })
                row++
            })
            return hitBtn
        }

        public move(dir: CursorDir) {
            this.makeGood()
            switch (dir) {
                case CursorDir.Up: {
                    if (this.row == 0) return undefined
                    this.row--
                    this.makeGood()
                    break
                }
                case CursorDir.Down: {
                    if (this.row == this.buttonGroups.length - 1)
                        return undefined
                    this.row++
                    this.makeGood()
                    break
                }

                case CursorDir.Left: {
                    if (this.col == 0) {
                        if (this.row > 0) {
                            this.row--
                            this.col = this.buttonGroups[this.row].length - 1
                        } else return undefined
                    } else this.col--
                    break
                }

                case CursorDir.Right: {
                    if (this.col == this.buttonGroups[this.row].length - 1) {
                        if (this.row < this.buttonGroups.length - 1) {
                            this.row++
                            this.col = -1
                        } else return undefined
                    }
                    this.col++
                    break
                }

                case CursorDir.Back: {
                    if (this.col > 0) this.col = 0
                    else if (this.row > 0) this.row--
                    else return undefined
                    break
                }
            }
            return this.buttonGroups[this.row][this.col]
        }

        public getOverlapping(): Button[] {
            return [this.buttonGroups[this.row][this.col]]
        }

        protected makeGood() {
            if (this.row >= this.buttonGroups.length)
                this.row = this.buttonGroups.length - 1
            if (this.col >= this.buttonGroups[this.row].length)
                this.col = this.buttonGroups[this.row].length - 1
        }

        public initialCursor(row: number = 0, col: number = 0) {
            this.row = row
            this.col = col
            return this.buttonGroups[row][col]
        }
    }

    export class RuleRowNavigator extends RowNavigator {
        private rules: RuleDefn[]

        constructor() {
            super()
            this.rules = []
        }

        /* overrides */
        public clear() {
            super.clear()
            this.rules = []
        }

        public getRow() {
            return this.row
        }

        public addRule(rule: RuleDefn) {
            this.rules.push(rule)
        }

        public move(dir: CursorDir) {
            const ret = super.move(dir)

            let accessibilityMessage

            if (this.row > 0 && this.col == 0) {
                const ruleDef = this.rules[this.row - 1]

                const whensTileIds: string[] = []
                ruleDef.sensors.forEach(tile => whensTileIds.push(tile.tid))
                ruleDef.filters.forEach(tile => whensTileIds.push(tile.tid))

                const dosTileIds: string[] = []
                ruleDef.actuators.forEach(tile => dosTileIds.push(tile.tid))
                ruleDef.modifiers.forEach(tile => dosTileIds.push(tile.tid))

                accessibilityMessage =
                    new accessibility.ruleAccessibilityMessage(
                        dosTileIds,
                        whensTileIds
                    )
            } else {
                accessibilityMessage =
                    new accessibility.tileAccessibilityMessage(
                        (ret ? ret.ariaId : "") || ""
                    )
            }

            accessibility.setLiveContent(accessibilityMessage)

            return ret
        }
    }

    export class LEDNavigator extends RowNavigator {
        private rememberCol: number

        constructor() {
            super()
            this.rememberCol = 0
        }

        private hasDelete() {
            return this.buttonGroups[0].length == 1
        }

        public move(dir: CursorDir) {
            this.makeGood()
            switch (dir) {
                case CursorDir.Up: {
                    if (this.row == 0) return undefined
                    this.row--
                    if (this.row == 0 && this.hasDelete()) {
                        this.rememberCol = this.col
                        this.col = 0
                    }
                    break
                }
                case CursorDir.Down: {
                    if (this.row == this.buttonGroups.length - 1)
                        return undefined
                    this.row++
                    if (this.row == 1 && this.hasDelete()) {
                        this.col = this.rememberCol
                    }
                    break
                }

                case CursorDir.Left: {
                    if (this.col == 0) return undefined
                    this.col--
                    break
                }

                case CursorDir.Right: {
                    if (this.col == this.buttonGroups[this.row].length - 1)
                        return undefined
                    this.col++
                    break
                }
            }

            let btn = this.buttonGroups[this.row][this.col]

            this.reportAccessibilityInfo(btn)

            return btn
        }

        public initialCursor(row: number = 0, col: number = 0) {
            this.row = 2 + (this.hasDelete() ? 1 : 0)
            this.col = 2

            let btn = this.buttonGroups[this.row][this.col]

            this.reportAccessibilityInfo(btn)

            return btn
        }

        public addButtons(btns: Button[]) {
            super.addButtons(btns)

            btns.forEach(btn => {
                if (btn.onClick) {
                    let prev = btn.onClick
                    btn.onClick = () => {
                        prev(btn)
                        this.reportAccessibilityInfo(btn, false)
                    }
                } else {
                    btn.onClick = () => this.reportAccessibilityInfo(btn, false)
                }
            })
        }

        reportAccessibilityInfo(btn: Button, reportRemoveLED: Boolean = true) {
            if (this.row == 0 && this.col == 0) {
                if (reportRemoveLED) {
                    accessibility.setLiveContent(
                        new accessibility.textAccessibilityMessage(
                            "remove LED editor tile"
                        )
                    )
                }

                return
            }

            let color = btn.getIcon()
            let status

            if (color == "solid_red") {
                status = "on"
            } else if (color == "solid_black") {
                status = "off"
            } else {
                status = "unknown"
            }

            accessibility.setLiveContent(
                new accessibility.textAccessibilityMessage(
                    `led ${this.col} ${this.row} ${status}`
                )
            )
        }
    }

    export class SimpleGridNavigator implements INavigator {
        buttons: Button[]
        curr: Button

        constructor() {
            this.buttons = []
        }

        public clear() {
            this.buttons = []
            this.curr = undefined
        }

        public addButtons(btns: Button[]) {
            this.buttons = this.buttons.concat(btns)
        }

        public move(dir: CursorDir): Button {
            let btn: Button

            if (!this.curr) {
                btn = this.buttons[0]
            } else {
                switch (dir) {
                    case CursorDir.Up: {
                        // Get all buttons ABOVE the current one.
                        const above = this.buttons.filter(
                            btn =>
                                btn.xfrm.worldPos.y < this.curr.xfrm.worldPos.y
                        )
                        // Filter to just buttons with some HORIZONTAL overlap.
                        // Sort by increasing VERTICAL distance.
                        const overlap = above
                            .filter(
                                btn =>
                                    Math.abs(
                                        btn.xfrm.worldPos.x -
                                            this.curr.xfrm.worldPos.x
                                    ) <
                                    btn.width >> 1
                            )
                            .sort(
                                (a, b) => b.xfrm.worldPos.y - a.xfrm.worldPos.y
                            )
                        // Take the first one.
                        btn = overlap.shift()

                        if (!btn) {
                            // No buttons directly above, so pick the nearest one.
                            btn = above
                                .sort((a, b) =>
                                    Math.abs(
                                        b.xfrm.worldPos.x - a.xfrm.worldPos.x
                                    )
                                )
                                .shift()
                        }
                        break
                    }
                    case CursorDir.Down: {
                        // Get all buttons BELOW the current one.
                        // Take the first one.
                        const below = this.buttons.filter(
                            btn =>
                                btn.xfrm.worldPos.y > this.curr.xfrm.worldPos.y
                        )
                        // Filter to just buttons with some HORIZONTAL overlap.
                        // Sort by increasing VERTICAL distance.
                        const overlap = below
                            .filter(
                                btn =>
                                    Math.abs(
                                        btn.xfrm.worldPos.x -
                                            this.curr.xfrm.worldPos.x
                                    ) <
                                    btn.width >> 1
                            )
                            .sort(
                                (a, b) => a.xfrm.worldPos.y - b.xfrm.worldPos.y
                            )

                        btn = overlap.shift()
                        if (!btn) {
                            // No buttons directly below, so pick the nearest one.
                            btn = below
                                .sort((a, b) =>
                                    Math.abs(
                                        b.xfrm.worldPos.x - a.xfrm.worldPos.x
                                    )
                                )
                                .shift()
                        }
                        break
                    }
                    case CursorDir.Left: {
                        // Get all buttons LEFT of the current one.
                        // Filter to just buttons with some VERTICAL overlap.
                        // Sort by increasing HORIZONTAL distance.
                        // Take the first one.
                        btn = this.buttons
                            .filter(
                                btn =>
                                    btn.xfrm.worldPos.x <
                                    this.curr.xfrm.worldPos.x
                            )
                            .filter(
                                btn =>
                                    Math.abs(
                                        btn.xfrm.worldPos.y -
                                            this.curr.xfrm.worldPos.y
                                    ) <
                                    btn.width >> 1
                            )
                            .sort(
                                (a, b) => b.xfrm.worldPos.x - a.xfrm.worldPos.x
                            )
                            .shift()
                        break
                    }
                    case CursorDir.Right: {
                        // Get all buttons RIGHT of the current one.
                        // Filter to just buttons with some VERTICAL overlap.
                        // Sort by increasing HORIZONTAL distance.
                        // Take the first one.
                        btn = this.buttons
                            .filter(
                                btn =>
                                    btn.xfrm.worldPos.x >
                                    this.curr.xfrm.worldPos.x
                            )
                            .filter(
                                btn =>
                                    Math.abs(
                                        btn.xfrm.worldPos.y -
                                            this.curr.xfrm.worldPos.y
                                    ) <
                                    btn.width >> 1
                            )
                            .sort(
                                (a, b) => a.xfrm.worldPos.x - b.xfrm.worldPos.x
                            )
                            .shift()
                        break
                    }
                }
            }

            if (btn) {
                this.curr = btn
                let accessibilityMessage =
                    new accessibility.tileAccessibilityMessage(
                        (btn ? btn.ariaId : "") || ""
                    )
                accessibility.setLiveContent(accessibilityMessage)
            }

            return this.curr
        }

        public screenToButton(x: number, y: number): Button {
            const p = new Vec2(x, y)
            return this.buttons.find(btn =>
                Bounds.Translate(btn.bounds, btn.xfrm.worldPos).contains(p)
            )
        }

        public getOverlapping(): Button[] {
            return [this.curr]
        }

        public initialCursor(row: number, col: number): Button {
            this.curr = this.buttons[0]
            return this.curr
        }
    }
}
