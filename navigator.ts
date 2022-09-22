namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (dir: CursorDir) => Button
        getOverlapping: () => Button[]
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

        public move(dir: CursorDir) {
            this.makeGood()
            switch (dir) {
                case CursorDir.Up: {
                    if (this.row == 0) return undefined
                    this.row--
                    this.col = 0
                    break
                }
                case CursorDir.Down: {
                    if (this.row == this.buttonGroups.length - 1)
                        return undefined
                    this.row++
                    this.col = 0
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
}
