namespace kodu {
    export class Body {
        enabled: boolean;
        vx: number;
        vy: number;
        mass: number;
        radius: number;
        friction: number;
        restitution: number;
        bumpCanMove: boolean;

        get x() { return this.kelpie.x; }
        get y() { return this.kelpie.y; }
        set x(n: number) { this.kelpie.x = n; }
        set y(n: number) { this.kelpie.y = n; }

        constructor(public kelpie: Kelpie) {
            this.vx = 0;
            this.vy = 0;
            this.mass = 1;
            this.friction = 0;
            this.restitution = 1;
            this.bumpCanMove = true;
            const hitbox = util.calculateHitbox(this.kelpie);
            this.radius = Math.max(hitbox.width, hitbox.height) >> 1;
        }

        applyFriction() {
            const vx = this.vx;
            const vy = this.vy;
            if (this.vx) {
                this.vx = this.vx * (1 - this.friction);
            }
            if (this.vy) {
                this.vy = this.vy * (1 - this.friction);
            }
            if (this.friction > 0 && this.friction < 1 && vx == this.vx && vy == this.vy) {
                this.vx = this.vy = 0;
            }
        }
        applyVelocity() {
            this.x += this.vx;
            this.y += this.vy;
        }
    };

    export class Physics extends Component {
        bodies: Body[];
        deadBodies: Body[];

        constructor(stage: Stage) {
            super(stage, "physics");
            this.bodies = [];
            this.deadBodies = [];
        }
        
        public addBody(body: Body) {
            this.bodies.push(body);
            body.enabled = true;
        }

        public removeBody(body: Body) {
            body.enabled = false;
            body.kelpie = null;
            this.deadBodies.push(body);
        }

        public simulate() {
            if (this.deadBodies.length) {
                this.bodies = this.bodies.filter(elem => !this.deadBodies.find(dead => elem === dead));
                this.deadBodies = [];
            }

            for (let i = 0; i < this.bodies.length; ++i) {
                const body1 = this.bodies[i];
                if (!body1.enabled) { continue; }
                for (let j = i + 1; j < this.bodies.length; ++j) {
                    const body2 = this.bodies[j];
                    if (!body2.enabled) { continue; }
                    this.checkCollision(body1, body2);
                }
            }

            for (const body of this.bodies) {
                body.applyFriction();
                body.applyVelocity();
            }
        }

        private checkCollision(body1: Body, body2: Body) {
            const minDist = (body1.radius + body2.radius);
            const minDistSq = (minDist * minDist);
            const vDiffX = (body2.x - body1.x);
            const vDiffY = (body2.y - body1.y);
            const distSq =
                (vDiffX * vDiffX) +
                (vDiffY * vDiffY);
            // Not colliding?
            if (distSq > minDistSq) { return; }
            const dist = Math.sqrt(distSq);
            const vNormCollisionX = (vDiffX / dist);
            const vNormCollisionY = (vDiffY / dist);
            const vRelVelocityX = (body1.vx - body2.vx);
            const vRelVelocityY = (body1.vy - body2.vy);
            let speed = Math.abs(
                (vRelVelocityX * vNormCollisionX) +
                (vRelVelocityY * vNormCollisionY));
            speed *= Math.min(body1.restitution, body2.restitution);
            const impulse = ((2 * speed) / (body1.mass + body2.mass));
            if (body1.bumpCanMove) {
                body1.vx -= (impulse * body2.mass * vNormCollisionX);
                body1.vy -= (impulse * body2.mass * vNormCollisionY);
            }
            if (body2.bumpCanMove) {
                body2.vx += (impulse * body1.mass * vNormCollisionX);
                body2.vy += (impulse * body1.mass * vNormCollisionY);
            }
            this.stage.notify("physics:collision", { body1, body2 });
        }
    }
}