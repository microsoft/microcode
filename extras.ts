namespace util {
    export const TWO_PI = 2 * Math.PI;

    export function pointInHitboxBounds(x: number, y: number, bounds: HitboxBounds): boolean {
        return (x >= bounds.left) && (x <= bounds.right) && (y >= bounds.top) && (y <= bounds.bottom);
    }

    export function pointInSprite(kel: kojac.Kelpie, x: number, y: number): boolean {
        const wOver2 = kel.width / 2;
        const hOver2 = kel.height / 2;
        return (x >= kel.x - wOver2) && (x <= kel.x + wOver2) && (y >= kel.y - hOver2) && (y <= kel.y + hOver2);
    }

    export function hitboxBoundsOverlap(a: HitboxBounds, b: HitboxBounds): boolean {
        const dimA = Math.max(a.width, a.height);
        const dimB = Math.max(b.width, b.height);
        const maxSq = dimA * dimA + dimB * dimB;
        const distSq = kojac.Vec2.MagnitudeSq(kojac.Vec2.Sub(a.center, b.center));
        // Are they safely too far apart?
        if (distSq > maxSq) { return false; }
        return HitboxBounds.Intersects(a, b);
    }

    export function getAllOverlapping(src: kojac.Kelpie): kojac.Kelpie[] {
        const srcHitbox = src.data["_hitbox"] || (src.data["_hitbox"] = calculateHitbox(src));
        const srcHitboxBounds = new HitboxBounds(src);
        const scene = game.currentScene();
        let kelpies = scene.allSprites as kojac.Kelpie[];
        kelpies = kelpies
            .filter(value => value["_data"] && value["_data"]["kelpie"] !== undefined) // hack: filter to kojac.Kelpie type
            .filter(value => value && value !== src);
        kelpies = kelpies
            .filter(value => !value.invisible)
            .filter(value => {
                const valHitboxBounds = new HitboxBounds(value);
                return hitboxBoundsOverlap(valHitboxBounds, srcHitboxBounds);
            })
            .sort((a, b) => (a.x - b.x) + (a.y - b.y));
        return kelpies;
    }

    export function centerSpriteOnSprite(src: kojac.Kelpie, dst: kojac.Kelpie) {
        src.x = dst.x;
        src.y = dst.y;
    }

    export class Hitbox {
        constructor(
            public width: number,
            public height: number,
            public minX: number,
            public minY: number) {}
    }

    export class HitboxBounds {
        top: number;
        left: number;
        right: number;
        bottom: number;

        get width(): number { return this.right - this.left; }
        get height(): number { return this.bottom - this.top; }
        get center(): kojac.Vec2 { return kojac.mkVec2((this.left + this.right) >> 1, (this.top + this.bottom) >> 1); }
        
        constructor(s: kojac.Kelpie) {
            const box = s.data["_hitbox"] || (s.data["_hitbox"] = calculateHitbox(s));
            this.left = s.x + box.minX;
            this.top = s.y + box.minY;
            this.right = this.left + box.width;
            this.bottom = this.top + box.height;
        }

        public static Intersects(a: HitboxBounds, b: HitboxBounds): boolean {
            if (pointInHitboxBounds(a.left, a.top, b)) { return true; }
            if (pointInHitboxBounds(a.right, a.top, b)) { return true; }
            if (pointInHitboxBounds(a.left, a.bottom, b)) { return true; }
            if (pointInHitboxBounds(a.right, a.bottom, b)) { return true; }
            if (pointInHitboxBounds(b.left, b.top, a)) { return true; }
            if (pointInHitboxBounds(b.right, b.top, a)) { return true; }
            if (pointInHitboxBounds(b.left, b.bottom, a)) { return true; }
            if (pointInHitboxBounds(b.right, b.bottom, a)) { return true; }
            return false;
        }
    }

    export function calculateHitbox(s: kojac.Kelpie): Hitbox {
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

    export function distSqBetweenSprites(a: kojac.Kelpie, b: kojac.Kelpie): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return (dx * dx) + (dy * dy);
    }

    export function distBetweenSprites(a: kojac.Kelpie, b: kojac.Kelpie): number {
        return Math.sqrt(distSqBetweenSprites(a, b));
    }

    export function rotationFromDirection(dx: number, dy: number): number {
        // Assumes dx/dy is normalized.
        let angle = Math.acos(dx);
        if (dy < 0) {
            angle = TWO_PI - angle;
        }
        return angle;
    }
}