namespace microcode {
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

        public translate(p: Vec2): this {
            this.left += p.x;
            this.top += p.y;
            return this;
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

        public static FromImage(i: ImageG): Bounds {
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

        public static FromSprite(k: Sprite): Bounds {
            return Bounds.FromImage(k.image)
            .translate(new Vec2(-(k.width >> 1), -(k.height >> 1)))
            .translate(k.xfrm.worldPos);
        }

        public drawRect(color: number) {
            const top = this.top;
            const left = this.left;
            const right = this.right - 1;
            const bottom = this.bottom - 1;
            Screen.drawLine(left, top, right, top, color);
            Screen.drawLine(left, bottom, right, bottom, color);
            Screen.drawLine(left, top, left, bottom, color);
            Screen.drawLine(right, top, right, bottom, color);
        }

        public dbgRect(color: number) {
            const top = this.top;
            const left = this.left;
            const right = this.right;
            const bottom = this.bottom;
            Screen.drawLine(left, top, right, top, color);
            Screen.drawLine(left, bottom, right, bottom, color);
            Screen.drawLine(left, top, left, bottom, color);
            Screen.drawLine(right, top, right, bottom, color);
        }

        public fillRect(color: number) {
            Screen.fillRect(this.left, this.top, this.width, this.height, color);
        }
    }

    export class Occlusions {
        public get has(): boolean {
            return !!this.left || !!this.top || !!this.right || !!this.bottom;
        }

        constructor(
            public left: number,
            public top: number,
            public right: number,
            public bottom: number,
        ) {}

        public static FromSprite(s: Sprite, bounds: Bounds): Occlusions {
                const left = s.xfrm.worldPos.x - (s.width >> 1);
                const top = s.xfrm.worldPos.y - (s.height >> 1);
                const right = s.xfrm.worldPos.x + (s.width >> 1);
                const bottom = s.xfrm.worldPos.y + (s.height >> 1);
                return new Occlusions(
                    bounds.left > left ? bounds.left - left : 0,
                    bounds.top > top ? bounds.top - top : 0,
                    bounds.right < right ? right - bounds.right : 0,
                    bounds.bottom < bottom ? bottom - bounds.bottom : 0);
        }
    }
}