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

        //             this.cursor.moveTo(target.xfrm.worldPos, target.ariaId)
        constructor() {
            this.buttonGroups = []
        }

        public clear() {
            this.buttonGroups = []
        }

        public addButtons(btns: Button[]) {
            this.buttonGroups.push(btns)
        }
        public move(cursor: Cursor, dir: CursorDir) {}

        public getOverlapping(cursor: Cursor): Button[] {
            return []
        }

        public initialCursor(cursor: Cursor) {}
    }
}
