namespace userconfig {
    export const DISPLAY_CFG0 = 0x02000080 // don't wait for shield on startup
    // TODO this should be only enabled on micro:bit
}

namespace microcode {
    enum HomeView {
        Console, // Show the console log
        Plot, // Show the plot graph
    }

    const TOOLBAR_HEIGHT = 18
    const LINE_HEIGHT = 9
    const CONSOLE_MARGIN = 2

    export enum LineJustification {
        Left,
        Center,
        Right,
    }

    type LogLine = {
        text: string
        color: number
        justification: LineJustification
    }

    type PlotEntry = {
        value: number
        t: number
    }

    type PlotLine = {
        entries: PlotEntry[]
        min: number
        max: number
    }

    export class Home extends CursorScene {
        currView: HomeView
        logLines: LogLine[]
        plotLines: { [color: number]: PlotLine }
        editBtn: Button
        sampleBtn: Button

        constructor(app: App) {
            super(app)
            this.currView = HomeView.Console
            this.logLines = []
            this.compileProgram()
        }

        /**
         * Write a line of text to the console log.
         */
        public log(
            text: string,
            color: number,
            justification = LineJustification.Left
        ) {
            this.logLines.push({ text, color, justification })
            // trim to last 15 entries
            this.logLines = this.logLines.slice(
                Math.max(this.logLines.length - 15, 0)
            )

            let accessabilityMessage = {
                type: "text",
                details: [{ name: "details", values: [text] }],
            }

            accessibility.setLiveContent(accessabilityMessage)
        }

        /**
         * Plot a point on the graph.
         */
        public plot(value: number, color: number) {
            let plotLine = this.plotLines[color]
            if (!plotLine) {
                this.plotLines[color] = plotLine = {
                    entries: [],
                    min: 0,
                    max: 0,
                }
            }
            plotLine.entries.push({
                value,
                t: control.millis(),
            })
            plotLine.entries = plotLine.entries.slice(
                Math.max(plotLine.entries.length - 160, 0)
            )
            plotLine.min = plotLine.max = value
            plotLine.entries.forEach(entry => {
                plotLine.min = Math.min(plotLine.min, entry.value)
                plotLine.max = Math.max(plotLine.max, entry.value)
            })
        }

        public logBoolean(name: string, val: boolean, color: number) {
            const text = `${name}: ${val ? "true" : "false"}`
            this.log(text, color)
            this.setView(HomeView.Console)
        }

        public logNumber(name: string, val: number, color: number) {
            const text = `${name}: ${val.toString()}`
            this.log(text, color)
            this.setView(HomeView.Console)
        }

        public logString(name: string, val: string, color: number) {
            const text = `${name}: ${val}`
            this.log(val, color)
            this.setView(HomeView.Console)
        }

        public plotBoolean(name: string, val: boolean, color: number) {
            this.plot(val ? 1 : 0, color)
            this.setView(HomeView.Plot)
        }

        public plotNumber(name: string, val: number, color: number) {
            this.plot(val, color)
            this.setView(HomeView.Plot)
        }

        public compileProgram() {
            const progdef = this.app.load(SAVESLOT_AUTO)
            if (progdef) {
                new jacs.TopWriter().emitProgram(progdef)

                let accessabilityMessage = {
                    type: "text",
                    details: [{ name: "details", values: [""] }],
                }

                accessibility.setLiveContent(accessabilityMessage)
                pause(1000)

                accessabilityMessage = {
                    type: "text",
                    details: [
                        { name: "details", values: ["program deployed"] },
                    ],
                }

                accessibility.setLiveContent(accessabilityMessage)
            }
        }

        /* override */ startup() {
            super.startup()

            this.editBtn = new Button({
                parent: null,
                style: "white",
                icon: "ok",
                x: 16,
                y: 8,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })

            this.editBtn = new Button({
                parent: null,
                style: "white",
                icon: "ok",
                x: -16,
                y: 48,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })
            this.sampleBtn = new Button({
                parent: null,
                style: "white",
                icon: "plus",
                x: 16,
                y: 48,
                onClick: () => {
                    // LOAD sample
                },
            })

            this.navigator.addButtons([this.editBtn, this.sampleBtn])

            const btn = this.navigator.initialCursor(this.cursor)
            if (btn)
                this.cursor.snapTo(
                    btn.xfrm.worldPos.x,
                    btn.xfrm.worldPos.y,
                    btn.ariaId
                )
        }

        /* override */ shutdown() {
            this.logLines = undefined
            this.plotLines = undefined
            super.shutdown()
        }

        /* override */ activate() {
            super.activate()
            this.color = 15
            this.logLines = []
            this.log("               _        ", 7, LineJustification.Center)
            this.log(" /\\/\\ . _ _ _ /  _  _| _", 7, LineJustification.Center)
            this.log("/    \\|(_| (_)\\_(_)(_|(-", 7, LineJustification.Center)
            this.log("", 7)
            this.log(" Welcome to MicroCode!", 7, LineJustification.Center)
            this.log("", 7)
            this.log("", 7)
            let progdef = this.app.load(SAVESLOT_AUTO)
            if (!progdef) {
                progdef = new ProgramDefn()
                this.app.save(SAVESLOT_AUTO, progdef)
            }

            // this.log("program started", 1)
        }

        /* override */ deactivate() {
            this.logLines = []
        }

        /* override */ update() {
            super.update()
        }

        private setView(view: HomeView) {
            this.currView = view
        }

        /* override */ draw() {
            this.drawConsoleView()
            super.draw()
            this.editBtn.draw()
            this.sampleBtn.draw()
            this.picker.draw()
            this.cursor.draw()
        }

        private drawConsoleView() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT - TOOLBAR_HEIGHT,
                15
            )
            let y = Screen.BOTTOM_EDGE - TOOLBAR_HEIGHT - LINE_HEIGHT
            for (let i = this.logLines.length - 1; i >= 0; --i) {
                const line = this.logLines[i]
                switch (line.justification) {
                    case LineJustification.Left: {
                        const x = Screen.LEFT_EDGE + CONSOLE_MARGIN
                        Screen.print(line.text, x, y, line.color, image.font8)
                        break
                    }
                    case LineJustification.Center: {
                        const x =
                            Screen.LEFT_EDGE +
                            ((Screen.WIDTH -
                                line.text.length * image.font8.charWidth) >>
                                1) -
                            image.font8.charWidth
                        Screen.print(line.text, x, y, line.color, image.font8)
                        break
                    }
                    case LineJustification.Right: {
                        const x =
                            Screen.RIGHT_EDGE -
                            CONSOLE_MARGIN -
                            line.text.length * image.font8.charWidth
                        Screen.print(line.text, x, y, line.color, image.font8)
                        break
                    }
                }
                y -= LINE_HEIGHT
            }
        }

        private drawPlotView() {
            screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT - TOOLBAR_HEIGHT,
                6
            )
            const maxHeight = Screen.HEIGHT - TOOLBAR_HEIGHT - 10
            for (let color = 1; color < 16; ++color) {
                const plotLine = this.plotLines[color]
                if (plotLine && plotLine.entries.length > 1) {
                    let currX = Screen.RIGHT_EDGE
                    const min = plotLine.min
                    const max = plotLine.max
                    const range = Math.max(Math.abs(max - min), 1)
                    const heightScale = maxHeight / range
                    for (
                        let i = plotLine.entries.length - 1, x = 0;
                        i > 0 && x < Screen.WIDTH;
                        --i, ++x
                    ) {
                        const a = plotLine.entries[i]
                        const b = plotLine.entries[i - 1]
                        const av = a.value - min
                        const bv = b.value - min
                        const ax = Screen.RIGHT_EDGE - x
                        const ay =
                            Screen.TOP_EDGE +
                            maxHeight -
                            Math.floor(av * heightScale) +
                            5
                        const bx = Screen.RIGHT_EDGE - x - 1
                        const by =
                            Screen.TOP_EDGE +
                            maxHeight -
                            Math.floor(bv * heightScale) +
                            5
                        Screen.drawLine(ax, ay, bx, by, color)
                    }
                }
            }
        }
    }

    const PIXELS_PER_MILLI = 1
}
