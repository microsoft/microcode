namespace kojac {

    export const TILE_SIZE = 16;

    export class Cursor extends Component {
        private quadtree: QuadTree;

        constructor(stage: Stage) {
            super(stage, StageLayer.World, "cursor");
            this.quadtree = new QuadTree({
                left: 0,
                top: 0,
                width: 2000,
                height: 4000
            });
        }

        public add(button: Button) {
            button.onDestroy(() => this.remove(button));
        }

        public remove(button: Button) {
            
        }

        public select(button: Button) {
            
        }
    }
}