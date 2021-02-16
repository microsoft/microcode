namespace kojac {
    enum HomeView {
        Console, Plot
    };

    // Auto-save slot
    const SAVESLOT_AUTO = "sa";
    // Save slots (future)
    const SAVESLOT_1 = "s1";
    const SAVESLOT_2 = "s2";
    const SAVESLOT_3 = "s3";

    const TOOLBAR_HEIGHT = 18;
    const LINE_HEIGHT = 9;

    export class Home extends Stage {
        showWelcomeMessage: boolean;
        currView: HomeView;
        logLines: string[];
        bdefn: BrainDefn;

        constructor(app: App) {
            super(app, "home");
            this.currView = HomeView.Console;
            this.logLines = [];
            this.showWelcomeMessage = true;
        }

        public log(s: string) {
            this.logLines.push(s);
            // trim to last 15 entries
            this.logLines = this.logLines.slice(Math.max(this.logLines.length - 15, 0));
            this.setView(HomeView.Console);
        }

        public plot(value: number, color: number) {
            // TODO
            this.setView(HomeView.Plot);
        }

        startup() {
            super.startup();
            controller.left.onEvent(ControllerButtonEvent.Released, function() {
                this.app.pushStage(new Editor(this.app));
            });
        }

        activate() {
            super.activate();
            scene.setBackgroundColor(15);
            this.logLines = [];
            if (this.showWelcomeMessage) {
                this.showWelcomeMessage = false;
                this.log("Welcome to micro:code!");
            }
            this.log("program loading.");
            this.log("program running.");
        }

        private setView(view: HomeView) {
            this.currView = view;
        }

        __draw(camera: scene.Camera) {
            this.drawToolbar();
            if (this.currView === HomeView.Console) {
                this.drawConsoleView();
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

        private drawConsoleView() {
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
