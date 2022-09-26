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
                    // because the column in new row may be out of bounds
                    this.makeGood()
                    break
                }

                case CursorDir.Down: {
                    if (this.row == this.buttonGroups.length - 1)
                        return undefined
                    this.row++
                    // because the column in new row may be out of bounds
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

        public atRuleStart() {
            return this.row >= 1 && this.col == 0
        }

        public move(dir: CursorDir) {
            const ret = super.move(dir)
            this.reportAria(ret)
            return ret
        }

        protected reportAria(ret: Button) {
            if (!ret) {
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
            const getButton = (
                dirY: (btn: Button) => boolean,
                diffXCurr: (btn: Button) => boolean,
                sortY: (a: Button, b: Button) => number,
                sortX: (a: Button, b: Button) => number
            ) => {
                let above = this.buttons.filter(dirY)
                let getBtn = above.filter(diffXCurr).sort(sortY).shift()
                if (!getBtn && sortX) {
                    getBtn = above.sort(sortX).shift()
                }
                return getBtn
            }

            let btn: Button

            if (!this.curr) {
                btn = this.buttons[0]
            } else {
                switch (dir) {
                    case CursorDir.Up:
                    case CursorDir.Down: {
                        btn = getButton(
                            btn =>
                                dir == CursorDir.Up
                                    ? btn.xfrm.worldPos.y <
                                      this.curr.xfrm.worldPos.y
                                    : btn.xfrm.worldPos.y >
                                      this.curr.xfrm.worldPos.y,
                            btn =>
                                Math.abs(
                                    btn.xfrm.worldPos.x -
                                        this.curr.xfrm.worldPos.x
                                ) <
                                btn.width >> 1,
                            (a, b) =>
                                dir == CursorDir.Up
                                    ? b.xfrm.worldPos.y - a.xfrm.worldPos.y
                                    : a.xfrm.worldPos.y - b.xfrm.worldPos.y,
                            (a, b) =>
                                Math.abs(b.xfrm.worldPos.x - a.xfrm.worldPos.x)
                        )
                        break
                    }
                    case CursorDir.Left:
                    case CursorDir.Right: {
                        btn = getButton(
                            btn =>
                                dir == CursorDir.Left
                                    ? btn.xfrm.worldPos.x <
                                      this.curr.xfrm.worldPos.x
                                    : btn.xfrm.worldPos.x >
                                      this.curr.xfrm.worldPos.x,
                            btn =>
                                Math.abs(
                                    btn.xfrm.worldPos.y -
                                        this.curr.xfrm.worldPos.y
                                ) <
                                btn.height >> 1,
                            (a, b) =>
                                dir == CursorDir.Left
                                    ? b.xfrm.worldPos.x - a.xfrm.worldPos.x
                                    : a.xfrm.worldPos.x - b.xfrm.worldPos.x,
                            undefined
                        )
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
