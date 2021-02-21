namespace kojac {

    export enum StageFlags {
        NeedsSorting = 1 << 0,
    }

    // A stage is essentially a scene.
    export class Stage implements SpriteLike {
        camera: Camera;
        prevMs: number;
        stageFlags: number;
        components: Component[];

        constructor(public app: App, public name: string) {
            this.stageFlags = 0;
            this.flags = 0;
            this.components = [];
        }

        public remove(comp: Component) {
            this.components = this.components.filter(c => c.id !== comp.id);
            comp.stage = null;
        }

        public add(comp: Component) {
            this.components.push(comp);
            comp.stage = this;
            this.stageFlags |= StageFlags.NeedsSorting;
        }

        public setNeedsSorting() {
            this.stageFlags |= StageFlags.NeedsSorting;
        }

        /**
         * @internal
         * Called once, when the stage is pushed to the stage manager.
         * Intended to allocate scene resources (one-time init).
         * Overload must call base.
         */
        startup() {
            this.camera = new Camera(this);
            game.currentScene().addSprite(this);
            this.prevMs = control.millis();
            game.onUpdate(() => {
                const t = control.millis();
                const dt = t - this.prevMs;
                this.update(dt);
                this.prevMs = t;
            });
        }

        /**
         * @internal
         * Called once, when the stage is popped from the stage manager.
         * Intenged to free stage resources (one-time deinit)
         * Overload must call base.
         */
        shutdown() {
            const comps = this.components;
            comps.forEach(comp => {
                // Some components will be helpful and destroy components they created.
                // Looking at you Button.
                if (comp.stage === this) { comp.destroy(); }
            });
            this.components = undefined;
        }

        /**
         * @internal
         * Called each time the stage becomes the active stage.
         * Intended for "waking up" the stage, starting timers, etc.
         * Overload must call base.
         */
        activate() {
            this.prevMs = control.millis();
        }

        /**
         * @internal
         * Called each time the stage goes inactive (like when another stage is pushed).
         * Intended for "going to sleep", stopping timers, etc.
         * Overload must call base.
         */
        deactivate() {
        }

        /**
         * @internal
         * Called on the active stage by the stage manager each game update.
         * Overload must call base.
         */
        public update(dt: number) {
            const comps = this.components;
            comps.forEach(comp => comp.update(dt));
        }

        draw(camera: scene.Camera) {
            if (this.stageFlags & StageFlags.NeedsSorting) {
                this.components = this.components.sort((a: any, b: any) => a.z - b.z || a.id - b.id);
                this.stageFlags &= ~StageFlags.NeedsSorting;
            }
            const drawOffset = new Vec2(
                camera.drawOffsetX,
                camera.drawOffsetY);
            const comps = this.components;
            comps.forEach((comp: any) => comp.draw && comp.draw(drawOffset));
        }

        // SpriteLike impl, so the stage can get a draw call from the scene.
        z: number;
        id: number;
        flags?: number;
        __update(camera: scene.Camera, dt: number): void { }
        __serialize(offset: number): Buffer { return null; }
        __draw(camera: scene.Camera): void { this.draw(camera); }
    }

    export class StageManager {
        stack: Stage[];

        constructor() {
            this.stack = [];
        }

        public push(stage: Stage) {
            const currStage = this.currStage();
            if (currStage) {
                currStage.deactivate();
            }
            game.pushScene();
            this.stack.push(stage);
            stage.startup();
            stage.activate();
        }

        public pop() {
            const prevStage = this.stack.pop();
            if (prevStage) {
                prevStage.deactivate();
                prevStage.shutdown();
            }
            game.popScene();
            const currStage = this.currStage();
            if (currStage) {
                currStage.activate();
            }
        }

        private currStage(): Stage {
            if (this.stack.length) {
                return this.stack[this.stack.length - 1];
            }
            return undefined;
        }
    }
}
