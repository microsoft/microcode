namespace microcode {
    export class CursorScene extends Scene {
        navigator: INavigator
        public cursor: Cursor
        public picker: Picker

        constructor(app: App) {
            super(app, "scene")
            this.color = 11
        }

        private moveCursor(dir: CursorDir) {
            const target = this.cursor.move(dir)

            if (!target) return

            this.cursor.moveTo(target.xfrm.worldPos, target.ariaId)
        }

        /* override */ startup() {
            super.startup()
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.right.id,
                () => this.moveCursor(CursorDir.Right)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.up.id,
                () => this.moveCursor(CursorDir.Up)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.down.id,
                () => this.moveCursor(CursorDir.Down)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.left.id,
                () => this.moveCursor(CursorDir.Left)
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                () => this.cursor.click()
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                () => {
                    if (!this.cursor.cancel()) this.moveCursor(CursorDir.Back)
                }
            )

            this.cursor = new Cursor()
            this.picker = new Picker(this.cursor)
            this.navigator = new RuleRowNavigator()
            this.cursor.navigator = this.navigator
        }

        /* override */ shutdown() {
            this.navigator.clear()
        }

        /* override */ activate() {
            const btn = this.navigator.initialCursor(this.cursor)
            if (btn)
                this.cursor.snapTo(
                    btn.xfrm.worldPos.x,
                    btn.xfrm.worldPos.y,
                    btn.ariaId
                )
        }

        /* override */ update() {
            this.cursor.update()
        }

        /* override */ draw() {
            this.picker.draw()
            this.cursor.draw()
        }
    }
}
