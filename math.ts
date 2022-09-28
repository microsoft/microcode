namespace microcode {
    export class Vec2 {
        public dirty: boolean
        //public readonly: boolean;

        //% blockCombine block="x" callInDebugger
        public get x() {
            return this.x_
        }
        public set x(v) {
            //if (this.readonly) throw "hey";
            this.x_ = v
            this.dirty = true
        }

        //% blockCombine block="y" callInDebugger
        public get y() {
            return this.y_
        }
        public set y(v) {
            //if (this.readonly) throw "hey";
            this.y_ = v
            this.dirty = true
        }

        constructor(public x_ = 0, public y_ = 0) {}

        public clone(): Vec2 {
            return new Vec2(this.x, this.y)
        }

        public copyFrom(v: Vec2): this {
            this.x = v.x
            this.y = v.y
            return this
        }

        public set(x: number, y: number): this {
            this.x = x
            this.y = y
            return this
        }

        public magSq(): number {
            return this.x * this.x + this.y * this.y
        }

        public floor(): this {
            this.x = Math.floor(this.x)
            this.y = Math.floor(this.y)
            return this
        }

        public add(v: Vec2): this {
            this.x = this.x + v.x
            this.y = this.y + v.y
            return this
        }

        public static DistSq(a: Vec2, b: Vec2): number {
            const x = b.x - a.x
            const y = b.y - a.y
            return x * x + y * y
        }

        public static ZeroToRef(ref: Vec2): Vec2 {
            return ref.set(0, 0)
        }

        /*
        public static RotateToRef(v: Vec2, angle: number, ref: Vec2): Vec2 {
            const s = trig.sin(angle);
            const c = trig.cos(angle);
            const xp = Fx.sub(Fx.mul(v.x, c), Fx.mul(v.y, s));
            const yp = Fx.add(Fx.mul(v.x, s), Fx.mul(v.y, c));
            ref.x = xp;
            ref.y = yp;
            return ref;
        }
        */

        public static TranslateToRef(v: Vec2, p: Vec2, ref: Vec2): Vec2 {
            ref.x = v.x + p.x
            ref.y = v.y + p.y
            return ref
        }

        public static ScaleToRef(v: Vec2, scale: number, ref: Vec2): Vec2 {
            ref.x = v.x * scale
            ref.y = v.y * scale
            return ref
        }

        public static FloorToRef(v: Vec2, ref: Vec2): Vec2 {
            ref.x = Math.floor(v.x)
            ref.y = Math.floor(v.y)
            return ref
        }

        public static MaxToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Math.max(a.x, b.x)
            ref.y = Math.max(a.y, b.y)
            return ref
        }

        public static MinToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = Math.min(a.x, b.x)
            ref.y = Math.min(a.y, b.y)
            return ref
        }

        public static SubToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = a.x - b.x
            ref.y = a.y - b.y
            return ref
        }

        public static AddToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = a.x + b.x
            ref.y = a.y + b.y
            return ref
        }

        public static MulToRef(a: Vec2, b: Vec2, ref: Vec2): Vec2 {
            ref.x = a.x * b.x
            ref.y = a.y * b.y
            return ref
        }

        public static LerpToRefFix(a: Vec2, b: Vec2, t: number, ref: Vec2): Vec2 {
            ref.x = lerpFix(a.x, b.x, t);
            ref.y = lerpFix(a.y, b.y, t);
            return ref;
        }

        public static RandomRangeToRef(
            xmin: number,
            xmax: number,
            ymin: number,
            ymax: number,
            ref: Vec2
        ): Vec2 {
            ref.x = Math.randomRange(xmin, xmax)
            ref.y = Math.randomRange(ymin, ymax)
            return ref
        }

        public toString(): string {
            return `Vec2(x:${this.x},y:${this.y})`
        }
    }

    export function lerpFix(a: number, b: number, t: number): number {
        return a + (((b - a) * t) >> 8)
    }
}
