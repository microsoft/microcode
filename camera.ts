namespace kojac {

    function easeInOutSine(t: number): number {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    const LERP_SPEED = 20;

    export class Camera extends Component {
        x: number;
        y: number;
        curx: number;
        cury: number;
        fromx: number;
        fromy: number;
        lerpt: number;

        //% blockCombine block="pos" callInDebugger
        public get pos(): Vec2 { return new Vec2(this.x, this.y); }
        public set pos(v: Vec2) { this.x = v.x; this.y = v.y; }

        public get offset() { return new Vec2(this.curx - (scene.screenWidth() >> 1), this.cury - (scene.screenHeight() >> 1)); }

        constructor(scene: Scene) {
            super(scene, "camera");
            this.resetPosition();
        }

        public resetPosition(snap = true) {
            if (snap) {
                this.snapTo(new Vec2(scene.screenWidth() >> 1, scene.screenHeight() >> 1));
            } else {
                this.moveTo(new Vec2(scene.screenWidth() >> 1, scene.screenHeight() >> 1));
            }
        }

        public moveTo(p: Vec2) {
            this.fromx = this.x;
            this.fromy = this.y;
            this.x = p.x;
            this.y = p.y;
            this.lerpt = control.millis();
        }

        public snapTo(p: Vec2) {
            this.x = this.curx = this.fromx = p.x;
            this.y = this.cury = this.fromy = p.y;
        }

        update(dt: number) {
            const dx = this.x - this.curx;
            const dy = this.y - this.cury;
            if (dx || dy) {
                const t = Math.min(LERP_SPEED * (control.millis() - this.lerpt) / 1000, 1);
                if (Math.abs(dx) < 0.5) {
                    this.curx = this.x;
                } else {
                    let distx = (this.x - this.fromx);
                    this.curx = this.fromx + easeInOutSine(t) * distx;
                }
                if (Math.abs(dy) < 0.5) {
                    this.cury = this.y;
                } else {
                    let disty = (this.y - this.fromy);
                    this.cury = this.fromy + easeInOutSine(t) * disty;
                }
            }
            scene.centerCameraAt(this.curx, this.cury);
        }

        keepInFrame(bounds: Bounds) {
            const halfWidth = scene.screenWidth() >> 1;
            const halfHeight = scene.screenHeight() >> 1;
            const camb = new Bounds({
                top: this.y - halfHeight,
                left: this.x - halfWidth,
                width: scene.screenWidth(),
                height: scene.screenHeight()
            });
            if (!camb.contains(bounds.topLeft) ||
                !camb.contains(bounds.topRight) ||
                !camb.contains(bounds.bottomLeft) ||
                !camb.contains(bounds.bottomRight)
            ) {
                let dx = 0;
                let dy = 0;
                let dtop = Math.round(camb.top - bounds.top);
                let dleft = Math.round(camb.left - bounds.left);
                let dbottom = Math.round(bounds.bottom - camb.bottom);
                let dright = Math.round(bounds.right - camb.right);
                if (dleft > 0) {
                    dx -= dleft;
                }
                if (dright > 0) {
                    dx += dright;
                }
                if (dtop > 0) {
                    dy -= dtop;
                }
                if (dbottom > 0) {
                    dy += dbottom;
                }
                this.moveTo(new Vec2(this.x + dx, this.y + dy));

            }            
        }
    }
}