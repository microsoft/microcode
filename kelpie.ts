namespace kojac {
    export enum KelpieFlags {
        Invisible = 1 >> 0,
        HUD = 1 >> 1
    }

    export type KelpieHandler = (kelpie: Kelpie) => void;

    /**
     * A kelpie is a shape-shifting spirit inhabiting lakes in Scottish folklore.
     * It's basically a sprite.
     */
    export class Kelpie extends Component {
        private _x: Fx8
        private _y: Fx8
        private _z: number;
        private _image: Image;
        private _flags: number;
        private _hitbox: Hitbox;
        private _destroyHandlers: KelpieHandler[];
        private _moveHandlers: KelpieHandler[];
        private _moved: boolean;
        
        //% blockCombine block="x" callInDebugger
        get x(): number {
            return Fx.toFloat(this._x);
        }
        set x(v: number) {
            const fxv = Fx8(v);
            if (fxv !== this._x) {
                this._x = Fx8(v);
                this._moved = true;
            }
        }

        //% blockCombine block="y" callInDebugger
        get y(): number {
            return Fx.toFloat(this._y);
        }
        set y(v: number) {
            const fxv = Fx8(v);
            if (fxv !== this._y) {
                this._y = Fx8(v);
                this._moved = true;
            }
        }

        //% blockCombine block="y" callInDebugger
        get z(): number { return this._z; }
        set z(v: number) {
            this._z = v;
        }

        //% blockCombine block="x" callInDebugger
        get pos(): Vec2 {
            return new Vec2(this.x, this.y);
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

        //% blockCombine block="image" callInDebugger
        get image(): Image {
            return this._image;
        }
        set image(img: Image) {
            this.setImage(img);
        }

        //% blockCombine block="image" callInDebugger
        get hitbox(): Hitbox { return this._hitbox; }
        set hitbox(v: Hitbox) { this._hitbox = v; }

        //% blockCombine block="hud" callInDebugger
        get hud() { return !!(this._flags & KelpieFlags.HUD); }
        set hud(b: boolean) { b ? this._flags |= KelpieFlags.HUD : this._flags &= ~KelpieFlags.HUD; }

        //% blockCombine block="invisible" callInDebugger
        get invisible() { return !!(this._flags & KelpieFlags.Invisible); }
        set invisible(b: boolean) { b ? this._flags |= KelpieFlags.Invisible : this._flags &= ~KelpieFlags.Invisible; }

        constructor(stage: Stage, img: Image) {
            super(stage, "kelpie");
            this._x = Fx8(screen.width - (img.width >> 1));
            this._y = Fx8(screen.height - (img.height >> 1));
            this.image = img; // initializes hitbox
            this.onDestroy((k: Kelpie) => {
                this.stage.remove(this);
            });
        }

        public destroy() {
            const handlers = this._destroyHandlers || [];
            for (const handler of handlers) {
                handler(this);
            }
            this._image = undefined;
            this._hitbox = undefined;
            this._destroyHandlers = undefined;
        }

        public onDestroy(handler: KelpieHandler) {
            this._destroyHandlers = this._destroyHandlers || [];
            this._destroyHandlers.push(handler);
        }

        public onMoved(handler: KelpieHandler) {
            this._moveHandlers = this._moveHandlers || [];
            this._moveHandlers.push(handler);
        }

        protected setImage(img: Image) {
            this._image = img;
            this._hitbox = util.calculateHitbox(this);
        }

        private isOutOfScreen(camera: scene.Camera): boolean {
            const ox = (this.hud) ? 0 : camera.drawOffsetX;
            const oy = (this.hud) ? 0 : camera.drawOffsetY;
            return this.left - ox > screen.width || this.top - oy > screen.height || this.right - ox < 0 || this.bottom - oy < 0;
        }

        private fireMoved() {
            const handlers = this._moveHandlers|| [];
            for (const handler of handlers) {
                handler(this);
            }
        }

        __visible(): boolean {
            // Would be nice if the camera was passed in, for clip check.
            return !this.invisible;
        }

        __drawCore(camera: scene.Camera) {
            if (this.isOutOfScreen(camera)) { return; }

            const ox = (this.hud) ? 0 : camera.drawOffsetX;
            const oy = (this.hud) ? 0 : camera.drawOffsetY;

            const l = this.left - ox;
            const t = this.top - oy;

            screen.drawTransparentImage(this._image, l, t);

            /* Render hitbox
            const bounds = HitboxBounds.FromKelpie(this);
            screen.drawLine(bounds.left  - ox, bounds.top    - oy, bounds.right - ox, bounds.top    - oy, 15);
            screen.drawLine(bounds.left  - ox, bounds.bottom - oy, bounds.right - ox, bounds.bottom - oy, 15);
            screen.drawLine(bounds.left  - ox, bounds.top    - oy, bounds.left  - ox, bounds.bottom - oy, 15);
            screen.drawLine(bounds.right - ox, bounds.top    - oy, bounds.right - ox, bounds.bottom - oy, 15);
            */
        }

        __update(camera: scene.Camera, dt: number) {
            if (this._moved) {
                this._moved = false;
                this.fireMoved();
            }
        }
    }
}