namespace kojac {
    export enum KelpieFlags {
        Invisible = 1 >> 0,
        Moved = 1 >> 1
    }

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
        private _flags: number;
        private _hitbox: Hitbox;
        private _moveHandlers: KelpieHandler[];

        //% blockCombine block="x" callInDebugger
        get x(): number { return this._x; }
        set x(v: number) {
            if (v !== this._x) {
                this._x = v;
                this._flags |= KelpieFlags.Moved;
            }
        }

        //% blockCombine block="y" callInDebugger
        get y(): number { return this._y; }
        set y(v: number) {
            if (v !== this._y) {
                this._y = v;
                this._flags |= KelpieFlags.Moved;
            }
        }

        //% blockCombine block="z" callInDebugger
        get z(): number { return this._z; }
        set z(v: number) {
            if (v !== this._z) {
                this._z = v;
                this.stage.needsSorting(this);
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

        //% blockCombine block="hitbox" callInDebugger
        get hitbox(): Hitbox { return this._hitbox; }
        set hitbox(v: Hitbox) { this._hitbox = v; }

        //% blockCombine block="invisible" callInDebugger
        get invisible() { return !!(this._flags & KelpieFlags.Invisible); }
        set invisible(b: boolean) { b ? this._flags |= KelpieFlags.Invisible : this._flags &= ~KelpieFlags.Invisible; }

        constructor(stage: Stage, layer: StageLayer, img: Image) {
            super(stage, layer, "kelpie");
            this._x = screen.width - (img.width >> 1);
            this._y = screen.height - (img.height >> 1);
            this.image = img; // initializes hitbox
        }

        public destroy() {
            this._image = undefined;
            this._hitbox = undefined;
            this._moveHandlers = undefined;
            super.destroy();
        }

        public onMoved(handler: KelpieHandler) {
            this._moveHandlers = this._moveHandlers || [];
            this._moveHandlers.push(handler);
        }

        protected setImage(img: Image) {
            this._image = img;
            this._hitbox = util.calculateHitbox(this);
        }

        private isOffScreen(drawOffset: Vec2): boolean {
            return (
                this.left - drawOffset.x > screen.width ||
                this.top - drawOffset.y > screen.height ||
                this.right - drawOffset.x < 0 ||
                this.bottom - drawOffset.y < 0);
        }

        private fireMoved() {
            const handlers = this._moveHandlers || [];
            for (const handler of handlers) {
                handler(this);
            }
        }

        update(dt: number) {
            if (this._flags & KelpieFlags.Moved) {
                this._flags &= ~KelpieFlags.Moved;
                this.fireMoved();
            }
        }

        draw(drawOffset: Vec2) {
            if (this.invisible) { return; }
            if (this.isOffScreen(drawOffset)) { return; }

            const left = this.left - drawOffset.x;
            const top = this.top - drawOffset.y;

            screen.drawTransparentImage(this._image, left, top);

            /* Render hitbox */
            const bounds = HitboxBounds.FromKelpie(this);
            screen.drawLine(bounds.left - drawOffset.x, bounds.top - drawOffset.y, bounds.right - drawOffset.x, bounds.top - drawOffset.y, 15);
            screen.drawLine(bounds.left - drawOffset.x, bounds.bottom - drawOffset.y, bounds.right - drawOffset.x, bounds.bottom - drawOffset.y, 15);
            screen.drawLine(bounds.left - drawOffset.x, bounds.top - drawOffset.y, bounds.left - drawOffset.x, bounds.bottom - drawOffset.y, 15);
            screen.drawLine(bounds.right - drawOffset.x, bounds.top - drawOffset.y, bounds.right - drawOffset.x, bounds.bottom - drawOffset.y, 15);
        }
    }
}