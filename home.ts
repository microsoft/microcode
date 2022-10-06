namespace microcode {
    export class Home extends CursorScene {
        samplesBtn: Button
        editBtn: Button

        constructor(app: App) {
            super(app)
        }

        /* override */ startup() {
            super.startup()

            this.editBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "edit_program",
                ariaId: "C0",
                x: -25,
                y: 30,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })

            this.samplesBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
                icon: "rock_paper_scissors",
                ariaId: "C1",
                x: 25,
                y: 30,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new SamplesGallery(this.app))
                },
            })

            const btns: Button[] = [this.editBtn, this.samplesBtn]

            this.navigator.addButtons(btns)
            // handle menu?
        }

        /* override */ activate() {
            super.activate()
            this.color = 15
            docs.setup(this.app)
        }

        private drawVersion() {
            Screen.print(
                microcode.VERSION,
                Screen.RIGHT_EDGE -
                    image.font5.charWidth * microcode.VERSION.length,
                Screen.BOTTOM_EDGE - image.font5.charHeight - 1,
                0xb,
                image.font5
            )
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
            const dy = this.yOffset == 0 ? (Math.idiv(t, 800) & 1) - 1 : 0
            const margin = 2
            const OFFSET = (Screen.HEIGHT >> 1) - wordLogo.height - margin
            const y = Screen.TOP_EDGE + OFFSET + dy
            Screen.drawTransparentImage(
                wordLogo,
                Screen.LEFT_EDGE + ((Screen.WIDTH - wordLogo.width) >> 1) + dy,
                y + this.yOffset
            )
            Screen.drawTransparentImage(
                microbitLogo,
                Screen.LEFT_EDGE +
                    ((Screen.WIDTH - microbitLogo.width) >> 1) +
                    dy,
                y - wordLogo.height + this.yOffset + margin
            )
            if (!this.yOffset) {
                const tagline = "for micro:bit V2"
                Screen.print(
                    tagline,
                    Screen.LEFT_EDGE +
                        ((Screen.WIDTH + wordLogo.width) >> 1) +
                        dy -
                        image.font5.charWidth * tagline.length,
                    Screen.TOP_EDGE +
                        OFFSET +
                        wordLogo.height +
                        dy +
                        this.yOffset +
                        1,
                    0xb,
                    image.font5
                )
            }

            this.samplesBtn.draw()
            this.editBtn.draw()
            this.drawVersion()
            super.draw()
        }
    }
}
