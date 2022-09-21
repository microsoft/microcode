namespace microcode {
    const SEARCH_INCR = 8
    const SEARCH_MAX = 160
    const SEARCH_SLOPE = 1.1

    export class QuadtreeNavigator implements INavigator {
        private quadtree: QuadTree
        private firstBtn: Button

        constructor() {
            this.initializeQuadtree()
        }

        public initialCursor(cursor: Cursor) {
            return this.firstBtn
        }

        private initializeQuadtree() {
            this.firstBtn = null
            if (this.quadtree) {
                this.quadtree.clear()
            }
            this.quadtree = new QuadTree(
                new Bounds({
                    left: -512,
                    top: -512,
                    width: 1024,
                    height: 1024,
                }),
                1,
                16
            )
        }

        private addToQuadTree(btn: Button) {
            if (this.quadtree) {
                if (!this.firstBtn) this.firstBtn = btn
                this.quadtree.insert(btn.hitbox, btn)
            }
        }

        public clear() {
            this.quadtree.clear()
            this.quadtree = undefined
        }

        public addButtons(btns: Button[]) {
            if (!this.quadtree) this.initializeQuadtree()
            btns.forEach(btn => this.addToQuadTree(btn))
        }

        public move(cursor: Cursor, dir: CursorDir): Button {
            let btn: Button = undefined
            switch (dir) {
                case CursorDir.Up: {
                    btn = this.queryUp(cursor)
                    break
                }
                case CursorDir.Down: {
                    btn = this.queryDown(cursor)
                    break
                }
                case CursorDir.Left: {
                    btn = this.queryLeft(cursor)
                    break
                }
                case CursorDir.Right: {
                    btn = this.queryRight(cursor)
                    break
                }
            }
            if (btn) {
                cursor.moveTo(btn.xfrm.worldPos, btn.ariaId)
            }
            return btn
        }

        private queryUp(cursor: Cursor): Button {
            return this.query(cursor, {
                boundsFn: dist => {
                    return new Bounds({
                        left: cursor.xfrm.worldPos.x - (dist >> 1),
                        top: cursor.xfrm.worldPos.y - dist,
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to upward buttons that are more up than left or right from us.
                    return (
                        pos.y < cursor.xfrm.worldPos.y &&
                        Math.abs(pos.y - cursor.xfrm.worldPos.y) /
                            Math.abs(pos.x - cursor.xfrm.worldPos.x) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        private queryDown(cursor: Cursor): Button {
            return this.query(cursor, {
                boundsFn: dist => {
                    return new Bounds({
                        left: cursor.xfrm.worldPos.x - (dist >> 1),
                        top: cursor.xfrm.worldPos.y,
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to downward buttons that are more down than left or right from us.
                    return (
                        pos.y > cursor.xfrm.worldPos.y &&
                        Math.abs(pos.y - cursor.xfrm.worldPos.y) /
                            Math.abs(pos.x - cursor.xfrm.worldPos.x) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        private queryLeft(cursor: Cursor): Button {
            return this.query(cursor, {
                boundsFn: dist => {
                    return new Bounds({
                        left: cursor.xfrm.worldPos.x - dist,
                        top: cursor.xfrm.worldPos.y - (dist >> 1),
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to leftward buttons that are more left than up or down from us.
                    return (
                        pos.x < cursor.xfrm.worldPos.x &&
                        Math.abs(pos.x - cursor.xfrm.worldPos.x) /
                            Math.abs(pos.y - cursor.xfrm.worldPos.y) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        private queryRight(cursor: Cursor): Button {
            return this.query(cursor, {
                boundsFn: dist => {
                    return new Bounds({
                        left: cursor.xfrm.worldPos.x,
                        top: cursor.xfrm.worldPos.y - (dist >> 1),
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to rightward buttons that are to more right than up or down from us.
                    return (
                        pos.x > cursor.xfrm.worldPos.x &&
                        Math.abs(pos.x - cursor.xfrm.worldPos.x) /
                            Math.abs(pos.y - cursor.xfrm.worldPos.y) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        private query(
            cursor: Cursor,
            opts: {
                boundsFn: (dist: number) => Bounds
                filterFn: (value: Button, dist: number) => boolean
            }
        ): Button {
            let dist = SEARCH_INCR
            let candidates: Button[]
            let overlapping = this.getOverlapping(cursor)
            while (true) {
                const bounds = opts.boundsFn(dist)
                candidates = this.quadtree
                    .query(bounds)
                    // filter and map to Button type
                    .filter(comp => comp.kind === "button")
                    .map(comp => comp as Button)
                candidates = candidates
                    // Filter buttons overlapping the cursor.
                    .filter(btn => overlapping.indexOf(btn) < 0)
                    // Filter buttons per caller.
                    .filter(btn => opts.filterFn(btn, dist))
                    // Sort by distance from cursor.
                    .sort((a, b) => {
                        const apos = a.xfrm.worldPos
                        const bpos = b.xfrm.worldPos
                        return (
                            Vec2.DistSq(cursor.xfrm.worldPos, apos) -
                            Vec2.DistSq(cursor.xfrm.worldPos, bpos)
                        )
                    })
                if (candidates.length) {
                    break
                }
                // No candidates found, widen the search area.
                dist += SEARCH_INCR
                if (dist > SEARCH_MAX) {
                    break
                }
            }
            return candidates.shift()
        }

        public getOverlapping(cursor: Cursor): Button[] {
            const crsb = cursor.hitbox
            // Query for neary items.
            const btns = this.quadtree
                .query(crsb)
                // filter and map to Button type
                .filter(comp => comp.kind === "button")
                .map(comp => comp as Button)
                // filter to intersecting buttons
                .filter(btn => {
                    return Bounds.Intersects(crsb, btn.hitbox)
                })
            return btns
        }
    }

    interface ITreeComp extends IKindable, IPlaceable, ISizable {}

    class Node {
        constructor(public bounds: Bounds, public comp: ITreeComp) {}
    }

    // QuadTree for spatial indexing of objects.
    // https://en.wikipedia.org/wiki/Quadtree
    class QuadTree {
        private quads: QuadTree[]
        private nodes: Node[]

        constructor(
            public bounds: Bounds, // Max bounds of the indexed space.
            public maxObjects = 3, // Max objects per level before split attempt.
            public minDimension = 16 // Min size of a cell. Cannot split below this size.
        ) {
            this.quads = []
            this.nodes = []
        }

        public forEach(cb: (bounds: Bounds) => void) {
            if (this.quads.length) {
                for (let i = 0; i < this.quads.length; ++i) {
                    this.quads[i].forEach(cb)
                }
            } else {
                cb(this.bounds)
            }
        }

        private trySplit(): boolean {
            if (this.quads.length) {
                return false
            }
            const nextWidth = this.bounds.width >> 1
            if (nextWidth < this.minDimension) {
                return false
            }
            const nextHeight = this.bounds.height >> 1
            if (nextHeight < this.minDimension) {
                return false
            }
            const left = this.bounds.left
            const top = this.bounds.top

            // top-right
            this.quads[0] = new QuadTree(
                new Bounds({
                    left: left + nextWidth,
                    top: top,
                    width: nextWidth,
                    height: nextHeight,
                }),
                this.maxObjects,
                this.minDimension
            )

            // top-left
            this.quads[1] = new QuadTree(
                new Bounds({
                    left: left,
                    top: top,
                    width: nextWidth,
                    height: nextHeight,
                }),
                this.maxObjects,
                this.minDimension
            )

            // bottom-left
            this.quads[2] = new QuadTree(
                new Bounds({
                    left: left,
                    top: top + nextHeight,
                    width: nextWidth,
                    height: nextHeight,
                }),
                this.maxObjects,
                this.minDimension
            )

            // bottom-right
            this.quads[3] = new QuadTree(
                new Bounds({
                    left: left + nextWidth,
                    top: top + nextHeight,
                    width: nextWidth,
                    height: nextHeight,
                }),
                this.maxObjects,
                this.minDimension
            )

            return true
        }

        private getIndices(bounds: Bounds): number[] {
            const indices: number[] = []
            const vertMidpoint = this.bounds.left + (this.bounds.width >> 1)
            const horzMidpoint = this.bounds.top + (this.bounds.height >> 1)

            const startIsNorth = bounds.top < horzMidpoint
            const startIsWest = bounds.left < vertMidpoint
            const endIsEast = bounds.left + bounds.width > vertMidpoint
            const endIsSouth = bounds.top + bounds.height > horzMidpoint

            // top-right quad
            if (startIsNorth && endIsEast) {
                indices.push(0)
            }

            // top-left quad
            if (startIsWest && startIsNorth) {
                indices.push(1)
            }

            // bottom-left quad
            if (startIsWest && endIsSouth) {
                indices.push(2)
            }

            // bottom-right quad
            if (endIsEast && endIsSouth) {
                indices.push(3)
            }

            return indices
        }

        public insert(bounds: Bounds, comp: ITreeComp) {
            // If we have subtrees, call insert on matching.
            if (this.quads.length) {
                const indices = this.getIndices(bounds)

                for (let i = 0; i < indices.length; ++i) {
                    this.quads[indices[i]].insert(bounds, comp)
                }
                return
            }

            // Otherwise, store object here.
            this.nodes.push(new Node(bounds, comp))

            // maxObjects reached?
            if (this.nodes.length > this.maxObjects) {
                // Split if we don't already have subtrees.
                if (this.trySplit()) {
                    // Add all objects to their corresponding subtree.
                    for (let i = 0; i < this.nodes.length; ++i) {
                        const node = this.nodes[i]
                        const indices = this.getIndices(node.bounds)
                        for (let k = 0; k < indices.length; ++k) {
                            this.quads[indices[k]].insert(
                                node.bounds,
                                node.comp
                            )
                        }
                    }

                    // Clean up this node.
                    this.nodes = []
                }
            }
        }

        /**
         * Query for objects in rectangle.
         * Note you will likely get objects outside the bounds. It depends on the quadtree resolution.
         */
        public query(bounds: Bounds): ITreeComp[] {
            let comps: ITreeComp[] = this.nodes.map(node => node.comp)

            const indices = this.getIndices(bounds)

            // If we have subtrees, query their objects.
            if (this.quads.length) {
                for (let i = 0; i < indices.length; ++i) {
                    comps = comps.concat(this.quads[indices[i]].query(bounds))
                }
            }

            // Remove dups
            comps = comps.filter((comp, index) => comps.indexOf(comp) >= index)

            return comps
        }

        public clear() {
            for (let i = 0; i < this.quads.length; ++i) {
                this.quads[i].clear()
            }
            this.quads = []
            this.nodes = []
        }

        public dbgDraw(color: number) {
            this.forEach(bounds => bounds.drawRect(color))
        }
    }
}
