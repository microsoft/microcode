namespace kojac {
    enum ConsoleView {
        Log, Plot
    };

    const TOOLBAR_HEIGHT = 18;
    const LINE_HEIGHT = 9;

    export class Console extends Stage {
        currView: ConsoleView;
        logLines: string[];

        constructor(app: App) {
            super(app, "console");
            this.currView = ConsoleView.Log;
            this.logLines = [];
        }

        public log(s: string) {
            this.logLines.push(s);
            this.logLines = this.logLines.slice(Math.max(this.logLines.length - 15, 0));
            this.setView(ConsoleView.Log);
        }

        public plot(name: string, value: number) {
            // TODO
            this.setView(ConsoleView.Plot);
        }

        initScene() {
            super.initScene();
            scene.setBackgroundColor(15);
            this.log("Welcome to micro:code!");
            let counter = 0;
        }

        private handleEditClicked() {
            this.app.pushStage(new Editor(this.app));
        }

        private handleConsoleClicked() {
        }

        private handlePlotClicked() {
        }

        private setView(view: ConsoleView) {
            this.currView = view;
        }

        __draw(camera: scene.Camera) {
            const top = scene.screenHeight() - TOOLBAR_HEIGHT;
            screen.fillRect(0, top, scene.screenWidth(), TOOLBAR_HEIGHT, 11);

            if (this.currView === ConsoleView.Log) {
                this.drawLogView();
            } else if (this.currView === ConsoleView.Plot) {
                this.drawPlotView();
            }
        }

        private drawLogView() {
            const x = 1;
            let y = scene.screenHeight() - TOOLBAR_HEIGHT - LINE_HEIGHT;
            for (let i = this.logLines.length - 1; i >= 0; --i) {
                screen.print(this.logLines[i], x, y, 1, image.font8);
                y -= LINE_HEIGHT;
            }

        }

        private drawPlotView() {
            
        }
    }
}
