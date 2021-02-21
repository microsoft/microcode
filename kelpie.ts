namespace kojac {
    export type KelpieHandler = (kelpie: Kelpie) => void;

    /**
     * A kelpie is a shape-shifting spirit inhabiting lakes in Scottish folklore.
     * It's basically a sprite.
     */
    export class Kelpie extends Component {
        private _x: number;
        private _y: number;
        private _z: number;
        private _image: Image;
        private _invisible: boolean;
        private _hud: boolean;

        //% blockCombine block="x" callInDebugger
        get x(): number { return this._x; }
        set x(v: number) {
            if (v !== this._x) {
                this._x = v;
            }
        }

        //% blockCombine block="y" callInDebugger
        get y(): number { return this._y; }
        set y(v: number) {
            if (v !== this._y) {
                this._y = v;
            }
        }

        //% blockCombine block="z" callInDebugger
        get z(): number { return this._z; }
        set z(v: number) {
            if (v !== this._z) {
                this._z = v;
                this.stage.setNeedsSorting();
            }
        }

        //% blockCombine block="pos" callInDebugger
        get pos(): Vec2 {
            return new Vec2(this.x, this.y);
        }
        set pos(v: Vec2) {
            this.x = v.x;
            this.y = v.y;
        }

        //% blockCombine block="width" callInDebugger
        get width() {
            return this._image.width;
        }
        //% blockCombine block="height" callInDebugger
        get height() {
            return this._image.height;
        }

        //% blockCombine block="left" callInDebugger
        get left() {
            return this.x - (this.width >> 1);
        }
        set left(value: number) {
            this.x = value + (this.width >> 1);
        }

        //% blockCombine block="right" callInDebugger
        get right() {
            return this.left + this.width;
        }
        set right(value: number) {
            this.x = value - (this.width >> 1);
        }

        //% blockCombine block="top" callInDebugger
        get top() {
            return this.y - (this.height >> 1);
        }
        set top(value: number) {
            this.y = value + (this.height >> 1);
        }

        //% blockCombine block="bottom" callInDebugger
        get bottom() {
            return this.top + this.height;
        }
        set bottom(value: number) {
            this.y = value - (this.height >> 1);
        }

        //% blockCombine block="image" callInDebugger
        get image(): Image {
            return this._image;
        }
        set image(img: Image) {
            this.setImage(img);
        }

        //% blockCombine block="invisible" callInDebugger
        get invisible() { return this._invisible; }
        set invisible(b: boolean) { this._invisible = b; }

        //% blockCombine block="hud" callInDebugger
        get hud() { return this._hud; }
        set hud(b: boolean) { this._hud = b; }

        constructor(stage: Stage, img: Image) {
            super(stage, "kelpie");
            this._x = screen.width - (img.width >> 1);
            this._y = screen.height - (img.height >> 1);
            this._z = 0;
            this.image = img; // initializes hitbox
        }

        public destroy() {
            this._image = undefined;
            super.destroy();
        }

        protected setImage(img: Image) {
            this._image = img;
        }

        private isOffScreen(drawOffset: Vec2): boolean {
            return (
                !this.hud &&
                this.left - drawOffset.x > screen.width ||
                this.top - drawOffset.y > screen.height ||
                this.right - drawOffset.x < 0 ||
                this.bottom - drawOffset.y < 0);
        }

        draw(drawOffset: Vec2) {
            if (this.invisible) { return; }

            if (this.hud) {
                drawOffset = new Vec2(0, 0);
            }

            if (this.isOffScreen(drawOffset)) { return; }

            const left = this.left - drawOffset.x;
            const top = this.top - drawOffset.y;

            screen.drawTransparentImage(this._image, left, top);
        }
    }
}