namespace microcode {
    export class Home extends CursorScene {
        carouselBtn: Button
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
            const CAROUSEL_ITEMS = samples()
            const updateCarouselBtn = () => {
                this.carouselBtn.setIcon(
                    CAROUSEL_ITEMS[this.carouselCounter].icon
                )
                this.carouselBtn.ariaId =
                    CAROUSEL_ITEMS[this.carouselCounter].ariaId
                this.carouselBtn.label =
                    CAROUSEL_ITEMS[this.carouselCounter].label
            }

            this.selectBtnL = new Button({
                parent: null,
                style: ButtonStyles.BorderedPurple,
                icon: "prev_page",
                ariaId: "C0",
                x: -32,
                y: 40,
                onClick: () => {
                    if (this.carouselCounter > 0) this.carouselCounter--
                    updateCarouselBtn()
                },
            })

            this.carouselBtn = new Button({
                parent: null,
                style: ButtonStyles.FlatWhite,
                icon: CAROUSEL_ITEMS[this.carouselCounter].icon,
                ariaId: "N0",
                x: 0,
                y: 40,
                onClick: () => {
                    if (this.carouselCounter !== 0) {
                        settings.writeString(
                            SAVESLOT_AUTO,
                            CAROUSEL_ITEMS[this.carouselCounter].src
                        )
                    }
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })

            this.selectBtnR = new Button({
                parent: null,
                style: ButtonStyles.BorderedPurple,
                icon: "next_page",
                ariaId: "C1",
                x: 32,
                y: 40,
                onClick: () => {
                    if (this.carouselCounter < CAROUSEL_ITEMS.length - 1)
                        this.carouselCounter++
                    updateCarouselBtn()
                },
            })

            const btns: Button[] = [
                this.selectBtnL,
                this.carouselBtn,
                this.selectBtnR,
            ]

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
