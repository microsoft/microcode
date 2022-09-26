namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (dir: CursorDir) => Button
        getCurrent: () => Button
        screenToButton: (x: number, y: number) => Button
        initialCursor: (row: number, col: number) => Button
    }

    export class RowNavigator implements INavigator {
        protected buttonGroups: Button[][]
        protected buttons: Button[]
        protected row: number
        protected col: number

        constructor() {
            this.buttonGroups = []
            this.buttons = []
        }

        public clear() {
            this.buttonGroups = []
            this.buttons = []
        }

        public getRow() {
            return this.row
        }

        public addButtons(btns: Button[]) {
            this.buttonGroups.push(btns)
            this.buttons = this.buttons.concat(btns)
        }

        public screenToButton(x: number, y: number): Button {
            const p = new Vec2(x, y)
            const target = this.buttons.find(btn =>
                Bounds.Translate(btn.bounds, btn.xfrm.worldPos).contains(p)
            )
            if (target) {
                for (let row = 0; row < this.buttonGroups.length; row++) {
                    for (
                        let col = 0;
                        col < this.buttonGroups[row].length;
                        col++
                    ) {
                        if (this.buttonGroups[row][col] === target) {
                            this.row = row
                            this.col = col
                            return target
                        }
                    }
                }
            }
            return undefined
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
            const btn = this.buttonGroups[this.row][this.col]
            if (btn) btn.reportAria()
            return btn
        }

        public getCurrent(): Button {
            return this.buttonGroups[this.row][this.col]
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

    // this add accessibility for rule
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

        public addRule(rule: RuleDefn) {
            this.rules.push(rule)
        }

        public move(dir: CursorDir) {
            const ret = super.move(dir)
            this.reportAria(ret)
            return ret
        }

        protected reportAria(ret: Button) {
            if (!ret) {
                console.warn(`rule: missing aria target`)
                return
            }

            let accessibilityMessage: accessibility.AccessibilityMessage
            if (this.row > 0 && this.col == 0) {
                const ruleDef = this.rules[this.row - 1]

                const whens: string[] = ruleDef.sensors
                    .map(s => s.tid)
                    .concat(ruleDef.filters.map(s => s.tid))

                const dos: string[] = ruleDef.actuators
                    .map(s => s.tid)
                    .concat(ruleDef.modifiers.map(s => s.tid))

                accessibilityMessage = <accessibility.RuleAccessibilityMessage>{
                    type: "rule",
                    whens,
                    dos,
                }
            } else {
                accessibilityMessage = <accessibility.TileAccessibilityMessage>{
                    type: "tile",
                    value: (ret ? ret.ariaId : "") || "",
                }
            }
            accessibility.setLiveContent(accessibilityMessage)
        }
    }

    // accessibility for LEDs
    export class LEDNavigator extends RowNavigator {
        private hasDelete: boolean

        public initialCursor(row: number = 0, col: number = 0) {
            this.hasDelete = this.buttonGroups.length == 1
            this.row = 2 + (this.hasDelete ? 1 : 0)
            this.col = 2
            const btn = this.buttonGroups[this.row][this.col]
            this.reportAria(btn)

            return btn
        }

        public addButtons(btns: Button[]) {
            super.addButtons(btns)

            btns.forEach(btn => {
                if (btn.onClick) {
                    let prev = btn.onClick
                    btn.onClick = () => {
                        prev(btn)
                        this.reportAria(btn)
                    }
                } else {
                    btn.onClick = () => this.reportAria(btn)
                }
            })
        }

        protected reportAria(btn: Button) {
            if (!btn) {
                console.warn(`led: missing aria target`)
                return
            }
            if (this.hasDelete && this.row == 0 && this.col == 0) {
                accessibility.setLiveContent(<
                    accessibility.TextAccessibilityMessage
                >{
                    type: "text",
                    value: "delete_tile",
                })
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

            accessibility.setLiveContent(<
                accessibility.TextAccessibilityMessage
            >{
                type: "text",
                value: `led ${this.col + 1} ${
                    this.hasDelete ? this.row : this.row + 1
                } ${status}`,
            })
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
                btn.reportAria()
                this.curr = btn
            }

            return this.curr
        }

        public screenToButton(x: number, y: number): Button {
            const p = new Vec2(x, y)
            const target = this.buttons.find(btn =>
                Bounds.Translate(btn.bounds, btn.xfrm.worldPos).contains(p)
            )
            if (target) this.curr = target
            return target
        }

        public getCurrent(): Button {
            return this.curr
        }

        public initialCursor(row: number, col: number): Button {
            this.curr = this.buttons[0]
            return this.curr
        }
    }
}
