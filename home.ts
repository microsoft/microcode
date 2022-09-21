namespace microcode {
    export class Home extends CursorScene {
        carouselBtn: Button
        //sampleBtns: Button[]

        sampleBtn: Button
        selectBtnL: Button
        selectBtnR: Button
        carouselCounter: number

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
            this.carouselCounter = 0
            const CAROUSEL_ITEMS: {
                label: string
                ariaId?: string
                src?: string
                icon: string
            }[] = [
                {
                    label: "editor",
                    ariaId: "editor",
                    icon: "paint"
                },
                {
                    label: "new program",
                    ariaId: "N0",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":[]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                    icon: "plus"
                },
                {
                    label: "flashing heart",
                    src: '{"progdef":{"P":[{"R":[{"S":["S4"],"A":["A5"],"M":["M15(0101010101100010101000100)","M15(0000000000000000000000000)"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]}]}}',
                    icon: "flashing_heart"
                },
                {
                    label: "smiley buttons",
                    src: '{"progdef":{"P":[{"R":[{"S":["S2"],"A":["A5"],"F":["F3"],"M":["M15(1101111011000001000101110)"]},{"S":["S2"],"A":["A5"],"F":["F4"],"M":["M15(1101111011000000111010001)"]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                    icon: "smiley_buttons"
                },
                {
                    label: "pet hamster",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":["A5"],"M":["M15(0000011011000000111000000)"]},{"S":["S2"],"A":["A5"],"F":["F7"],"M":["M15(0000001010000001000101110)","M15(0000011011000000111000000)"]},{"S":["S2"],"A":["A2"],"F":["F7"],"M":["M19giggle"]},{"S":["S3"],"A":["A5"],"F":["F17_shake"],"M":["M15(0000001010000000111010001)","M15(0000011011000000111000000)"]},{"S":["S3"],"A":["A2"],"F":["F17_shake"],"M":["M19sad"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                    icon: "plus"
                },
                {
                    label: "chuck a duck",
                    src: '{"progdef":{"P":[{"R":[{"S":["S3"],"A":["A5"],"F":["F17_shake"],"M":["M15(0000000000000000000000000)"]},{"S":["S3"],"A":["A6"],"F":["F17_shake"]},{"S":["S7"],"A":["A5"],"M":["M15(0110011100011110111000000)"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                    icon: "plus"
                },
                {
                    label: "reaction time",
                    src: '{"progdef":{"P":[{"R":[{"S":[],"A":["A5"],"M":["M15(0000000000001000000000000)"]},{"S":["S4"],"A":["A1"],"M":["M2"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(1111111111111111111111111)"]},{"S":["S2"],"A":["A1"],"F":["F3"],"M":["M3"]},{"S":["S2"],"A":["A1"],"F":["F4"],"M":["M4"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(0111001010011100101001010)"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(0111001010011100101001110)"]},{"S":[],"A":[]}]},{}]}}',
                    icon: "plus"
                },
                {
                    label: "hot potato",
                    src: '{"progdef":{"P":[{"R":[{"S":["S4"],"A":["A1"],"F":["F14","F14","F14","F18","F18","F18"],"M":["M1"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":["A5"],"M":["M15(1111110101111110111001110)"]},{"S":[],"A":["A2"],"M":["M19sad"]},{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{"R":[{"S":[],"A":[]}]},{}]}}',
                    icon: "plus"
                },
                ]
            
            this.selectBtnL = new Button({
                parent: null,
                style: ButtonStyles.BorderedPurple,
                icon: "prev_page",
                ariaId: "previous sample button",
                x: -32,
                y: 40,
                onClick: () => {
                    if (this.carouselCounter > 0) {
                        this.carouselCounter--
                    }
                    this.carouselBtn.setIcon(CAROUSEL_ITEMS[this.carouselCounter].icon)
                }
            })

            this.carouselBtn = new Button({
                parent: null,
                style: ButtonStyles.FlatWhite,
                icon: CAROUSEL_ITEMS[this.carouselCounter].icon,
                ariaId: "editor",
                x: 0,
                y: 40,
                onClick: () => {
                    if (this.carouselCounter !== 0)
                    {
                        settings.writeString(SAVESLOT_AUTO, CAROUSEL_ITEMS[this.carouselCounter].src)
                    }
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })

            this.selectBtnR = new Button({
                parent: null,
                style: ButtonStyles.BorderedPurple,
                icon: "next_page",
                ariaId: "next sample button",
                x: 32,
                y: 40,
                onClick: () => {
                    if (this.carouselCounter < CAROUSEL_ITEMS.length -1) {
                        this.carouselCounter++
                    }
                    this.carouselBtn.setIcon(CAROUSEL_ITEMS[this.carouselCounter].icon)
                }
            })



            const btns: Button[] = [this.selectBtnL, this.carouselBtn, this.selectBtnR]

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
            this.selectBtnL.draw()
            this.carouselBtn.draw()
            this.selectBtnR.draw()

            super.draw()
        }
    }
}
