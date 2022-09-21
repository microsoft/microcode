// encapsulate navigation so we can try A/B
// experiment with cursor motion

// A. the existing navigation is based on euclidian distance using quadtree,
//    which loses structure of rules
// B. Use hierarchical navigation scheme based on program structure
// - Editor has
//    - Menu bar, with
//      - compile/run button, followed by
//      - page selector, followed by
//    = Page has list of
//      - Rule with
//        - When, sensor followed by filters, followed by
//        - DO, actuator followed by modifiers

// B can be handled pretty straightforwardly by have a list of list of buttons,
// where each rule is a list of buttons in order from left to right, same with
// menus

namespace microcode {
    export interface INavigator {
        clear: () => void
        addButtons: (btns: Button[]) => void
        move: (cursor: Cursor, dir: CursorDir) => Button
        getOverlapping: (cursor: Cursor) => Button[]
        initialCursor: (cursor: Cursor) => Button
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

        public move(cursor: Cursor, dir: CursorDir) {
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

        public getOverlapping(cursor: Cursor): Button[] {
            return [this.buttonGroups[this.row][this.col]]
        }

        protected makeGood() {
            if (this.row >= this.buttonGroups.length)
                this.row = this.buttonGroups.length - 1
            if (this.col >= this.buttonGroups[this.row].length)
                this.col = this.buttonGroups[this.row].length - 1
        }

        public initialCursor(cursor: Cursor) {
            this.row = 0
            this.col = 0
            return this.buttonGroups[0][0]
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

        public move(cursor: Cursor, dir: CursorDir) {
            const ret = super.move(cursor, dir)

            if (this.row > 0 && this.col == 0) {
                const ruleDef = this.rules[this.row - 1]

                const whensTileIds: string[] = []
                ruleDef.sensors.forEach(tile => whensTileIds.push(tile.tid))
                ruleDef.filters.forEach(tile => whensTileIds.push(tile.tid))

                const dosTileIds: string[] = []
                ruleDef.actuators.forEach(tile => dosTileIds.push(tile.tid))
                ruleDef.modifiers.forEach(tile => dosTileIds.push(tile.tid))

                let accessabilityMessage = {
                    type: "rule",
                    details: [
                        { name: "whens", values: whensTileIds },
                        { name: "dos", values: dosTileIds },
                    ],
                }

                accessibility.setLiveContent(accessabilityMessage)
            } else {
                let accessabilityMessage = {
                    type: "tile",
                    details: [
                        {
                            name: "tileId",
                            values: [(ret ? ret.ariaId : "") || ""],
                        },
                    ],
                }

                accessibility.setLiveContent(accessabilityMessage)
            }

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

        public move(cursor: Cursor, dir: CursorDir) {
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

        public initialCursor(cursor: Cursor) {
            this.row = 2 + (this.hasDelete() ? 1 : 0)
            this.col = 2

            let btn = this.buttonGroups[this.row][this.col]

            this.reportAccessibilityInfo(btn)

            return btn
        }

        reportAccessibilityInfo(btn: Button) {
            if (this.row == 0 && this.col == 0) {
                let accessabilityMessage = {
                    type: "text",
                    details: [
                        {
                            name: "message",
                            values: ["remove LED editor tile"],
                        },
                    ],
                }

                accessibility.setLiveContent(accessabilityMessage)

                return
            }

            let color = btn.getIcon()
            let status

            if (color == TID_MODIFIER_COLOR_RED) {
                status = "on"
            } else if (color == TID_MODIFIER_COLOR_DARKPURPLE) {
                status = "off"
            } else {
                status = "unkown"
            }

            let accessabilityMessage = {
                type: "text",
                details: [
                    {
                        name: "message",
                        values: [`led ${this.col} ${this.row} ${status}`],
                    },
                ],
            }

            accessibility.setLiveContent(accessabilityMessage)
        }
    }
}
