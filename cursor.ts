namespace microcode {
    export type CursorCancelHandler = () => void

    export enum CursorDir {
        Up,
        Down,
        Left,
        Right,
        Back,
    }

    export type CursorState = {
        navigator: INavigator
        pos: Vec2
        ariaId: string
        size: Bounds
    }

    export class Cursor extends Component implements IPlaceable {
        private xfrm_: Affine
        navigator: INavigator
        cancelHandlerStack: CursorCancelHandler[]
        moveStartMs: number
        moveDest: Vec2
        ariaId: string
        size: Bounds
        cycle: number
        visible = true

        public get xfrm() {
            return this.xfrm_
        }

        constructor() {
            super("cursor")
            this.xfrm_ = new Affine()
            this.cancelHandlerStack = []
            this.moveDest = new Vec2()
            this.cycle = 1
            this.setSize()
        }

        public moveTo(pos: Vec2, ariaId: string, sizeHint: Bounds) {
            this.setSize(sizeHint)
            this.moveDest.copyFrom(pos)
            this.moveStartMs = control.millis()
            this.setAriaContent(ariaId)
        }

        private setAriaContent(ariaId: string) {
            this.ariaId = ariaId || ""
        }

        public snapTo(x: number, y: number, ariaId: string, sizeHint: Bounds) {
            this.setSize(
                sizeHint ||
                    new Bounds({ left: 0, top: 0, width: 16, height: 16 })
            )
            this.moveDest.x = this.xfrm.localPos.x = x
            this.moveDest.y = this.xfrm.localPos.y = y
            this.setAriaContent(ariaId)
        }

        public setSize(size?: Bounds) {
            size =
                size || new Bounds({ left: 0, top: 0, width: 16, height: 16 })
            if (this.size) this.size.copyFrom(size)
            else this.size = size.clone()
        }

        public saveState(): CursorState {
            return {
                navigator: this.navigator,
                pos: this.xfrm.localPos.clone(),
                ariaId: this.ariaId,
                size: this.size.clone(),
            }
        }

        public restoreState(state: CursorState) {
            this.navigator = state.navigator
            this.xfrm.localPos.copyFrom(state.pos)
            this.moveDest.copyFrom(state.pos)
            this.ariaId = state.ariaId
            this.size.copyFrom(state.size)
        }

        public move(dir: CursorDir): Button {
            return this.navigator.move(this, dir)
        }

        public click(): boolean {
            let overlapping = this.navigator.getOverlapping(this) //.sort((a, b) => a.z - b.z);
            if (overlapping.length) {
                const btn = overlapping.shift()
                btn.click()
                return true
            }
            return false
        }

        public cancel(): boolean {
            if (this.cancelHandlerStack.length) {
                this.cancelHandlerStack[this.cancelHandlerStack.length - 1]()
                return true
            }
            return false
        }

        /* override */ destroy() {
            this.navigator = undefined
            super.destroy()
        }

        /* override */ update() {
            super.update()

            const currTimeMs = control.millis()
            const elapsedTimeMs = currTimeMs - this.moveStartMs
            const pctTime = elapsedTimeMs / 50

            if (pctTime < 1) {
                Vec2.LerpToRef(this.xfrm.localPos, this.moveDest, pctTime, this.xfrm.localPos)
            } else {
                this.xfrm.localPos.copyFrom(this.moveDest)
            }

            this.cycle = currTimeMs % 1000 < 500 ? 1 : 0
        }

        /* override */ draw() {
            if (!this.visible) return
            
            const text = accessibility.ariaToTooltip(this.ariaId)
            if (text) {
                const n = text.length
                const font = image.font5
                const w = font.charWidth * n
                const h = font.charHeight
                let x = Math.max(
                    Screen.LEFT_EDGE + 1,
                    Math.min(
                        Screen.RIGHT_EDGE - 1,
                        this.xfrm.localPos.x - (w >> 1)
                    )
                )
                let y = this.xfrm.localPos.y + 7 + font.charHeight
                Screen.fillRect(x - 1, y - 1, w + 1, h + 2, 15)
                Screen.print(text, x, y, 1, font)
            }
            Screen.outlineBoundsXfrm(
                this.xfrm,
                this.size,
                1,
                this.cycle ? 6 : 9
            )
            Screen.outlineBoundsXfrm(
                this.xfrm,
                this.size,
                2,
                this.cycle ? 9 : 6
            )
        }
    }
}
