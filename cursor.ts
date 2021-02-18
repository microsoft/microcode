namespace kojac {

    export const TILE_SIZE = 16;

    export class Cursor extends Component {
        stylus: Kelpie;

        constructor(stage: Stage) {
            super(stage, StageLayer.World, "cursor");
            this.stylus = new Kelpie(stage, StageLayer.World, icons.get("cursor"));
            this.stylus.z = 100;
        }

        public select(button: Button) {
            this.stylus.pos = button.pos;
        }
    }
}