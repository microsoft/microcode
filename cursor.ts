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
        anim: Animation
        dest: Vec2
        ariaId: string
        size: Bounds
        cycle: number

        public get xfrm() {
            return this.xfrm_
        }

        constructor() {
            super("cursor")
            this.xfrm_ = new Affine()
            this.cancelHandlerStack = []
            this.dest = new Vec2()
            this.anim = new Animation((p: Vec2) => this.animCallback(p))
            this.cycle = 1
            this.setSize()
        }

        private animCallback(p: Vec2) {
            this.xfrm.localPos = p
        }

        public moveTo(pos: Vec2, ariaId: string, sizeHint: Bounds) {
            this.setSize(sizeHint)
            this.dest.copyFrom(pos)
            this.anim.clearFrames()
            this.anim.addFrame(
                new EaseFrame({
                    duration: 0.05,
                    //curve: curves.easeOut(curves.easing.sq2),
                    curve: curves.linear(),
                    startValue: this.xfrm.localPos,
                    endValue: this.dest,
                })
            )
            this.anim.start()
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
            this.dest.x = this.xfrm.localPos.x = x
            this.dest.y = this.xfrm.localPos.y = y
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
            this.ariaId = state.ariaId
            this.size.copyFrom(state.size)
        }

        public move(dir: CursorDir): Button {
            if (this.anim && this.anim.playing) return undefined
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
            if (this.anim) {
                this.anim.update()
            }
            const t = control.millis()
            this.cycle = t % 1000 < 500 ? 1 : 0
        }

        /* override */ draw() {
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
