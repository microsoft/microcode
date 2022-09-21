namespace microcode {
    export class Sprite extends Component implements IPlaceable, ISizable {
        private xfrm_: Affine
        private image_: ImageG
        private invisible_: boolean

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() {
            return this.xfrm_
        }
        //% blockCombine block="width" callInDebugger
        public get width() {
            return this.image_.width
        }
        //% blockCombine block="height" callInDebugger
        public get height() {
            return this.image_.height
        }
        //% blockCombine block="image" callInDebugger
        public get image(): ImageG {
            return this.image_
        }
        public set image(img: ImageG) {
            this.setImage(img)
        }
        //% blockCombine block="invisible" callInDebugger
        public get invisible() {
            return this.invisible_
        }
        public set invisible(b: boolean) {
            this.invisible_ = b
        }
        //% blockCombine block="hitbox" callInDebugger
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
            return b.translate(new Vec2(-(this.width >> 1), -(this.height >> 1)))
        }

        constructor(opts: { parent?: IPlaceable; img: ImageG }) {
            super("sprite")
            this.xfrm_ = new Affine()
            this.xfrm_.parent = opts.parent && opts.parent.xfrm
            this.image = opts.img
        }

        /* override */ destroy() {
            this.image_ = undefined
            super.destroy()
        }

        protected setImage(img: ImageG) {
            this.image_ = img
        }

        public bindXfrm(xfrm: Affine) {
            this.xfrm_ = xfrm
        }

        public occlusions(bounds: Bounds) {
            return Occlusions.FromSprite(this, bounds)
        }

        public isOffScreen(): boolean {
            return (
                this.xfrm.worldPos.x + (this.width >> 1) < Screen.LEFT_EDGE ||
                this.xfrm.worldPos.y + (this.height >> 1) < Screen.TOP_EDGE ||
                this.xfrm.worldPos.x - (this.width >> 1) > Screen.RIGHT_EDGE ||
                this.xfrm.worldPos.y - (this.height >> 1) > Screen.BOTTOM_EDGE
            )
        }

        public isClipped(): boolean {
            return (
                this.xfrm.worldPos.x - (this.width >> 1) < Screen.LEFT_EDGE ||
                this.xfrm.worldPos.y - (this.height >> 1) < Screen.TOP_EDGE ||
                this.xfrm.worldPos.x + (this.width >> 1) > Screen.RIGHT_EDGE ||
                this.xfrm.worldPos.y + (this.height >> 1) > Screen.BOTTOM_EDGE
            )
        }

        /* override */ draw() {
            if (this.invisible) {
                return
            }
            if (this.isOffScreen()) {
                return
            }
            Screen.drawTransparentImageXfrm(
                this.xfrm,
                this.image_,
                -(this.image_.width >> 1),
                -(this.image_.height >> 1)
            )
            //this.hitbox.drawRect(15);
        }
    }

    const _pos: Vec2 = new Vec2(0, 0)
}
