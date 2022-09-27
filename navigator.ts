namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (dir: CursorDir) => Button
        getCurrent: () => Button
        screenToButton: (x: number, y: number) => Button
        initialCursor: (row: number, col: number) => Button
        finished: () => void
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

        public finished() {}

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
            this.hasDelete = this.buttonGroups[0].length == 1
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
        private sortedButtons: Button[][]

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

        private getRow() {
            for (let row = 0; row < this.sortedButtons.length; row++) {
                if (
                    this.curr.xfrm.worldPos.y ==
                    this.sortedButtons[row][0].xfrm.worldPos.y
                )
                    return row
            }
            return -1
        }

        // call this when finished adding buttons
        public finished() {
            this.sortedButtons = []
            // we now need to optimize a bit by sorting and creating rows
            // for now, we assume the buttons have been added in order by
            // y coordinate
            let currRow: Button[] = []
            this.buttons.forEach(btn => {
                if (
                    currRow.length == 0 ||
                    btn.xfrm.worldPos.y == currRow[0].xfrm.worldPos.y
                )
                    currRow.push(btn)
                else {
                    this.sortedButtons.push(currRow)
                    currRow = []
                }
            })
            if (currRow.length) this.sortedButtons.push(currRow)
            // sort each row by x coordinate
            this.sortedButtons.forEach(btns =>
                btns.sort((a, b) => a.xfrm.worldPos.x - b.xfrm.worldPos.x)
            )
        }

        public move(dir: CursorDir): Button {
            let btn: Button
            if (!this.curr) {
                btn = this.buttons[0]
            } else {
                const row = this.getRow()
                const col = this.sortedButtons[row].indexOf(this.curr)
                switch (dir) {
                    case CursorDir.Up: {
                        if (row > 0) {
                            const prevRow = this.sortedButtons[row - 1]
                            if (col < prevRow.length) btn = prevRow[col]
                            else {
                                btn = prevRow[prevRow.length - 1]
                            }
                        }
                    }
                    case CursorDir.Down: {
                        if (row < this.sortedButtons.length - 1) {
                            const nextRow = this.sortedButtons[row + 1]
                            if (col < nextRow.length) btn = nextRow[col]
                            else {
                                btn = nextRow[nextRow.length - 1]
                            }
                        }
                        break
                    }
                    case CursorDir.Left: {
                        if (col > 0) btn = this.sortedButtons[row][col - 1]
                        else if (row > 0) {
                            const prevRow = this.sortedButtons[row - 1]
                            btn = prevRow[prevRow.length - 1]
                        }
                        break
                    }
                    case CursorDir.Right: {
                        if (col < this.sortedButtons[row].length - 1)
                            btn = this.sortedButtons[row][col + 1]
                        else if (row < this.sortedButtons.length - 1) {
                            const nextRow = this.sortedButtons[row + 1]
                            btn = nextRow[0]
                        }
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
            this.curr = this.buttons[row]
            return this.curr
        }
    }
}
