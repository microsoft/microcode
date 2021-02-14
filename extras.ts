namespace kojac {
    export const TWO_PI = 2 * Math.PI;

    export class Hitbox {
        constructor(
            public width: number,
            public height: number,
            public minX: number,
            public minY: number) {}
    }

    export class HitboxBounds {
        //% blockCombine block="x" callInDebugger
        get width(): number { return this.right - this.left; }
        //% blockCombine block="x" callInDebugger
        get height(): number { return this.bottom - this.top; }
        //% blockCombine block="x" callInDebugger
        get center(): Vec2 { return mkVec2((this.left + this.right) >> 1, (this.top + this.bottom) >> 1); }

        constructor(
            public left: number,
            public right: number,
            public top: number,
            public bottom: number) { }

        public dup(): HitboxBounds {
            return new HitboxBounds(this.left, this.right, this.top, this.bottom);
        }

        public static FromKelpie(s: Kelpie): HitboxBounds {
            const box = s.hitbox;
            const left = Math.floor(s.x + box.minX);
            const top = Math.floor(s.y + box.minY);
            const right = Math.floor(left + box.width);
            const bottom = Math.floor(top + box.height);
            return new HitboxBounds(left, right, top, bottom);
        }

        public static Intersects(a: HitboxBounds, b: HitboxBounds): boolean {
            if (util.pointInHitboxBounds(a.left, a.top, b)) { return true; }
            if (util.pointInHitboxBounds(a.right, a.top, b)) { return true; }
            if (util.pointInHitboxBounds(a.left, a.bottom, b)) { return true; }
            if (util.pointInHitboxBounds(a.right, a.bottom, b)) { return true; }
            if (util.pointInHitboxBounds(b.left, b.top, a)) { return true; }
            if (util.pointInHitboxBounds(b.right, b.top, a)) { return true; }
            if (util.pointInHitboxBounds(b.left, b.bottom, a)) { return true; }
            if (util.pointInHitboxBounds(b.right, b.bottom, a)) { return true; }
            return false;
        }
    }

    export class util {
        public static pointInHitboxBounds(x: number, y: number, bounds: HitboxBounds): boolean {
            return (x >= bounds.left) && (x <= bounds.right) && (y >= bounds.top) && (y <= bounds.bottom);
        }

        public static pointInSprite(kel: kojac.Kelpie, x: number, y: number): boolean {
            const wOver2 = kel.width / 2;
            const hOver2 = kel.height / 2;
            return (x >= kel.x - wOver2) && (x <= kel.x + wOver2) && (y >= kel.y - hOver2) && (y <= kel.y + hOver2);
        }

        public static hitboxBoundsOverlap(a: HitboxBounds, b: HitboxBounds): boolean {
            const dimA = Math.max(a.width, a.height);
            const dimB = Math.max(b.width, b.height);
            const maxSq = dimA * dimA + dimB * dimB;
            const distSq = kojac.Vec2.MagnitudeSq(kojac.Vec2.Sub(a.center, b.center));
            // Are they safely too far apart?
            if (distSq > maxSq) { return false; }
            return HitboxBounds.Intersects(a, b);
        }

        public static centerSpriteOnSprite(src: kojac.Kelpie, dst: kojac.Kelpie) {
            src.x = dst.x;
            src.y = dst.y;
        }

        public static calculateHitbox(s: kojac.Kelpie): Hitbox {
            const i = s.image;
            let minX = i.width;
            let minY = i.height;
            let maxX = 0;
            let maxY = 0;

            for (let c = 0; c < i.width; c++) {
                for (let r = 0; r < i.height; r++) {
                    if (i.getPixel(c, r)) {
                        minX = Math.min(minX, c);
                        minY = Math.min(minY, r);
                        maxX = Math.max(maxX, c);
                        maxY = Math.max(maxY, r);
                    }
                }
            }

            const width = maxX - minX + 1;
            const height = maxY - minY + 1;

            return new Hitbox(width, height, minX, minY);
        }

        public static distSqBetweenSprites(a: kojac.Kelpie, b: kojac.Kelpie): number {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            return (dx * dx) + (dy * dy);
        }

        public static distBetweenSprites(a: kojac.Kelpie, b: kojac.Kelpie): number {
            return Math.sqrt(this.distSqBetweenSprites(a, b));
        }

        public static rotationFromDirection(dx: number, dy: number): number {
            // Assumes dx/dy is normalized.
            let angle = Math.acos(dx);
            if (dy < 0) {
                angle = TWO_PI - angle;
            }
            return angle;
        }
    }
}