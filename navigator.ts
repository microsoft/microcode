namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (dir: CursorDir) => Button
        getCurrent: () => Button
        screenToButton: (x: number, y: number) => Button
        initialCursor: (row: number, col: number) => Button
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

    // ragged rows of buttons
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

    // mostly a matrix, except for last row, which may be ragged
    // also supports delete button 
    export class PickerNavigator implements INavigator {
        protected deleteButton: Button
        protected buttons: Button[]
        protected width: number
        protected row: number
        protected col: number

        constructor(width: number = 5) {
            this.width = width
            this.buttons = []
        }

        get hasDelete() {
            return !!this.deleteButton
        }

        private height() {
            return this.buttons.length / this.width
        }

        private currentRowWidth() {
            return this.row < this.height() - 1 ? this.width : this.buttons.length % this.width
        }

        private currentRowRagged() {
            return this.currentRowWidth() != this.width
        }

        public initialCursor(row: number = 0, col: number = 0): Button {
            this.row = row
            this.col = col
            const btn = this.getCurrent()
            if (btn) {
                this.reportAria(btn)
                return btn
            }
            return undefined
        }

        clear() {
            this.buttons = []
            this.deleteButton = undefined
        }

        addButtons(btns: Button[]) {
            this.buttons = this.buttons.concat(btns)
        }

        addDelete(btn: Button) {
            this.deleteButton = btn
        }

        getCurrent() {
            if (this.row == -1) { return this.deleteButton }
            else {
                const index = this.row * this.width + this.col
                if (index < this.buttons.length) return this.buttons[index]
            }
            return undefined
        }

        screenToButton(x: number, y: number) {
            const p = new Vec2(x, y)
            const target = this.buttons.find(btn =>
                Bounds.Translate(btn.bounds, btn.xfrm.worldPos).contains(p)
            )
            if (target) {
                const index = this.buttons.indexOf(target)
                this.row = index / this.width
                this.col = index % this.width
            }
            return target
        }

        move(dir: CursorDir) {
            switch (dir) {
                case CursorDir.Up: {
                    if (this.row > 0) this.row--
                    else if (this.deleteButton) this.row = -1
                    break
                }
                case CursorDir.Down: {
                    if (this.row < this.height() - 1) {
                        this.row++
                        if (this.currentRowRagged() && this.col >= this.currentRowWidth()) {
                            this.col = this.currentRowWidth() - 1
                        }
                    }
                    break
                }
                case CursorDir.Left: {
                    if (this.col > 0) this.col--
                    else if (this.row > 0) {
                        this.row--
                        this.col = this.width - 1
                    } else if (this.deleteButton) {
                        this.row = -1
                    }
                    break
                }
                case CursorDir.Right: {
                    if (this.row == -1) this.row = 0
                    else if (this.col < this.width - 1) this.col++
                    else if (this.row < this.height() -1) {
                        this.row++
                        this.col = 0
                    }
                    break
                }   
            }
            this.reportAria(this.getCurrent())
            return this.getCurrent()
        }
        
        public updateAria() {
            this.reportAria(this.getCurrent())
        }

        protected reportAria(btn: Button) {
            if (!btn) {
                return null
            }
            if (this.deleteButton && this.row == 0 && this.col == 0) {
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
    export class LEDNavigator extends PickerNavigator {
        constructor() {
            super()
            this.row = 2
            this.col = 2
        }
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
    export class MelodyNavigator extends PickerNavigator {
        constructor() {
            super()
            this.row = 2
            this.col = 2
        }
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
}
