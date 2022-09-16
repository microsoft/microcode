// encapsulate navigation so we can try A/B
// experiment with cursor motion

// A. the existing navigation is based on euclidian distance using quadtree,
//    which loses structure of rules
// B. Use hierarchical navigation scheme based on program structure
// - Editor has
//    - Menu bar, with
//      - compile/run button, followed by
//      - page selector, followed by
//    = Page has list of
//      - Rule with
//        - When, sensor followed by filters, followed by
//        - DO, actuator followed by modifiers

const SEARCH_INCR = 8
const SEARCH_MAX = 160
const SEARCH_SLOPE = 1.1

namespace microcode {
    export class Navigator {
        private quadtree: QuadTree
        private buttonGroups: Button[][]

        constructor() {
            this.buttonGroups = []
            this.initializeQuadtree()
        }

        private initializeQuadtree() {
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

        public addToQuadTree(btn: Button) {
            if (this.quadtree) {
                this.quadtree.insert(btn.hitbox, btn)
            }
        }

        public clear() {
            this.buttonGroups = []
            this.quadtree.clear()
            this.quadtree = undefined
        }

        public addButtons(btns: Button[]) {
            this.buttonGroups.push(btns)
            btns.forEach(btn => this.addToQuadTree(btn))
        }

        public queryUp(cursor: Cursor): Button {
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

        public queryDown(cursor: Cursor): Button {
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

        public queryLeft(cursor: Cursor): Button {
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

        public queryRight(cursor: Cursor): Button {
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
}
