namespace microcode {
    export type CursorCancelHandler = () => void

    const SEARCH_INCR = 8
    const SEARCH_MAX = 160
    const SEARCH_SLOPE = 1.1

    export class Cursor extends Component implements IPlaceable {
        private xfrm_: Affine
        stylus: Sprite
        private hitbox_: Bounds
        quadtree: QuadTree
        cancelHandlerStack: CursorCancelHandler[]
        anim: Animation
        dest: Vec2

        public get xfrm() {
            return this.xfrm_
        }
        public get hitbox() {
            return Bounds.Translate(this.hitbox_, this.xfrm.worldPos)
        }

        constructor() {
            super("cursor")
            this.xfrm_ = new Affine()
            this.stylus = new Sprite({
                parent: this,
                img: icons.get("cursor"),
            })
            // Small hitbox around the pointer.
            this.hitbox_ = new Bounds({
                width: 3,
                height: 3,
                left: -3,
                top: -2,
            })
            this.cancelHandlerStack = []
            this.dest = new Vec2()
            this.anim = new Animation((p: Vec2) => this.animCallback(p))
        }

        private animCallback(p: Vec2) {
            this.xfrm.localPos = p
        }

        public moveTo(pos: Vec2) {
            this.dest.copyFrom(pos)
            this.anim.clearFrames()
            this.anim.addFrame(
                new EaseFrame({
                    duration: 0.05,
                    //curve: curves.easeOut(curves.easing.sq2),
                    curve: curves.linear(),
                    startValue: this.xfrm.localPos,
                    endValue: this.dest,
                })
            )
            this.anim.start()
        }

        public snapTo(x: number, y: number) {
            this.dest.x = this.xfrm.localPos.x = x
            this.dest.y = this.xfrm.localPos.y = y
        }

        private query(opts: {
            boundsFn: (dist: number) => Bounds
            filterFn: (value: Button, dist: number) => boolean
        }): Button {
            if (this.anim && this.anim.playing) {
                return null
            }
            let dist = SEARCH_INCR
            let candidates: Button[]
            let overlapping = this.getOverlapping()
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
                            Vec2.DistSq(this.xfrm.worldPos, a.xfrm.worldPos) -
                            Vec2.DistSq(this.xfrm.worldPos, b.xfrm.worldPos)
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

        public queryUp(): Button {
            return this.query({
                boundsFn: dist => {
                    return new Bounds({
                        left: this.xfrm.worldPos.x - (dist >> 1),
                        top: this.xfrm.worldPos.y - dist,
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to upward buttons that are more up than left or right from us.
                    return (
                        pos.y < this.xfrm.worldPos.y &&
                        Math.abs(pos.y - this.xfrm.worldPos.y) /
                            Math.abs(pos.x - this.xfrm.worldPos.x) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        public queryDown(): Button {
            return this.query({
                boundsFn: dist => {
                    return new Bounds({
                        left: this.xfrm.worldPos.x - (dist >> 1),
                        top: this.xfrm.worldPos.y,
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to downward buttons that are more down than left or right from us.
                    return (
                        pos.y > this.xfrm.worldPos.y &&
                        Math.abs(pos.y - this.xfrm.worldPos.y) /
                            Math.abs(pos.x - this.xfrm.worldPos.x) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        public queryLeft(): Button {
            return this.query({
                boundsFn: dist => {
                    return new Bounds({
                        left: this.xfrm.worldPos.x - dist,
                        top: this.xfrm.worldPos.y - (dist >> 1),
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to leftward buttons that are more left than up or down from us.
                    return (
                        pos.x < this.xfrm.worldPos.x &&
                        Math.abs(pos.x - this.xfrm.worldPos.x) /
                            Math.abs(pos.y - this.xfrm.worldPos.y) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        public queryRight(): Button {
            return this.query({
                boundsFn: dist => {
                    return new Bounds({
                        left: this.xfrm.worldPos.x,
                        top: this.xfrm.worldPos.y - (dist >> 1),
                        width: dist,
                        height: dist,
                    })
                },
                filterFn: (btn, dist) => {
                    const pos = btn.xfrm.worldPos
                    // Filter to rightward buttons that are to more right than up or down from us.
                    return (
                        pos.x > this.xfrm.worldPos.x &&
                        Math.abs(pos.x - this.xfrm.worldPos.x) /
                            Math.abs(pos.y - this.xfrm.worldPos.y) >
                            SEARCH_SLOPE
                    )
                },
            })
        }

        public click(): boolean {
            let overlapping = this.getOverlapping() //.sort((a, b) => a.z - b.z);
            if (overlapping.length) {
                const btn = overlapping.shift()
                btn.click()
                return true
            }
            return false
        }

        public cancel(): boolean {
            if (this.cancelHandlerStack.length) {
                this.cancelHandlerStack[this.cancelHandlerStack.length - 1]()
                return true
            }
            return false
        }

        private getOverlapping(): Button[] {
            const crsb = this.hitbox
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

        /* override */ destroy() {
            this.quadtree = undefined
            super.destroy()
        }

        /* override */ update() {
            super.update()
            if (this.anim) {
                this.anim.update()
            }
        }

        /* override */ draw() {
            this.stylus.draw()
            //this.hitbox.dbgRect(15);
        }
    }
}
