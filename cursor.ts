namespace microcode {
    export type CursorCancelHandler = () => void

    export enum CursorDir {
        Up,
        Down,
        Left,
        Right,
        Back,
    }

    export class Cursor extends Component implements IPlaceable {
        private xfrm_: Affine
        stylus: Sprite
        private hitbox_: Bounds
        navigator: INavigator
        cancelHandlerStack: CursorCancelHandler[]
        anim: Animation
        dest: Vec2
        ariaId: string

        public get xfrm() {
            return this.xfrm_
        }
        public get hitbox() {
            return Bounds.Translate(this.hitbox_, this.xfrm.worldPos)
        }

        constructor() {
            super("cursor")
            this.xfrm_ = new Affine()
            this.stylus = new Sprite({
                parent: this,
                img: icons.get("cursor"),
            })
            // Small hitbox around the pointer.
            this.hitbox_ = new Bounds({
                width: 3,
                height: 3,
                left: -3,
                top: -2,
            })
            this.cancelHandlerStack = []
            this.dest = new Vec2()
            this.anim = new Animation((p: Vec2) => this.animCallback(p))
        }

        private animCallback(p: Vec2) {
            this.xfrm.localPos = p
        }

        public moveTo(pos: Vec2, ariaId: string) {
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

        public snapTo(x: number, y: number, ariaId: string) {
            this.dest.x = this.xfrm.localPos.x = x
            this.dest.y = this.xfrm.localPos.y = y
            this.setAriaContent(ariaId)
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
        }

        /* override */ draw() {
            this.stylus.draw()
            //this.hitbox.dbgRect(15);
            if (this.ariaId) {
                const text = this.ariaId.toUpperCase()
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
                let y = this.xfrm.localPos.y + 6 + font.charHeight
                Screen.fillRect(x - 1, y - 1, w + 1, h + 2, 15)
                Screen.print(text, x, y, 1, font)
            }
        }
    }
}
