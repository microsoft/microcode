namespace kojac {

    export const TILE_SIZE = 16;

    function easeInOutSine(x: number): number {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    export class Cursor extends Component {
        stylus: Kelpie;
        x: number;
        y: number;
        fromx: number;
        fromy: number;
        lerpt: number;

        public get pos() { return this.stylus.pos; }
        public get hitbox() { return this.stylus.hitbox; }

        constructor(stage: Stage) {
            super(stage, "cursor");
            this.stylus = new Kelpie(stage, icons.get("cursor"));
            this.stylus.z = 100;
            this.stylus.hitbox = new Hitbox(3, 3, (this.stylus.width >> 1) - 1, (this.stylus.height >> 1) - 1);
            this.x = this.fromx = this.stylus.x;
            this.y = this.fromy = this.stylus.y;
        }

        public moveTo(x: number, y: number) {
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
            let dx = (this.stylus.x - this.x);
            let dy = (this.stylus.y - this.y);
            if (dx !== 0 || dy !== 0) {
                const t = Math.min(10 * (control.millis() - this.lerpt) / 1000, 1);
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