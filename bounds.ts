namespace kojac {
    export class Bounds {
        public width: number;
        public height: number;
        public left: number;
        public top: number;
        //% blockCombine block="right" callInDebugger
        public get right() { return this.left + this.width; }
        //% blockCombine block="bottom" callInDebugger
        public get bottom() { return this.top + this.height; }
        public get topLeft() { return new Vec2(this.left, this.top); }
        public get topRight() { return new Vec2(this.right, this.top); }
        public get bottomLeft() { return new Vec2(this.left, this.bottom); }
        public get bottomRight() { return new Vec2(this.right, this.bottom); }

        constructor(opts: {
            width: number,
            height: number,
            left: number,
            top: number
        }) {
            this.width = opts.width;
            this.height = opts.height;
            this.left = opts.left;
            this.top = opts.top;
        }

        public static Grow(box: Bounds, amount = 1): Bounds {
            return new Bounds({
                top: box.top - amount,
                left: box.left - amount,
                width: box.width + amount * 2,
                height: box.height + amount * 2
            });
        }

        public static Translate(box: Bounds, p: Vec2): Bounds {
            return new Bounds({
                left: box.left + p.x,
                top: box.top + p.y,
                width: box.width,
                height: box.height
            });
        }

        public static Intersects(a: Bounds, b: Bounds): boolean {
            if (b.contains(a.topLeft)) { return true; }
            if (b.contains(a.topRight)) { return true; }
            if (b.contains(a.bottomLeft)) { return true; }
            if (b.contains(a.bottomRight)) { return true; }
            if (a.contains(b.topLeft)) { return true; }
            if (a.contains(b.topRight)) { return true; }
            if (a.contains(b.bottomLeft)) { return true; }
            if (a.contains(b.bottomRight)) { return true; }
            return false;
        }

        public contains(p: Vec2): boolean {
            return (p.x >= this.left) && (p.x <= this.right) && (p.y >= this.top) && (p.y <= this.bottom);
        }

        public static FromImage(i: Image): Bounds {
            let left = i.width;
            let top = i.height;
            let right = 0;
            let bottom = 0;

            for (let c = 0; c < i.width; c++) {
                for (let r = 0; r < i.height; r++) {
                    if (i.getPixel(c, r)) {
                        left = Math.min(left, c);
                        top = Math.min(top, r);
                        right = Math.max(right, c);
                        bottom = Math.max(bottom, r);
                    }
                }
            }

            const width = right - left;
            const height = bottom - top;

            return new Bounds({ width, height, left, top });
        }

        public static FromKelpie(k: Kelpie): Bounds {
            let box = Bounds.FromImage(k.image);
            box = Bounds.Translate(box, new Vec2(-(k.width >> 1), -(k.height >> 1)));
            return box;
        }

        public drawRect(drawOffset: Vec2, color: number) {
            const top = this.top;
            const left = this.left;
            const right = this.right - 1;
            const bottom = this.bottom - 1;
            screen.drawLine(left - drawOffset.x, top - drawOffset.y, right - drawOffset.x, top - drawOffset.y, color);
            screen.drawLine(left - drawOffset.x, bottom - drawOffset.y, right - drawOffset.x, bottom - drawOffset.y, color);
            screen.drawLine(left - drawOffset.x, top - drawOffset.y, left - drawOffset.x, bottom - drawOffset.y, color);
            screen.drawLine(right - drawOffset.x, top - drawOffset.y, right - drawOffset.x, bottom - drawOffset.y, color);
        }

        public dbgRect(drawOffset: Vec2, color: number) {
            const top = this.top;
            const left = this.left;
            const right = this.right;
            const bottom = this.bottom;
            screen.drawLine(left - drawOffset.x, top - drawOffset.y, right - drawOffset.x, top - drawOffset.y, color);
            screen.drawLine(left - drawOffset.x, bottom - drawOffset.y, right - drawOffset.x, bottom - drawOffset.y, color);
            screen.drawLine(left - drawOffset.x, top - drawOffset.y, left - drawOffset.x, bottom - drawOffset.y, color);
            screen.drawLine(right - drawOffset.x, top - drawOffset.y, right - drawOffset.x, bottom - drawOffset.y, color);
        }

        public fillRect(drawOffset: Vec2, color: number) {
            screen.fillRect(this.left - drawOffset.x, this.top - drawOffset.y, this.width, this.height, color);
        }
    }
}