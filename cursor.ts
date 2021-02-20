namespace kojac {

    function easeInOutSine(t: number): number {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    export type CursorCancelHandler = () => void;

    const LERP_SPEED = 10;
    const SEARCH_INCR = 8;
    const SEARCH_MAX = 160;

    export class Cursor extends Component {
        stylus: Kelpie;
        x: number;
        y: number;
        fromx: number;
        fromy: number;
        lerpt: number;
        hitbox: Bounds;
        quadtree: QuadTree;
        cancelHandlerStack: CursorCancelHandler[];

        public get pos() { return this.stylus.pos; }
        public set pos(p: Vec2) { this.x = p.x; this.y = p.y; }
        public get z() { return this.stylus.z; }
        public set z(v: number) { this.stylus.z = v; }

        constructor(stage: Stage) {
            super(stage, "cursor");
            this.stylus = new Kelpie(stage, icons.get("cursor"));
            this.stylus.z = 100;
            // Small hitbox around the pointer.
            this.hitbox = new Bounds({
                width: 3,
                height: 3,
                left: -3,
                top: -2
            });
            this.x = this.fromx = this.stylus.x;
            this.y = this.fromy = this.stylus.y;
            this.cancelHandlerStack = [];
        }

        public moveTo(x: number, y: number) {
            // Setup to lerp to new position.
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

        // Move the cursor to the best nearby candidate button.
        private move(opts: {
            boundsFn: (dist: number) => Bounds;
            filterFn: (value: Button) => boolean;
        }) {
            let dist = SEARCH_INCR;
            let candidates: Button[];
            let overlapping = this.getOverlapping();
            while (true) {
                const bounds = opts.boundsFn(dist);
                candidates = this.quadtree.query(bounds)
                    // filter and map to Button type
                    .filter(comp => comp.kind === "button")
                    .map(comp => comp as Button)
                    // Filter buttons overlapping the cursor.
                    .filter(btn => overlapping.indexOf(btn) < 0)
                    // Filter buttons per caller.
                    .filter(opts.filterFn)
                    // Sort by distance from cursor.
                    .sort((a, b) => Vec2.DistSq(this.pos, a.pos) - Vec2.DistSq(this.pos, b.pos));
                if (candidates.length) { break; }
                // No candidates found, widen the search area.
                dist += SEARCH_INCR;
                if (dist > SEARCH_MAX) { break; }
            }
            if (candidates.length) {
                const btn = candidates.shift();
                this.moveTo(btn.x, btn.y);
            }
        }

        public moveUp() {
            this.move({
                boundsFn: (dist) => {
                    return new Bounds({
                        left: this.pos.x - (dist >> 1),
                        top: this.pos.y - dist,
                        width: dist,
                        height: dist
                    });
                },
                filterFn: (btn) => {
                    // Filter buttons below or level with the cursor.
                    return btn.y < this.y;
                }
            });
        }

        public moveDown() {
            this.move({
                boundsFn: (dist) => {
                    return new Bounds({
                        left: this.pos.x - (dist >> 1),
                        top: this.pos.y,
                        width: dist,
                        height: dist
                    });
                },
                filterFn: (btn) => {
                    // Filter buttons above or level with the cursor.
                    return btn.y > this.y;
                }
            });
        }

        public moveLeft() {
            this.move({
                boundsFn: (dist) => {
                    return new Bounds({
                        left: this.pos.x - dist,
                        top: this.pos.y - (dist >> 1),
                        width: dist,
                        height: dist
                    });
                },
                filterFn: (btn) => {
                    // Filter buttons right of or level with the cursor.
                    return btn.x < this.x;
                }
            });
        }

        public moveRight() {
            this.move({
                boundsFn: (dist) => {
                    return new Bounds({
                        left: this.pos.x,
                        top: this.pos.y - (dist >> 1),
                        width: dist,
                        height: dist
                    });
                },
                filterFn: (btn) => {
                    // Filter buttons left of or level with the cursor.
                    return btn.x > this.x;
                }
            });
        }

        public click() {
            let overlapping = this.getOverlapping().sort((a, b) => a.z - b.z);
            if (overlapping.length) {
                const btn = overlapping.shift();
                btn.click();
            }
        }

        public cancel() {
            if (this.cancelHandlerStack.length) {
                this.cancelHandlerStack[this.cancelHandlerStack.length - 1]();
            }
        }

        private getOverlapping(): Button[] {
            const crsb = Bounds.Translate(this.hitbox, this.pos);
            // Query for neary items.
            const btns = this.quadtree.query(crsb)
                // filter and map to Button type
                .filter(comp => comp.kind === "button")
                .map(comp => comp as Button)
                // filter to intersecting buttons
                .filter(btn => {
                    const btnb = Bounds.Translate(btn.hitbox, btn.pos);
                    return Bounds.Intersects(crsb, btnb);
                });
            return btns;
        }

        destroy() {
            this.quadtree = undefined;
            super.destroy();
        }

        update(dt: number) {
            super.update(dt);
            // Need to lerp to new position?
            let dx = (this.stylus.x - this.x);
            let dy = (this.stylus.y - this.y);
            if (dx !== 0 || dy !== 0) {
                const t = Math.min(LERP_SPEED * (control.millis() - this.lerpt) / 1000, 1);
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

        draw(drawOffset: Vec2) {
            //const bounds = Bounds.Translate(this.hitbox, this.pos);
            //bounds.render(drawOffset, 15);
        }
    }
}