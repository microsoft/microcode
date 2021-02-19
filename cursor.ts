namespace kojac {

    function easeInOutSine(t: number): number {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    const LERP_SPEED = 10;

    export class Cursor extends Component {
        stylus: Kelpie;
        x: number;
        y: number;
        fromx: number;
        fromy: number;
        lerpt: number;
        hitbox: Bounds;

        public get pos() { return this.stylus.pos; }

        constructor(stage: Stage) {
            super(stage, "cursor");
            this.stylus = new Kelpie(stage, icons.get("cursor"));
            this.stylus.z = 100;
            // Small hitbox around the center of stylus.
            this.hitbox = new Bounds({
                width: 3,
                height: 3,
                left: -(this.stylus.width >> 1) - 1,
                top: -(this.stylus.height >> 1) - 1
            });
            this.x = this.fromx = this.stylus.x;
            this.y = this.fromy = this.stylus.y;
        }

        public moveTo(x: number, y: number) {
            // Setup to lerp to new position.
            this.fromx = this.x;
            this.fromy = this.y;
            this.x = x;
            this.y = y;
            this.lerpt = control.millis();
        }

        public snapTo(x: number, y: number) {
            this.x = this.fromx = this.stylus.x = x;
            this.y = this.fromy = this.stylus.y = y;
        }

        update(dt: number) {
            super.update(dt);
            // Need to lerp to new position?
            let dx = (this.stylus.x - this.x);
            let dy = (this.stylus.y - this.y);
            if (dx !== 0 || dy !== 0) {
                const t = Math.min(LERP_SPEED * (control.millis() - this.lerpt) / 1000, 1);
                if (Math.abs(dx) < 1) {
                    this.stylus.x = this.x;
                } else {
                    let distx = (this.x - this.fromx);
                    this.stylus.x = this.fromx + easeInOutSine(t) * distx;
                }
                if (Math.abs(dy) < 1) {
                    this.stylus.y = this.y;
                } else {
                    let disty = (this.y - this.fromy);
                    this.stylus.y = this.fromy + easeInOutSine(t) * disty;
                }
            }
        }
    }
}