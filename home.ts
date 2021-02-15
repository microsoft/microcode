namespace kojac {
    enum HomeView {
        Log, Plot
    };

    const TOOLBAR_HEIGHT = 18;
    const LINE_HEIGHT = 9;

    export class Home extends Stage {
        currView: HomeView;
        logLines: string[];

        constructor(app: App) {
            super(app, "home");
            this.currView = HomeView.Log;
            this.logLines = [];
        }

        public log(s: string) {
            this.logLines.push(s);
            // trim to last 15 entries
            this.logLines = this.logLines.slice(Math.max(this.logLines.length - 15, 0));
            this.setView(HomeView.Log);
        }

        public plot(value: number, color: number) {
            // TODO
            this.setView(HomeView.Plot);
        }

        initScene() {
            super.initScene();
            scene.setBackgroundColor(15);
            this.log("Welcome to micro:code!");
            controller.left.onEvent(ControllerButtonEvent.Released, function() {
                this.app.pushStage(new Editor(this.app));
            });
        }

        private setView(view: HomeView) {
            this.currView = view;
        }

        __draw(camera: scene.Camera) {
            this.drawToolbar();
            if (this.currView === HomeView.Log) {
                this.drawLogView();
            } else if (this.currView === HomeView.Plot) {
                this.drawPlotView();
            }
        }

        private drawToolbar() {
            // TODO this could all be prerendered/precalculated
            const toolbarTop = scene.screenHeight() - TOOLBAR_HEIGHT;
            screen.fillRect(0, toolbarTop, scene.screenWidth(), TOOLBAR_HEIGHT, 11);
            const icn_dpad_left = icons.get("dpad_left");
            const dpadTop = toolbarTop + (TOOLBAR_HEIGHT >> 1) - (icn_dpad_left.height >> 1);
            screen.print("Press   to edit your code", 2, dpadTop + (LINE_HEIGHT >> 1));
            screen.drawTransparentImage(icn_dpad_left, 32, dpadTop);
        }

        private drawLogView() {
            let y = scene.screenHeight() - TOOLBAR_HEIGHT - LINE_HEIGHT;
            for (let i = this.logLines.length - 1; i >= 0; --i) {
                screen.print(this.logLines[i], 2, y, 1, image.font8);
                y -= LINE_HEIGHT;
            }

        }

        private drawPlotView() {
            
        }
    }
}
