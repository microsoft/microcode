namespace kojac {

    interface Node {
        bounds: Bounds;
        comp: Component;
    };

    // QuadTree for spatial indexing of objects.
    // https://en.wikipedia.org/wiki/Quadtree
    export class QuadTree {
        private quads: QuadTree[];
        private nodes: Node[];

        constructor(
            public bounds: Bounds,      // Max bounds of the indexed space.
            public maxObjects = 3,      // Max objects per-level before split attempt.
            public minDimension = 16    // Min size of a cell. Cannot split below this size.
        ) {
            this.quads = [];
            this.nodes = [];
        }

        public forEach(cb: (bounds: Bounds) => void) {
            if (this.quads.length) {
                for (let i = 0; i < this.quads.length; ++i) {
                    this.quads[i].forEach(cb);
                }
            } else {
                cb(this.bounds);
            }
        }

        private trySplit(): boolean {
            if (this.quads.length) { return false; }
            const nextWidth = this.bounds.width >> 1;
            if (nextWidth < this.minDimension) { return false; }
            const nextHeight = this.bounds.height >> 1;
            if (nextHeight < this.minDimension) { return false; }
            const left = this.bounds.left;
            const top = this.bounds.top;

            // top-right
            this.quads[0] = new QuadTree(new Bounds({
                left: left + nextWidth,
                top: top,
                width: nextWidth,
                height: nextHeight
            }), this.maxObjects, this.minDimension);

            // top-left
            this.quads[1] = new QuadTree(new Bounds({
                left: left,
                top: top,
                width: nextWidth,
                height: nextHeight
            }), this.maxObjects, this.minDimension);

            // bottom-left
            this.quads[2] = new QuadTree(new Bounds({
                left: left,
                top: top + nextHeight,
                width: nextWidth,
                height: nextHeight
            }), this.maxObjects, this.minDimension);

            // bottom-right
            this.quads[3] = new QuadTree(new Bounds({
                left: left + nextWidth,
                top: top + nextHeight,
                width: nextWidth,
                height: nextHeight
            }), this.maxObjects, this.minDimension);

            return true;
        }

        private getIndices(bounds: Bounds): number[] {
            const indices: number[] = [];
            const vertMidpoint = this.bounds.left + (this.bounds.width >> 1);
            const horzMidpoint = this.bounds.top + (this.bounds.height >> 1);

            const startIsNorth = bounds.top < horzMidpoint;
            const startIsWest = bounds.left < vertMidpoint;
            const endIsEast = bounds.left + bounds.width > vertMidpoint;
            const endIsSouth = bounds.top + bounds.height > horzMidpoint;

            // top-right quad
            if (startIsNorth && endIsEast) {
                indices.push(0);
            }

            // top-left quad
            if (startIsWest && startIsNorth) {
                indices.push(1);
            }

            // bottom-left quad
            if (startIsWest && endIsSouth) {
                indices.push(2);
            }

            // bottom-right quad
            if (endIsEast && endIsSouth) {
                indices.push(3);
            }

            return indices;
        }

        public insert(bounds: Bounds, comp: Component) {
            // If we have subtrees, call insert on matching.
            if (this.quads.length) {
                const indices = this.getIndices(bounds);

                for (let i = 0; i < indices.length; ++i) {
                    this.quads[indices[i]].insert(bounds, comp);
                }
                return;
            }

            // Otherwise, store object here.
            this.nodes.push({
                bounds,
                comp
            });

            // maxObjects reached?
            if (this.nodes.length > this.maxObjects) {
                // Split if we don't already have subtrees.
                if (this.trySplit()) {
                    // Add all objects to their corresponding subtree.
                    for (let i = 0; i < this.nodes.length; ++i) {
                        const node = this.nodes[i];
                        const indices = this.getIndices(node.bounds);
                        for (let k = 0; k < indices.length; ++k) {
                            this.quads[indices[k]].insert(node.bounds, node.comp);
                        }
                    }

                    // Clean up this node.
                    this.nodes = [];
                }
            }
        }

        /**
         * Query for objects in rectangle.
         * Note you will likely get objects outside the bounds. It depends on the quadtree resolution.
         */
        public query(bounds: Bounds): Component[] {
            let comps: Component[] = this.nodes.map(node => node.comp);

            const indices = this.getIndices(bounds);

            // If we have subtrees, query their objects.
            if (this.quads.length) {
                for (let i = 0; i < indices.length; ++i) {
                    comps = comps.concat(this.quads[indices[i]].query(bounds));
                }
            }

            // Remove dups
            comps = comps.filter((comp, index) => comps.indexOf(comp) >= index);

            return comps;
        }

        public clear() {
            for (let i = 0; i < this.quads.length; ++i) {
                this.quads[i].clear();
            }
            this.quads = [];
            this.nodes = [];
        }
    }
}