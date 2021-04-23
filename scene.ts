namespace kojac {

    export enum SceneFlags {
        NeedsSorting = 1 << 0,
    }

    export class Scene implements SpriteLike {
        camera: Camera;
        prevMs: number;
        sceneFlags: number;
        components: Component[];

        constructor(public app: App, public name: string) {
            this.sceneFlags = 0;
            this.flags = 0;
            this.components = [];
        }

        public remove(comp: Component) {
            this.components = this.components.filter(c => c.id !== comp.id);
            comp.scene = null;
        }

        public add(comp: Component) {
            this.components.push(comp);
            comp.scene = this;
            this.sceneFlags |= SceneFlags.NeedsSorting;
        }

        public setNeedsSorting() {
            this.sceneFlags |= SceneFlags.NeedsSorting;
        }

        /**
         * @internal
         * Called once, when the scene is pushed to the scene manager.
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
         * Called once, when the scene is popped from the scene manager.
         * Intenged to free scene resources (one-time deinit)
         * Overload must call base.
         */
        shutdown() {
            const comps = this.components;
            comps.forEach(comp => {
                // Some components will be helpful and destroy components they created.
                // Looking at you Button.
                if (comp.scene === this) { comp.destroy(); }
            });
            this.components = undefined;
        }

        /**
         * @internal
         * Called each time the scene becomes the active scene.
         * Intended for "waking up" the scene, starting timers, etc.
         * Overload must call base.
         */
        activate() {
            this.prevMs = control.millis();
        }

        /**
         * @internal
         * Called each time the scene goes inactive (like when another scene is pushed).
         * Intended for "going to sleep", stopping timers, etc.
         * Overload must call base.
         */
        deactivate() {
        }

        /**
         * @internal
         * Called on the active scene by the scene manager each game update.
         * Overload must call base.
         */
        public update(dt: number) {
            const comps = this.components;
            comps.forEach(comp => comp.update(dt));
        }

        draw(camera: scene.Camera) {
            if (this.sceneFlags & SceneFlags.NeedsSorting) {
                this.components = this.components.sort((a: any, b: any) => a.z - b.z || a.id - b.id);
                this.sceneFlags &= ~SceneFlags.NeedsSorting;
            }
            const drawOffset = new Vec2(
                camera.drawOffsetX,
                camera.drawOffsetY);
            const comps = this.components;
            comps.forEach((comp: any) => comp.draw && comp.draw(drawOffset));
        }

        // SpriteLike impl, so the scene can get a draw call from the scene.
        z: number;
        id: number;
        flags?: number;
        __update(camera: scene.Camera, dt: number): void { }
        __serialize(offset: number): Buffer { return null; }
        __draw(camera: scene.Camera): void { this.draw(camera); }
    }

    export class SceneManager {
        stack: Scene[];

        constructor() {
            this.stack = [];
        }

        public push(scene: Scene) {
            const currScene = this.currScene();
            if (currScene) {
                currScene.deactivate();
            }
            game.pushScene();
            this.stack.push(scene);
            scene.startup();
            scene.activate();
        }

        public pop() {
            const prevScene = this.stack.pop();
            if (prevScene) {
                prevScene.deactivate();
                prevScene.shutdown();
            }
            game.popScene();
            const currScene = this.currScene();
            if (currScene) {
                currScene.activate();
            }
        }

        private currScene(): Scene {
            if (this.stack.length) {
                return this.stack[this.stack.length - 1];
            }
            return undefined;
        }
    }
}
