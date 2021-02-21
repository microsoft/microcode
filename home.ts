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
        paused: boolean;
        singleStep: boolean;

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

        public logBoolean(name: string, val: boolean, color: number) {
            const text = `${name}: ${val ? "true": "false"}`;
            this.log(text, color);
        }

        public logNumber(name: string, val: number, color: number) {
            const text = `${name}: ${val.toString()}`;
            this.log(text, color);
        }

        public logString(name: string, val: string, color: number) {
            const text = `${name}: ${val}`;
            this.log(val, color);
        }

        public plotBoolean(name: string, val: boolean, color: number) {
            this.plot(val ? 1 : 0, color);
        }

        public plotNumber(name: string, val: number, color: number) {
            this.plot(val, color);
        }

        startup() {
            super.startup();
            controller.left.onEvent(ControllerButtonEvent.Released, () => {
                this.app.pushStage(new Editor(this.app));
            });
            controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
                this.paused = !this.paused;
                if (this.paused) {
                    this.log("program paused");
                } else {
                    this.log("program resumed");
                }
            });
            controller.right.onEvent(ControllerButtonEvent.Pressed, () => {
                this.singleStep = true;
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
            this.paused = false;
            this.log("program started");
        }

        deactivate() {
            this.logLines = [];
            this.agent.destroy();
            this.agent = undefined;
        }

        update(dt: number) {
            super.update(dt);
            if (!this.paused || (this.paused && this.singleStep)) {
                this.agent.update(dt);
                this.singleStep = false;
            }
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
                switch (line.justification) {
                    case LineJustification.Left: {
                        const x = CONSOLE_MARGIN;
                        screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                    case LineJustification.Center: {
                        const x = ((scene.screenWidth() - line.text.length * image.font8.charWidth) >> 1) - (image.font8.charWidth);
                        screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                    case LineJustification.Right: {
                        const x = scene.screenWidth() - CONSOLE_MARGIN - (line.text.length * image.font8.charWidth);
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
