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

        /*

         const occ = target.occlusions(
                new Bounds({
                    left: Screen.LEFT_EDGE,
                    top: Screen.TOP_EDGE + TOOLBAR_HEIGHT + 2,
                    width: Screen.WIDTH,
                    height: Screen.HEIGHT - (TOOLBAR_HEIGHT + 2),
                })
            )
            if (occ.has) {
                if (this.scrollanim.playing) {
                    return
                }
                const xocc = occ.left ? occ.left : -occ.right
                const yocc = occ.top ? occ.top : -occ.bottom
                const endValue = Vec2.TranslateToRef(
                    this.scrollroot.xfrm.localPos,
                    new Vec2(xocc, yocc),
                    new Vec2()
                )
                this.scrollanim.clearFrames()
                this.scrollanim.addFrame(
                    new EaseFrame({
                        duration: 0.05,
                        //curve: curves.easeOut(curves.easing.sq2),
                        curve: curves.linear(),
                        startValue: this.scrollroot.xfrm.localPos,
                        endValue,
                    })
                )
                this.scrollanim.start()
                const dest = new Vec2(
                    target.xfrm.worldPos.x + xocc,
                    target.xfrm.worldPos.y + yocc
                )
                this.cursor.moveTo(dest, target.ariaId)

                */

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

        private makeGood() {
            if (this.row >= this.buttonGroups.length)
                this.row = this.buttonGroups.length - 1
            if (this.col >= this.buttonGroups[this.row].length)
                this.col = this.buttonGroups[this.row].length - 1
        }

        protected moveTo(cursor: Cursor) {
            this.makeGood()
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

        protected moveTo(cursor: Cursor) {
            super.moveTo(cursor)
            if (this.row > 0 && this.col == 0) {
                // special case for beginning of rule
                const ruleDef = this.rules[this.row - 1]
                // PELI: ACCESSIBILITY
                console.log("PELI and ALEX")
                // WHEN
                ruleDef.sensors.forEach(tile => tile.tid)
                ruleDef.filters.forEach(tile => tile.tid)
                // DO
                ruleDef.actuators.forEach(tile => tile.tid)
                ruleDef.modifiers.forEach(tile => tile.tid)
            }
        }
    }
}
