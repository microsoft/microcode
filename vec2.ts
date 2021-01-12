namespace kojac {
    export class Vec2 {
        constructor(public x: number, public y: number) { }

        public static Add(a: Vec2, b: Vec2): Vec2 {
            return new Vec2(
                a.x + b.x,
                a.y + b.y
            );
        }

        public static Sub(a: Vec2, b: Vec2): Vec2 {
            return new Vec2(
                a.x - b.x,
                a.y - b.y
            );
        }

        public static Mul(a: Vec2, b: Vec2): Vec2 {
            return new Vec2(
                a.x * b.x,
                a.y * b.y
            );
        }

        public static Sign(v: Vec2): Vec2 {
            return new Vec2(
                v.x < 0 ? -1 : 1,
                v.y < 0 ? -1 : 1
            );
        }

        public static Abs(v: Vec2): Vec2 {
            return new Vec2(
                Math.abs(v.x),
                Math.abs(v.y)
            );
        }

        public static Transpose(v: Vec2): Vec2 {
            return new Vec2(v.y, v.x);
        }

        public static Neg(v: Vec2): Vec2 {
            return new Vec2(-v.x, -v.y);
        }

        public static Normal(v: Vec2, mag?: number): Vec2 {
            if (!mag) {
                const magSq = (v.x * v.x + v.y * v.y);
                if (magSq === 1) { return v; }
                mag = Math.sqrt(magSq);
            }
            return new Vec2(
                v.x / mag,
                v.y / mag
            );
        }

        public static Scale(v: Vec2, scalar: number): Vec2 {
            return new Vec2(
                v.x * scalar,
                v.y * scalar
            );
        }

        public static Magnitude(v: Vec2): number {
            const magSq = (v.x * v.x + v.y * v.y);
            return Math.sqrt(magSq);
        }

        public static MagnitudeSq(v: Vec2): number {
            return (v.x * v.x + v.y * v.y);
        }

        public static Dot(a: Vec2, b: Vec2): number {
            return a.x * b.x + a.y * b.y;
        }

        public static Determinant(a: Vec2, b: Vec2): number {
            return a.x * b.y - a.y - b.x;
        }
    }

    export function mkVec2(x = 0, y = 0): Vec2 {
        return new Vec2(x, y);
    }

}
