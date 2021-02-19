namespace kojac {
    enum HomeView {
        Console,    // Show the console log
        Plot        // Show the plot graph
    };

    const TOOLBAR_HEIGHT = 18;
    const LINE_HEIGHT = 9;
    const CONSOLE_MARGIN = 2;

    export enum LineJustification {
        Left,
        Center,
        Right
    }

    type LogLine = {
        text: string;
        color: number;
        justification: LineJustification;
    };

    export class Home extends Stage {
        currView: HomeView;
        logLines: LogLine[];
        agent: Agent;

        constructor(app: App) {
            super(app, "home");
            this.currView = HomeView.Console;
            this.logLines = [];
        }

        /**
         * Write a line of text to the console log.
         */
        public log(text: string, color = 1, justification = LineJustification.Left) {
            this.logLines.push({ text, color, justification });
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
            controller.left.onEvent(ControllerButtonEvent.Released, function () {
                this.app.pushStage(new Editor(this.app));
            });
        }

        activate() {
            super.activate();
            scene.setBackgroundColor(15);
            this.logLines = [];
            this.log("  _ . _ _ _ . _ _  _| _", 7, LineJustification.Center);
            this.log(" ||||(_| (_).(_(_)(_|(-", 7, LineJustification.Center);
            this.log("");
            this.log(" Welcome to micro:code!", 7, LineJustification.Center);
            this.log("");
            this.log("");
            let progdef = this.app.load(SAVESLOT_AUTO);
            if (!progdef) {
                progdef = new ProgramDefn();
                this.app.save(SAVESLOT_AUTO, progdef);
            }
            this.agent = new Agent(this, progdef);
            this.log("program started");
        }

        deactivate() {
            this.logLines = [];
            this.agent.destroy();
            this.agent = undefined;
        }

        update(dt: number) {
            super.update(dt);
            this.agent.update(dt);
        }

        private setView(view: HomeView) {
            this.currView = view;
        }

        draw(camera: scene.Camera) {
            this.drawToolbar();
            if (this.currView === HomeView.Console) {
                this.drawConsoleView();
            } else if (this.currView === HomeView.Plot) {
                this.drawPlotView();
            }
            super.draw(camera);
        }

        private drawToolbar() {
            // TODO this could all be prerendered/precalculated
            const toolbarTop = this.offset.y + scene.screenHeight() - TOOLBAR_HEIGHT;
            screen.fillRect(this.offset.x, toolbarTop, scene.screenWidth(), TOOLBAR_HEIGHT, 11);
            const icn_dpad_left = icons.get("dpad_left");
            const dpadTop = toolbarTop + (TOOLBAR_HEIGHT >> 1) - (icn_dpad_left.height >> 1);
            screen.print("Press   to edit your code", this.offset.x + 2, this.offset.y + dpadTop + (LINE_HEIGHT >> 1));
            screen.drawTransparentImage(icn_dpad_left, this.offset.x + 32, this.offset.y + dpadTop);
        }

        private drawConsoleView() {
            let y = this.offset.y + scene.screenHeight() - TOOLBAR_HEIGHT - LINE_HEIGHT;
            for (let i = this.logLines.length - 1; i >= 0; --i) {
                const line = this.logLines[i];
                switch (line.justification) {
                    case LineJustification.Left: {
                        const x = this.offset.x + CONSOLE_MARGIN;
                        screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                    case LineJustification.Center: {
                        const x = this.offset.x + ((scene.screenWidth() - line.text.length * image.font8.charWidth) >> 1) - (image.font8.charWidth);
                        screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                    case LineJustification.Right: {
                        const x = this.offset.x + scene.screenWidth() - CONSOLE_MARGIN - (line.text.length * image.font8.charWidth);
                        screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                }
                y -= LINE_HEIGHT;
            }
        }

        private drawPlotView() {
            // TODO
        }
    }
}
