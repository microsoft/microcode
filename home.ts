namespace microcode {
    export class Home extends CursorScene {
        samplesBtn: Button
        editBtn: Button

        constructor(app: App) {
            super(app)
            this.initialCompileProgram()
        }

        private initialCompileProgram() {
            const progdef = this.app.load(SAVESLOT_AUTO)
            if (!progdef) return

            control.runInParallel(() => {
                // this runs after power up; wait a second for all devices to enumerate
                // (the generated jacs program no longer does that)
                pause(1000)
                new jacs.TopWriter().emitProgram(progdef)
            })
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

        private renderSamples() {
            this.app.popScene()
            for (const sample of samples()) {
                console.log(`render ${sample.label}`)
                settings.writeString(SAVESLOT_AUTO, sample.src)
                const editor = new Editor(this.app)
                this.app.pushScene(editor)
                pause(500)
                dumpProgram(
                    editor,
                    `sample_${sample.label}`,
                    icons.get(sample.icon)
                )
            }
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
            const dx = this.yOffset == 0 ? (((t / 800) | 0) % 2) - 1 : 0
            Screen.drawTransparentImage(
                wordLogo,
                Screen.LEFT_EDGE + ((Screen.WIDTH - wordLogo.width) >> 1) + dx,
                Screen.TOP_EDGE + 40 + dx + this.yOffset
            )
            Screen.drawTransparentImage(
                microbitLogo,
                Screen.LEFT_EDGE +
                    ((Screen.WIDTH - microbitLogo.width) >> 1) +
                    dx,
                Screen.TOP_EDGE + 40 - wordLogo.height + dx + this.yOffset
            )
            this.samplesBtn.draw()
            this.editBtn.draw()
            this.drawVersion()
            super.draw()
        }
    }
}
