namespace kojac {
    export class Screen {
        private static image_: ImageG;

        public static WIDTH = screen.width;
        public static HEIGHT = screen.height;
        public static HALF_WIDTH = screen.width >> 1;
        public static HALF_HEIGHT = screen.height >> 1;
        public static LEFT_EDGE = -Screen.HALF_WIDTH;
        public static RIGHT_EDGE = Screen.HALF_WIDTH;
        public static TOP_EDGE = -Screen.HALF_HEIGHT;
        public static BOTTOM_EDGE = Screen.HALF_HEIGHT;
        public static BOUNDS = new Bounds({
            left: Screen.LEFT_EDGE,
            top: Screen.TOP_EDGE,
            width: Screen.WIDTH,
            height: Screen.HEIGHT
        });

        public static x(v: number) { return v + Screen.HALF_WIDTH; }
        public static y(v: number) { return v + Screen.HALF_HEIGHT; }
        public static pos(v: Vec2) { return new Vec2(Screen.x(v.x), Screen.y(v.y)); }
        public static get image(): ImageG {
            if (!Screen.image_) { Screen.image_ = image.create(screen.width, screen.height); }
            return Screen.image_;
        }

        public static drawTransparentImage(from: ImageG, x: number, y: number) {
            Screen.image.drawTransparentImage(from, Screen.x(x), Screen.y(y));
        }

        public static drawLine(x0: number, y0: number, x1: number, y1: number, c: number) {
            Screen.image.drawLine(Screen.x(x0), Screen.y(y0), Screen.x(x1), Screen.y(y1), c);
        }

        public static fillRect(x: number, y: number, width: number, height: number, c: number) {
            Screen.image.fillRect(Screen.x(x), Screen.y(y), width, height, c);
        }

        public static print(text: string, x: number, y: number, color?: number, font?: image.Font, offsets?: texteffects.TextEffectState[]) {
            Screen.image.print(text, Screen.x(x), Screen.y(y), color, font, offsets);
        }
    }
}