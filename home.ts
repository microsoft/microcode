namespace kojac {
    enum HomeView {
        Console,    // Show the console log
        Plot        // Show the plot graph
    };

    const TOOLBAR_HEIGHT = 18;
    const LINE_HEIGHT = 9;

    type LogLine = {
        text: string;
        color: number;
    };

    export class Home extends Stage {
        currView: HomeView;
        logLines: LogLine[];
        pdefn: ProgramDefn;
        pgm: Program;

        constructor(app: App) {
            super(app, "home");
            this.currView = HomeView.Console;
            this.logLines = [];
        }

        /**
         * Write a line of text to the console log.
         */
        public log(text: string, color = 1) {
            this.logLines.push({ text, color });
            // trim to last 15 entries
            this.logLines = this.logLines.slice(Math.max(this.logLines.length - 15, 0));
            this.setView(HomeView.Console);
        }

        /**
         * Plot a point on the graph.
         */
        public plot(value: number, color = 5) {
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
            this.log("  __o _ _ _ o _ _  _| _ ", 7);
            this.log(" ||||(_| (_)o(_(_)(_|(/_", 7);
            this.log("");
            this.log(" Welcome to micro:code!", 7);
            this.log("");
            this.log("");
            this.pdefn = this.app.load(SAVESLOT_AUTO);
            if (!this.pdefn) {
                this.pdefn = new ProgramDefn();
                this.app.save(SAVESLOT_AUTO, this.pdefn);
            }
            if (this.pgm) { this.pgm.destroy(); }
            this.pgm = new Program(this.pdefn);
            this.log("program started");
        }

        deactivate() {
            if (this.pgm) { this.pgm.destroy(); }
            this.pgm = undefined;
            this.pdefn = undefined;
        }

        update(dt: number) {
            super.update(dt);
            this.pgm.execute();
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
                const line = this.logLines[i];
                screen.print(line.text, 2, y, line.color, image.font8);
                y -= LINE_HEIGHT;
            }
        }

        private drawPlotView() {
            // TODO
        }
    }
}
