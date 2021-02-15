namespace kojac {
    export class Stage implements SpriteLike {
        components: Component[];
        camera: Camera;
        prevMs: number;
        bdefn: BrainDefn;

        constructor(public app: App, public name: string) {
        }

        public get<T>(field: string): T { return undefined; }
        public set<T>(field: string, value: T) { }

        public update(dt: number) {
            this.components.forEach(comp => comp.update(dt));
        }

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

        handleAPressed() {
        }

        handleBPressed() {
        }

        handleMenuPressed() {}

        initScene() {
            this.components = [];
            this.camera = new Camera(this);
            controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
                this.handleAPressed();
            });
            controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
                this.handleBPressed();
            });
            controller.menu.onEvent(ControllerButtonEvent.Pressed, () => {
                this.handleMenuPressed();
            });
            controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
            });

            this.z = -1000;
            game.currentScene().addSprite(this);
        }

        protected start() {
            this.prevMs = control.millis();

            game.onUpdate(() => {
                const t = control.millis();
                const dt = t - this.prevMs;
                this.update(dt);
                this.prevMs = t;
            });
        }

        shutdownScene() {
            const components = this.components;
            components.forEach(comp => comp.destroy());
            this.components = null;
        }

        notify(event: string, parm?: any) {
        }

        // SpriteLike
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
            game.pushScene();
            this.stack.push(stage);
            stage.initScene();
        }

        public pop() {
            const stage = this.stack.pop();
            stage.shutdownScene();
            game.popScene();
        }
    }
}
