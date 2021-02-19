namespace kojac {

    export const TILE_SIZE = 16;

    export class Cursor extends Component {
        stylus: Kelpie;
        x: number;
        y: number;

        public get pos() { return this.stylus.pos; }
        public get hitbox() { return this.stylus.hitbox; }

        constructor(stage: Stage) {
            super(stage, StageLayer.World, "cursor");
            this.stylus = new Kelpie(stage, StageLayer.World, icons.get("cursor"));
            this.stylus.z = 100;
            this.stylus.hitbox = new Hitbox(3, 3, this.stylus.x - 1, this.stylus.y - 1);
            this.x = this.stylus.x;
            this.y = this.stylus.y;
        }

        public moveTo(button: Button) {
            this.x = button.x;
            this.y = button.y;
        }

        public snapTo(button: Button) {
            this.x = this.stylus.x = button.x;
            this.y = this.stylus.y = button.y;
        }

        update(dt: number) {
            let dx = (this.stylus.x - this.x);
            let dy = (this.stylus.y - this.y);
            if (dx !== 0) {
                this.stylus.x -= Math.min(2, Math.abs(dx)) * Math.sign(dx);
            }
            if (dy !== 0) {
                this.stylus.y -= Math.min(2, Math.abs(dy)) * Math.sign(dy);
            }
            
        }
    }
}