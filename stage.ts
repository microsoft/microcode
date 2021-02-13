namespace kojac {
    export class Stage {
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

        handleCursorCanvasClick(x: number, y: number) {}
        handleCursorButtonClick(button: Button) {}
        handleCursorCancel() {}

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
            switch (event) {
                case "cursor:canvasClick": {
                    const { x, y } = parm;
                    this.handleCursorCanvasClick(x, y);
                    break;
                }
                case "cursor:buttonClick": {
                    const { button } = parm;
                    this.handleCursorButtonClick(button);
                    break;
                }
                case "cursor:cancel": {
                    this.handleCursorCancel();
                    break;
                }
            }
        }
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
