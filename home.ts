namespace microcode {
    export class Home extends CursorScene {
        editBtn: Button
        sampleBtns: Button[]

        constructor(app: App) {
            super(app)
            this.compileProgram()
        }

        public compileProgram() {
            const progdef = this.app.load(SAVESLOT_AUTO)
            if (!progdef) return

            new jacs.TopWriter().emitProgram(progdef)
        }

        /* override */ startup() {
            super.startup()

            this.editBtn = new Button({
                parent: null,
                style: ButtonStyles.FlatWhite,
                icon: "paint",
                ariaId: "editor",
                x: -26,
                y: 32,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })

            const STORED_SAMPLES: {
                label: string
                ariaId?: string
                src: string
            }[] = [
                {
                    label: "new program",
                    ariaId: "N0",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":[]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                },
                {
                    label: "flashing heart",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":["A5"],"M":["M15(0101010101100010101000100)"]},{"S":["S4"],"A":["A1"],"M":["M2"]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(0000000000000000000000000)"]},{"S":["S4"],"A":["A1"],"M":["M1"]},{"S":[],"A":[]}]},{},{},{}]}}',
                },
                {
                    label: "smiley buttons",
                    src: '{"progdef":{"P":[{"R":[{"S":["S2"],"A":["A5"],"F":["F3"],"M":["M15(1101111011000001000101110)"]},{"S":["S2"],"A":["A5"],"F":["F4"],"M":["M15(1101111011000000111010001)"]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                },
                {
                    label: "pet hamster",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":["A5"],"M":["M15(0000011011000000111000000)"]},{"S":["S2"],"A":["A5"],"F":["F7"],"M":["M15(0000001010000001000101110)","M15(0000011011000000111000000)"]},{"S":["S2"],"A":["A2"],"F":["F7"],"M":["M19giggle"]},{"S":["S3"],"A":["A5"],"F":["F17_shake"],"M":["M15(0000001010000000111010001)","M15(0000011011000000111000000)"]},{"S":["S3"],"A":["A2"],"F":["F17_shake"],"M":["M19sad"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                },
                {
                    label: "reaction time",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":["A5"],"M":["M15(0000000000001000000000000)"]},{"S":["S4"],"A":["A1"],"M":["M2"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(1111111111111111111111111)"]},{"S":["S2"],"A":["A1"],"F":["F3"],"M":["M3"]},{"S":["S2"],"A":["A1"],"F":["F4"],"M":["M4"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(0111001010011100101001010)"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(0111001010011100101001110)"]},{"S":[],"A":[]}]},{}]}}',
                },
            ]

            const btns: Button[] = [this.editBtn]
            const y = 32
            let x = 0
            this.sampleBtns = STORED_SAMPLES.map(sample => {
                const btn = new Button({
                    parent: null,
                    style: ButtonStyles.FlatWhite,
                    icon: "plus",
                    label: sample.label,
                    ariaId: sample.ariaId,
                    x,
                    y,
                    onClick: () => {
                        settings.writeString(SAVESLOT_AUTO, sample.src)
                        this.app.popScene()
                        this.app.pushScene(new Editor(this.app))
                    },
                })
                x += 26
                btns.push(btn)
                return btn
            })

            this.navigator.addButtons(btns)
        }

        /* override */ shutdown() {
            super.shutdown()
        }

        /* override */ activate() {
            super.activate()
            this.color = 15
            let progdef = this.app.load(SAVESLOT_AUTO)
            if (!progdef) {
                progdef = new ProgramDefn()
                this.app.save(SAVESLOT_AUTO, progdef)
            }

            // this.log("program started", 1)
        }

        /* override */ deactivate() {}

        /* override */ update() {
            super.update()
        }

        private yOffset = -Screen.HEIGHT >> 1
        /* override */ draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )
            this.yOffset = Math.min(0, this.yOffset + 2)
            const t = control.millis()
            const dx = this.yOffset == 0 ? (((t / 800) | 0) % 2) - 1 : 0
            Screen.drawTransparentImage(
                wordLogo,
                Screen.LEFT_EDGE + ((Screen.WIDTH - wordLogo.width) >> 1) + dx,
                Screen.TOP_EDGE + 50 + dx + this.yOffset
            )
            Screen.drawTransparentImage(
                microbitLogo,
                Screen.LEFT_EDGE +
                    ((Screen.WIDTH - microbitLogo.width) >> 1) +
                    dx,
                Screen.TOP_EDGE + 50 - wordLogo.height + dx + this.yOffset
            )
            this.editBtn.draw()
            this.sampleBtns.forEach(btn => btn.draw())
            super.draw()
        }
    }
}
