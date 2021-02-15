namespace kojac {

    export const TILE_SIZE = 16;

    export class Cursor extends Component {
        private _bins: {[id: string]: Button[] };

        constructor(stage: Stage) {
            super(stage, "cursor");
            this._bins = {};
        }

        public add(button: Button) {
        }
    }
}