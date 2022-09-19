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
        move: (cursor: Cursor, dir: CursorDir) => void
        getOverlapping: (cursor: Cursor) => Button[]
        initialCursor: (cursor: Cursor) => void
    }

    export class RowNavigator implements INavigator {
        private buttonGroups: Button[][]
        private row: number
        private col: number

        constructor() {
            this.buttonGroups = []
        }

        // TODO: what if row, col is no longer in range?
        public clear() {
            this.buttonGroups = []
        }

        public addButtons(btns: Button[]) {
            this.buttonGroups.push(btns)
        }

        public move(cursor: Cursor, dir: CursorDir) {
            switch (dir) {
                case CursorDir.Up: {
                    if (this.row == 0) return
                    this.row--
                    this.col = 0
                    break
                }
                case CursorDir.Down: {
                    if (this.row == this.buttonGroups.length - 1) return
                    this.row++
                    this.col = 0
                    break
                }

                case CursorDir.Left: {
                    if (this.col == 0) return
                    this.col--
                    break
                }

                case CursorDir.Right: {
                    if (this.col == this.buttonGroups[this.row].length - 1)
                        return
                    this.col++
                    break
                }

                case CursorDir.Back: {
                    if (this.col > 0) this.col = 0
                    else if (this.row > 0) this.row--
                    break
                }
            }
            this.moveTo(cursor)
        }

        public getOverlapping(cursor: Cursor): Button[] {
            return [this.buttonGroups[this.row][this.col]]
        }

        private moveTo(cursor: Cursor) {
            // console.log(`row = ${this.row}, cpl = ${this.col}`)
            if (this.row >= this.buttonGroups.length)
                this.row = this.buttonGroups.length - 1
            if (this.col >= this.buttonGroups[this.row].length)
                this.col = this.buttonGroups[this.row].length - 1
            const btn = this.buttonGroups[this.row][this.col]
            if (btn) {
                cursor.moveTo(btn.xfrm.worldPos, btn.ariaId)
            }
        }

        public initialCursor(cursor: Cursor) {
            this.row = 0
            this.col = 0
            this.moveTo(cursor)
        }
    }
}
