namespace kojac {
    export type Bounds = {
        left: number;
        top: number;
        width: number;
        height: number;
    };

    export type Node = {
        bounds: Bounds;
        comp: Component;
    };

    export class QuadTree {
        private children: QuadTree[];
        private nodes: Node[];

        constructor(
            public bounds: Bounds,
            public maxObjects = 4,
            public maxLevels = 4,
            public level = 0
        ) {
            this.children = [];
            this.nodes = [];
        }

        public split() {
            const nextLevel = this.level + 1;
            const nextWidth = this.bounds.width >> 1;
            const nextHeight = this.bounds.height >> 1;
            const left = this.bounds.left;
            const top = this.bounds.top;

            // top right
            this.children[0] = new QuadTree({
                left: left + nextWidth,
                top: top,
                width: nextWidth,
                height: nextHeight
            }, this.maxObjects, this.maxLevels, nextLevel);

            // top left
            this.children[1] = new QuadTree({
                left: left,
                top: top,
                width: nextWidth,
                height: nextHeight
            }, this.maxObjects, this.maxLevels, nextLevel);

            // bottom left
            this.children[2] = new QuadTree({
                left: left,
                top: top + nextHeight,
                width: nextWidth,
                height: nextHeight
            }, this.maxObjects, this.maxLevels, nextLevel);

            // bottom right
            this.children[2] = new QuadTree({
                left: left + nextWidth,
                top: top + nextHeight,
                width: nextWidth,
                height: nextHeight
            }, this.maxObjects, this.maxLevels, nextLevel);
        }

        public getIndex(bounds: Bounds): number[] {
            const indices: number[] = [];
            const vertMidpoint = this.bounds.left + (this.bounds.width >> 1);
            const horzMidpoint = this.bounds.top + (this.bounds.height >> 1);

            return indices;
        }
    }
}