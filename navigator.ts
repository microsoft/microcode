namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (dir: CursorDir) => Button
        getCurrent: () => Button
        screenToButton: (x: number, y: number) => Button
        initialCursor: (row: number, col: number) => Button
        finished: () => void
        updateAria: () => void
    }

    export const BACK_BUTTON_ERROR_KIND = "back_button"
    export const FORWARD_BUTTON_ERROR_KIND = "forward_button"
    export class NavigationError {
        kind: string
        constructor(kind: string) {
            this.kind = kind
        }
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

        public getRow() {
            return this.row
        }

        public addButtons(btns: Button[]) {
            this.buttonGroups.push(btns)
        }

        public finished() {}

        public screenToButton(x: number, y: number): Button {
            const p = new Vec2(x, y)
            for (let row = 0; row < this.buttonGroups.length; row++) {
                const buttons = this.buttonGroups[row]
                const target = buttons.find(btn =>
                    Bounds.Translate(btn.bounds, btn.xfrm.worldPos).contains(p)
                )
                if (target) {
                    this.row = row
                    this.col = buttons.indexOf(target)
                    return target
                }
            }
            return undefined
        }

        public move(dir: CursorDir) {
            this.makeGood()
            switch (dir) {
                case CursorDir.Up: {
                    if (this.row == 0)
                        throw new NavigationError(BACK_BUTTON_ERROR_KIND)
                    this.row--
                    // because the column in new row may be out of bounds
                    this.makeGood()
                    break
                }

                case CursorDir.Down: {
                    if (this.row == this.buttonGroups.length - 1)
                        throw new NavigationError(FORWARD_BUTTON_ERROR_KIND)
                    this.row++
                    // because the column in new row may be out of bounds
                    this.makeGood()
                    break
                }

                case CursorDir.Left: {
                    if (this.col == 0) {
                        if (this.row > 0) {
                            this.row--
                        } else {
                            this.row = this.buttonGroups.length - 1
                        }
                        this.col = this.buttonGroups[this.row].length - 1
                    } else this.col--
                    break
                }

                case CursorDir.Right: {
                    if (this.col == this.buttonGroups[this.row].length - 1) {
                        if (this.row < this.buttonGroups.length - 1) {
                            this.row++
                        } else {
                            this.row = 0
                        }
                        this.col = -1
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
            this.reportAria(btn)
            return btn
        }

        public updateAria() {
            this.reportAria(this.getCurrent())
        }

        protected reportAria(btn: Button) {
            if (btn) btn.reportAria(true)
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
            const rows = this.buttonGroups.length
            while (row < 0) row = (row + rows) % rows
            const cols = this.buttonGroups[row].length
            while (col < 0) col = (col + cols) % cols
            this.row = row
            this.col = col
            return this.buttonGroups[row][col]
        }
    }

    // this adds accessibility for rule
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
                    force: true,
                }
            }
            accessibility.setLiveContent(accessibilityMessage)
        }
    }

    // TODO: reimplement for a matrix represented by
    // TODO: a 1D array, with a givn matrix width such that
    // TODO: the length of the array is a multiple of the width
    // TODO: this will eventually let us get rid of buttons altogether
    //   class MatrixNavigator implements INavigator
    class MatrixNavigator extends RowNavigator {
        protected hasDelete: boolean

        public initialCursor(row: number = 0, col: number = 0) {
            this.hasDelete = this.buttonGroups[0].length == 1
            this.row = 2 + (this.hasDelete ? 1 : 0)
            this.col = 2
            const btn = this.buttonGroups[this.row][this.col]
            this.reportAria(btn)

            return btn
        }

        protected reportAria(btn: Button) {
            if (!btn) {
                return null
            }
            if (this.hasDelete && this.row == 0 && this.col == 0) {
                accessibility.setLiveContent(<
                    accessibility.TextAccessibilityMessage
                >{
                    type: "text",
                    value: "delete_tile",
                    force: true,
                })
                return null
            }
            return btn
        }
    }

    // accessibility for LEDs
    export class LEDNavigator extends MatrixNavigator {
        protected reportAria(b: Button): Button {
            const btn = super.reportAria(b)
            if (!btn) return null

            const on = btn.getIcon() == "solid_red"
            accessibility.setLiveContent(<
                accessibility.LEDAccessibilityMessage
            >{
                type: "led",
                on,
                x: this.col,
                y: this.row,
                force: true,
            })
            return null
        }
    }

    // accessibility for melody
    export class MelodyNavigator extends MatrixNavigator {
        protected reportAria(b: Button): Button {
            let btn = super.reportAria(b)
            if (!btn) return null
            const on = btn.getIcon() === "note_on"
            const index = this.hasDelete ? this.row - 1 : this.row
            accessibility.setLiveContent(<
                accessibility.NoteAccessibilityMessage
            >{
                type: "note",
                on,
                index,
                force: true,
            })
            return null
        }
    }

    // Why does this class exist? Because the Picker will
    // assign a grid layout to buttons, and we need to
    // navigate that grid. But as we know the column width
    // of the picker, we can optimization the navigation as
    // we can compute the row/column of each button

    // the exception is the delete button, which we can handle
    // as a special case, so I think we can get rid of the code below
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
            let currRow: Button[] = []
            this.buttons.sort((a, b) => a.xfrm.worldPos.y - b.xfrm.worldPos.y)
            this.buttons.forEach(btn => {
                if (
                    currRow.length == 0 ||
                    btn.xfrm.worldPos.y == currRow[0].xfrm.worldPos.y
                )
                    currRow.push(btn)
                else {
                    this.sortedButtons.push(currRow)
                    currRow = [btn]
                }
            })
            if (currRow.length) this.sortedButtons.push(currRow)
            // sort each row by x coordinate
            this.sortedButtons.forEach(btns =>
                btns.sort((a, b) => a.xfrm.worldPos.x - b.xfrm.worldPos.x)
            )
        }

        public move(dir: CursorDir): Button {
            const findNearInX = (btns: Button[], col: number) => {
                const nearInX = btns
                    .filter(
                        btn =>
                            Math.abs(
                                btn.xfrm.worldPos.x - this.curr.xfrm.worldPos.x
                            ) <
                            btn.width >> 1
                    )
                    .shift()
                if (!nearInX) return btns[col]
                return nearInX
            }
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
                            if (col < prevRow.length)
                                btn = findNearInX(prevRow, col)
                            else {
                                btn = prevRow[prevRow.length - 1]
                            }
                        } else {
                            throw new NavigationError(BACK_BUTTON_ERROR_KIND)
                        }
                        break
                    }
                    case CursorDir.Down: {
                        if (row < this.sortedButtons.length - 1) {
                            const nextRow = this.sortedButtons[row + 1]
                            if (col < nextRow.length)
                                btn = findNearInX(nextRow, col)
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
                        } else {
                            const prevRow =
                                this.sortedButtons[
                                    this.sortedButtons.length - 1
                                ]
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
                        } else {
                            const nextRow = this.sortedButtons[0]
                            btn = nextRow[0]
                        }
                        break
                    }
                }
            }

            if (btn) {
                btn.reportAria(true)
                this.curr = btn
            }

            return this.curr
        }

        public updateAria() {
            this.curr.reportAria(true)
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
