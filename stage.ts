namespace kojac {
    export class Stage implements SpriteLike {
        components: Component[];
        camera: Camera;
        prevMs: number;

        constructor(public app: App, public name: string) {
        }

        public get<T>(field: string): T { return undefined; }
        public set<T>(field: string, value: T) { }

        public remove(comp: Component) {
            this.components = this.components.filter(c => c !== comp);
            comp.stage = null;
        }

        public add(comp: Component) {
            if (this.components.some(item => item === comp)) {
                let fd = 0;
            }
            this.remove(comp);
            this.components.push(comp);
            comp.stage = this;
        }

        /**
         * @internal
         * Called once, when the stage is pushed to the stage manager.
         * Intended to allocate scene resources (one-time init).
         * Overload must call base.
         */
        startup() {
            this.components = [];
            this.camera = new Camera(this);
            this.z = -1000;
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
            const components = this.components;
            components.forEach(comp => comp.destroy());
            this.components = null;
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
            this.components.forEach(comp => comp.update(dt));
        }

        notify(event: string, parm?: any) {
        }

        // SpriteLike impl, so the stage can get a draw call from the scene.
        z: number;
        id: number;
        flags?: number;
        __draw(camera: scene.Camera): void {}
        __update(camera: scene.Camera, dt: number): void {}
        __serialize(offset: number): Buffer { return null; }
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
