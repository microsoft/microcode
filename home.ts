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

    type PlotEntry = {
        value: number;
        t: number;
    };

    type PlotLine = {
        entries: PlotEntry[];
        min: number;
        max: number;
    };

    export class Home extends Scene {
        currView: HomeView;
        logLines: LogLine[];
        plotLines: { [color: number]: PlotLine };

        agent: Agent;
        paused: boolean;
        singleStep: boolean;

        constructor(app: App) {
            super(app, "home");
            this.currView = HomeView.Console;
            this.logLines = [];
            this.plotLines = {};
        }

        /**
         * Write a line of text to the console log.
         */
        public log(text: string, color: number, justification = LineJustification.Left) {
            this.logLines.push({ text, color, justification });
            // trim to last 15 entries
            this.logLines = this.logLines.slice(Math.max(this.logLines.length - 15, 0));
        }

        /**
         * Plot a point on the graph.
         */
        public plot(value: number, color: number) {
            let plotLine = this.plotLines[color];
            if (!plotLine) {
                this.plotLines[color] = plotLine = {
                    entries: [],
                    min: 0, max: 0
                };
            }
            plotLine.entries.push({
                value,
                t: control.millis()
            });
            plotLine.entries = plotLine.entries.slice(Math.max(plotLine.entries.length - 160, 0));
            plotLine.min = plotLine.max = value;
            plotLine.entries.forEach(entry => {
                plotLine.min = Math.min(plotLine.min, entry.value);
                plotLine.max = Math.max(plotLine.max, entry.value);
            });
        }

        public logBoolean(name: string, val: boolean, color: number) {
            const text = `${name}: ${val ? "true": "false"}`;
            this.log(text, color);
            this.setView(HomeView.Console);
        }

        public logNumber(name: string, val: number, color: number) {
            const text = `${name}: ${val.toString()}`;
            this.log(text, color);
            this.setView(HomeView.Console);
        }

        public logString(name: string, val: string, color: number) {
            const text = `${name}: ${val}`;
            this.log(val, color);
            this.setView(HomeView.Console);
        }

        public plotBoolean(name: string, val: boolean, color: number) {
            this.plot(val ? 1 : 0, color);
            this.setView(HomeView.Plot);
        }

        public plotNumber(name: string, val: number, color: number) {
            this.plot(val, color);
            this.setView(HomeView.Plot);
        }

        /* override */ startup() {
            super.startup();
            control.onEvent(ControllerButtonEvent.Released, controller.left.id, () => {
                this.app.popScene();
                this.app.pushScene(new Editor(this.app));
            });
            control.onEvent(ControllerButtonEvent.Pressed, controller.up.id, () => {
                this.paused = !this.paused;
                if (this.paused) {
                    this.log("program paused", 1);
                } else {
                    this.log("program resumed", 1);
                }
            });
            control.onEvent(ControllerButtonEvent.Pressed, controller.up.id, () => {
                console.log("singleStep")
                this.singleStep = true;
            });
            control.onEvent(ControllerButtonEvent.Repeated, controller.up.id, () => {
                this.singleStep = true;
            });
        }

        /* override */ shutdown() {
            this.logLines = undefined;
            this.plotLines = undefined;
            super.shutdown();
        }

        /* override */ activate() {
            super.activate();
            this.color = 15;
            this.logLines = [];
            this.log("  _ . _ _ _ . _ _  _| _", 7, LineJustification.Center);
            this.log(" ||||(_| (_).(_(_)(_|(-", 7, LineJustification.Center);
            this.log("", 7);
            this.log(" Welcome to micro:code!", 7, LineJustification.Center);
            this.log("", 7);
            this.log("", 7);
            let progdef = this.app.load(SAVESLOT_AUTO);
            if (!progdef) {
                progdef = new ProgramDefn();
                this.app.save(SAVESLOT_AUTO, progdef);
            }
            this.agent = new Agent(this, progdef);
            this.paused = false;
            this.log("program started", 1);
        }

        /* override */ deactivate() {
            this.logLines = [];
            this.agent.destroy();
            this.agent = undefined;
        }

        /* override */ update() {
            super.update();
            if (!this.paused || (this.paused && this.singleStep)) {
                this.agent.update();
                this.singleStep = false;
            }
        }

        private setView(view: HomeView) {
            this.currView = view;
        }

        /* override */ draw() {
            this.drawToolbar();
            if (this.currView === HomeView.Console) {
                this.drawConsoleView();
            } else if (this.currView === HomeView.Plot) {
                this.drawPlotView();
            }
            super.draw();
        }

        private drawToolbar() {
            // TODO this could all be prerendered/precalculated
            const toolbarTop = Screen.BOTTOM_EDGE - TOOLBAR_HEIGHT;
            Screen.fillRect(Screen.LEFT_EDGE, toolbarTop, Screen.WIDTH, TOOLBAR_HEIGHT, 11);
            const icn_dpad_left = icons.get("dpad_left");
            const dpadTop = toolbarTop + (TOOLBAR_HEIGHT >> 1) - (icn_dpad_left.height >> 1);
            Screen.print("Press   to edit your code", Screen.LEFT_EDGE + 2, dpadTop + (LINE_HEIGHT >> 1));
            Screen.drawTransparentImage(icn_dpad_left, Screen.LEFT_EDGE + 32, dpadTop);
        }

        private drawConsoleView() {
            Screen.fillRect(Screen.LEFT_EDGE, Screen.TOP_EDGE, Screen.WIDTH, Screen.HEIGHT - TOOLBAR_HEIGHT, 15);
            let y = Screen.BOTTOM_EDGE - TOOLBAR_HEIGHT - LINE_HEIGHT;
            for (let i = this.logLines.length - 1; i >= 0; --i) {
                const line = this.logLines[i];
                switch (line.justification) {
                    case LineJustification.Left: {
                        const x = Screen.LEFT_EDGE + CONSOLE_MARGIN;
                        Screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                    case LineJustification.Center: {
                        const x = Screen.LEFT_EDGE + ((Screen.WIDTH - line.text.length * image.font8.charWidth) >> 1) - (image.font8.charWidth);
                        Screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                    case LineJustification.Right: {
                        const x = Screen.RIGHT_EDGE - CONSOLE_MARGIN - (line.text.length * image.font8.charWidth);
                        Screen.print(line.text, x, y, line.color, image.font8);
                        break;
                    }
                }
                y -= LINE_HEIGHT;
            }
        }

        private drawPlotView() {
            screen.fillRect(Screen.LEFT_EDGE, Screen.TOP_EDGE, Screen.WIDTH, Screen.HEIGHT - TOOLBAR_HEIGHT, 6);
            const maxHeight = Screen.HEIGHT - TOOLBAR_HEIGHT - 10;
            for (let color = 1; color < 16; ++color) {
                const plotLine = this.plotLines[color];
                if (plotLine && plotLine.entries.length > 1) {
                    let currX = Screen.RIGHT_EDGE;
                    const min = plotLine.min;
                    const max = plotLine.max;
                    const range = Math.max(Math.abs(max - min), 1);
                    const heightScale =  maxHeight / range;
                    for (let i = plotLine.entries.length - 1, x = 0; i > 0 && x < Screen.WIDTH; --i, ++x) {
                        const a = plotLine.entries[i];
                        const b = plotLine.entries[i - 1];
                        const av = a.value - min;
                        const bv = b.value - min;
                        const ax = Screen.RIGHT_EDGE - x;
                        const ay = Screen.TOP_EDGE + maxHeight - Math.floor(av * heightScale) + 5;
                        const bx = Screen.RIGHT_EDGE - x - 1;
                        const by = Screen.TOP_EDGE + maxHeight - Math.floor(bv * heightScale) + 5;
                        Screen.drawLine(ax, ay, bx, by, color);
                    }
                }
            };
        }
    }

    const PIXELS_PER_MILLI = 1;
}
