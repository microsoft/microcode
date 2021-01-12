namespace kojac {
    export type CharacterState = {
        x: number;
        y: number;
        id: string;
        bdefn: string;
    };

    export enum ImpulseType {
        Exclusive,      // Doesn't blend with any other movement.
        Ambient,        // Can be blended with other movement.
        Default         // Default movement if no other impulses present.
    }

    interface Impulse {
        type: ImpulseType;
        direction: Vec2;
        magnitude: number;
    }

    export class Character extends ActorComponent {
        kelpie: Kelpie;
        feeling: Kelpie;
        body: Body;
        bdefn: BrainDefn;
        prog: Program;
        destroyed: boolean;
        impulseQueue: Impulse[];
        bumps: Character[];

        public get x() { return this.kelpie.x; }
        public set x(v: number) { this.kelpie.x = v; }
        public get y() { return this.kelpie.y; }
        public set y(v: number) { this.kelpie.y = v; }
        public get pos(): Vec2 { return mkVec2(this.x, this.y); }
        public set pos(v: Vec2) { this.x = v.x; this.y = v.y; }

        constructor(stage: Stage, x: number, y: number, public defn: CharacterDefn, bdefn: BrainDefn) {
            super(stage, "character");
            let icon = icons.get(defn.id);
            this.kelpie = new Kelpie(icon);
            this.kelpie.x = x;
            this.kelpie.y = y;
            this.kelpie.z = 0;
            this.kelpie.data["kind"] = "character";
            this.kelpie.data["component"] = this;
            this.kelpie.onUpdate = (dt) => this.kelpieUpdate(dt);
            this.bdefn = bdefn.clone();
            this.destroyed = false;
            this.impulseQueue = [];
            this.bumps = [];

            const physics = this.stage.get<Physics>("physics");
            if (physics) {
                this.body = new Body(this.kelpie);
                this.body.mass = this.defn.defaults.mass;
                this.body.friction = this.defn.defaults.friction;
                this.body.restitution = this.defn.defaults.restitution;
                this.body.bumpCanMove = this.defn.defaults.bumpCanMove;
                physics.addBody(this.body);
            }
        }

        public destroy() {
            this.destroyed = true;
            if (this.prog) {
                this.prog.done = true;
            }
            this.stage.notify("character:destroying", this);
            const physics = this.getPhysics();
            if (physics) {
                physics.removeBody(this.body);
                this.body = null;
            }
            this.kelpie.destroy();
            this.kelpie = null;
            if (this.feeling) {
                this.feeling.destroy();
                this.feeling = null;
            }
            this.stage.remove(this);
        }

        public showFeeling(feeling: string) {
            if (this.feeling) {
                this.feeling.destroy();
                this.feeling = null;
            }
            const icon = icons.get(feeling, true);
            if (icon) {
                this.feeling = new Kelpie(icon);
                this.feeling.z = this.kelpie.z;
            }
        }

        public moveBy(x: number, y: number) {
            this.x += x;
            this.y += y;
        }

        public queueImpulse(direction: Vec2, magnitude: number, type: ImpulseType) {
            this.impulseQueue.push({
                direction,
                magnitude,
                type
            });
        }

        public addBump(char: Character) {
            this.bumps.push(char);
        }

        public nextDirection(): Vec2 | null {
            const v = this.computeImpulses();
            if (!v) { return null; }
            return Vec2.Normal(v);
        }

        getGameMode(): GameMode { return this.stage.get<GameMode>("gameMode"); }
        getPhysics(): Physics { return this.stage.get<Physics>("physics"); }

        update(dt: number) {
        }

        think() {
            if (!this.destroyed && this.prog) {
                this.prog.execute();
            }
            if (!this.destroyed) {
                this.applyImpulses();
                this.bumps = [];
            }
        }

        computeImpulses(): Vec2 {
            if (!this.impulseQueue.length) { return null; }
            let finalDir = mkVec2();
            const exclusiveOnly = this.impulseQueue.some(elem => elem.type === ImpulseType.Exclusive);
            const allowDefault = this.impulseQueue.length === 1;
            let impulseCount = 0;
            for (const impulse of this.impulseQueue) {
                if (exclusiveOnly && impulse.type !== ImpulseType.Exclusive) { continue; }
                if (!allowDefault && impulse.type === ImpulseType.Default) { continue; }
                const direction = impulse.direction;
                const magnitude = impulse.magnitude;
                finalDir = Vec2.Add(finalDir, Vec2.Scale(direction, magnitude));
                impulseCount += 1;
                if (exclusiveOnly) { break; }
            }
            if (impulseCount) {
                return Vec2.Scale(finalDir, 1 / impulseCount);
            }
            return null;
        }

        applyImpulses() {
            const v = this.computeImpulses();
            if (v) {
                this.body.vx += v.x;
                this.body.vy += v.y;
            }
            this.impulseQueue = [];
        }

        kelpieUpdate(dt: number) {
            const t = control.millis() / 100;
            if (this.feeling) {
                this.feeling.y = this.kelpie.top - Math.abs(Math.sin(t)) * 3;
                this.feeling.x = this.kelpie.right;
           }
        }

        notify(event: string, parm: any) {
            if (event === "save") {
                const savedGame = parm as SavedGame;
                const state: CharacterState = {
                    x: this.x,
                    y: this.y,
                    id: this.defn.id,
                    bdefn: this.bdefn.toObj()
                };
                savedGame.chars.push(state);
            } else if (event === "gameModeChanged") {
                if (parm === GameMode.Edit) {
                    if (this.prog) {
                        this.prog.destroy();
                        this.prog = undefined;
                    }
                } else if (parm === GameMode.Play) {
                    this.prog = new Program(this);
                }
            }
        }
    }
}
