namespace kojac {

    export enum LayerFlags {
        NeedsSorting = 1 << 0,
        CameraRelative = 1 << 1
    }

    export enum StageLayer {
        World = 1,
        HUD = 2
    }

    const LAYER_IDS = [StageLayer.World, StageLayer.HUD];

    interface Layer {
        flags: number;
        components: Component[];
    };

    export class Stage implements SpriteLike {
        layers: Layer[];
        camera: Camera;
        prevMs: number;
        stageFlags: number;
        offset: Vec2;

        constructor(public app: App, public name: string) {
            this.stageFlags = 0;
            this.offset = new Vec2(0, 0);
            this.layers = [];
            this.layers[StageLayer.World] = {
                flags: 0,
                components: []
            };
            this.layers[StageLayer.HUD] = {
                flags: LayerFlags.CameraRelative,
                components: []
            };
        }

        public remove(comp: Component) {
            const lid: StageLayer = comp.data["_lid"];
            if (lid !== undefined) {
                const layer = this.layers[lid];
                layer.components = layer.components.filter(c => c.id !== comp.id);
                comp.stage = null;
            }
        }

        public add(comp: Component, lid: number) {
            const layer = this.layers[lid];
            layer.components.push(comp);
            comp.stage = this;
            comp.data["_lid"] = lid;
            layer.flags |= LayerFlags.NeedsSorting;
        }

        public needsSorting(comp: Component) {
            const lid: StageLayer = comp.data["_lid"];
            if (lid !== undefined) {
                const layer = this.layers[lid];
                layer.flags |= LayerFlags.NeedsSorting;
            }
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
            LAYER_IDS.forEach((id) => {
                const layer = this.layers[id];
                const comps = layer.components;
                comps.forEach(comp => {
                    // Some components will be helpful and destroy components they created.
                    // Looking at you Button.
                    if (comp.stage === this) { comp.destroy(); }
                });
                layer.components = undefined;
            });
            this.layers = undefined;
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
            LAYER_IDS.forEach((id) => {
                const layer = this.layers[id];
                const comps = layer.components;
                comps.forEach(comp => comp.update(dt));
            });
        }

        draw(camera: scene.Camera) {
            LAYER_IDS.forEach(id => {
                const layer = this.layers[id];
                if (layer.flags & LayerFlags.NeedsSorting) {
                    layer.components = layer.components.sort((a: any, b: any) => a.z - b.z || a.id - b.id);
                    layer.flags &= ~LayerFlags.NeedsSorting;
                }
                const cameraRelative = layer.flags & LayerFlags.CameraRelative;
                const drawOffset = new Vec2(
                    this.offset.x + (cameraRelative ? 0 : camera.drawOffsetX),
                    this.offset.y + (cameraRelative ? 0 : camera.drawOffsetY));
                const comps = layer.components;
                comps.forEach((comp: any) => comp.draw && comp.draw(drawOffset))
            });
        }

        // SpriteLike impl, so the stage can get a draw call from the scene.
        z: number;
        id: number;
        flags?: number;
        __update(camera: scene.Camera, dt: number): void {}
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
