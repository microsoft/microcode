namespace microcode {
    export class CursorScene extends Scene {
        navigator: INavigator
        public cursor: Cursor
        public picker: Picker

        constructor(app: App) {
            super(app, "scene")
            this.color = 11
        }

        protected moveCursor(dir: CursorDir) {
            this.moveTo(this.cursor.move(dir))
        }

        protected moveTo(target: Button) {
            if (!target) return
            this.cursor.moveTo(
                target.xfrm.worldPos,
                target.ariaId,
                target.bounds
            )
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

            // click
            const click = () => this.cursor.click()
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.A.id,
                click
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                7 + controller.A.id,
                click
            )

            // back
            const back = () => {
                if (!this.cursor.cancel()) this.moveCursor(CursorDir.Back)
            }
            control.onEvent(
                ControllerButtonEvent.Pressed,
                controller.B.id,
                back
            )
            control.onEvent(
                ControllerButtonEvent.Pressed,
                7 + controller.B.id,
                back
            )

            this.cursor = new Cursor()
            this.picker = new Picker(this.cursor)
            this.navigator = new RowNavigator()
            this.cursor.navigator = this.navigator
        }

        protected handleClick(x: number, y: number) {
            const target = this.navigator.screenToButton(x, y)
            if (target) {
                this.moveTo(target)
                this.cursor.click()
            }
        }

        /* override */ shutdown() {
            this.navigator.clear()
        }

        /* override */ activate() {
            super.activate()
            const btn = this.navigator.initialCursor(0, 0)
            if (btn)
                this.cursor.snapTo(
                    btn.xfrm.worldPos.x,
                    btn.xfrm.worldPos.y,
                    btn.ariaId,
                    btn.bounds
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
