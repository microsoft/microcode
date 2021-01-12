namespace kojac {
    export enum KelpieFlags {
        Invisible = 1 >> 0,
        HUD = 1 >> 1,
    }

    /**
     * A Kelpie is a sprite-like entity.
     */
    export class Kelpie extends sprites.BaseSprite {
        private _x: Fx8
        private _y: Fx8
        private _image: Image;
        private _data: any;
        private _flags: number;

        onUpdate: (dt: number) => void;

        //% blockCombine block="x" callInDebugger
        get x(): number {
            return Fx.toFloat(this._x);
        }
        set x(v: number) {
            this._x = Fx8(v);
        }

        //% blockCombine block="y" callInDebugger
        get y(): number {
            return Fx.toFloat(this._y);
        }
        set y(v: number) {
            this._y = Fx8(v);
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
            this.x = value - (this.width >> 1);
        }

        //% blockCombine block="right" callInDebugger
        get right() {
            return this.left + this.width;
        }

        //% blockCombine block="top" callInDebugger
        get top() {
            return this.y - (this.height >> 1);
        }
        set top(value: number) {
            this.y = value + (this.width >> 1);
        }

        //% blockCombine block="bottom" callInDebugger
        get bottom() {
            return this.top + this.height;
        }

        get data(): any {
            if (!this._data) this._data = {};
            return this._data;
        }
        set data(value: any) {
            this._data = value;
        }

        //% blockCombine block="image" callInDebugger
        get image(): Image {
            return this._image;
        }
        setImage(img: Image) {
            if (!img) return;
            this._image = img;
        }

        //% blockCombine block="hud" callInDebugger
        get hud() { return !!(this._flags & KelpieFlags.HUD); }
        set hud(b: boolean) { b ? this._flags |= KelpieFlags.HUD : this._flags &= ~KelpieFlags.HUD; }

        //% blockCombine block="invisible" callInDebugger
        get invisible() { return !!(this._flags & KelpieFlags.Invisible); }
        set invisible(b: boolean) { b ? this._flags |= KelpieFlags.Invisible : this._flags &= ~KelpieFlags.Invisible; }

        constructor(img: Image) {
            super(scene.SPRITE_Z);
            this._x = Fx8(screen.width - (img.width >> 1));
            this._y = Fx8(screen.height - (img.height >> 1));
            this.data["kelpie"] = 1; // hack for typecheck in getOverlapping
            this.setImage(img);
        }

        public destroy() {
            const scene = game.currentScene();
            scene.allSprites.removeElement(this);
            this._image = undefined;
        }

        isOutOfScreen(camera: scene.Camera): boolean {
            const ox = (this.hud) ? 0 : camera.drawOffsetX;
            const oy = (this.hud) ? 0 : camera.drawOffsetY;
            return this.left - ox > screen.width || this.top - oy > screen.height || this.right - ox < 0 || this.bottom - oy < 0;
        }

        __visible(): boolean {
            // Would be nice if the camera was passed in, for clip check.
            return !this.invisible;
        }

        __drawCore(camera: scene.Camera) {
            if (this.isOutOfScreen(camera)) return;

            const ox = (this.hud) ? 0 : camera.drawOffsetX;
            const oy = (this.hud) ? 0 : camera.drawOffsetY;

            const l = this.left - ox;
            const t = this.top - oy;

            screen.drawTransparentImage(this._image, l, t);
        }

        __update(camera: scene.Camera, dt: number) {
            // Hm, dt is always 0.
            if (this.onUpdate) { this.onUpdate(dt); }
        }
    }
}