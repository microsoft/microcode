namespace microcode {
    export class Sprite extends Component implements IPlaceable, ISizable {
        private xfrm_: Affine
        image: Image
        invisible: boolean

        public get xfrm() {
            return this.xfrm_
        }
        public get width() {
            return this.image.width
        }
        public get height() {
            return this.image.height
        }
        public get hitbox() {
            return Bounds.FromSprite(this)
        }

        public get bounds() {
            let b = new Bounds({
                left: 0,
                top: 0,
                width: this.width,
                height: this.height,
            })
            return b.translate(
                new Vec2(-(this.width >> 1), -(this.height >> 1))
            )
        }

        constructor(opts: { parent?: IPlaceable; img: Image }) {
            super("sprite")
            this.xfrm_ = new Affine()
            this.xfrm_.parent = opts.parent && opts.parent.xfrm
            this.image = opts.img
        }

        /* override */ destroy() {
            this.image = undefined
            super.destroy()
        }

        protected setImage(img: Image) {
            this.image = img
        }

        public bindXfrm(xfrm: Affine) {
            this.xfrm_ = xfrm
        }

        public occlusions(bounds: Bounds) {
            return Occlusions.FromSprite(this, bounds)
        }

        public isOffScreen(): boolean {
            const p = this.xfrm.worldPos
            return (
                p.x + (this.width >> 1) < Screen.LEFT_EDGE ||
                p.y + (this.height >> 1) < Screen.TOP_EDGE ||
                p.x - (this.width >> 1) > Screen.RIGHT_EDGE ||
                p.y - (this.height >> 1) > Screen.BOTTOM_EDGE
            )
        }
        public isClipped(): boolean {
            const p = this.xfrm.worldPos
            return (
                p.x - (this.width >> 1) < Screen.LEFT_EDGE ||
                p.y - (this.height >> 1) < Screen.TOP_EDGE ||
                p.x + (this.width >> 1) > Screen.RIGHT_EDGE ||
                p.y + (this.height >> 1) > Screen.BOTTOM_EDGE
            )
        }

        /* override */ draw() {
            control.enablePerfCounter()
            if (this.invisible) {
                return
            }

            // perf: this is not really required anymore as rules are clipped vertically and tiles horizontally
            // if (this.isOffScreen()) {
            //    return
            //}

            Screen.drawTransparentImageXfrm(
                this.xfrm,
                this.image,
                -(this.image.width >> 1),
                -(this.image.height >> 1)
            )
            //this.hitbox.drawRect(15);
        }
    }

    const _pos: Vec2 = new Vec2(0, 0)
}
