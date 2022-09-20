namespace microcode {
    export class Home extends CursorScene {
        editBtn: Button
        sampleBtn: Button

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
                style: "white",
                icon: "paint",
                ariaId: "editor",
                x: -16,
                y: 32,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })
            this.sampleBtn = new Button({
                parent: null,
                style: "white",
                icon: "plus",
                ariaId: "samples",
                x: 16,
                y: 32,
                onClick: () => {
                    // LOAD sample
                },
            })

            this.navigator.addButtons([this.editBtn, this.sampleBtn])
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

        /* override */ draw() {
            Screen.fillRect(
                Screen.LEFT_EDGE,
                Screen.TOP_EDGE,
                Screen.WIDTH,
                Screen.HEIGHT,
                0xc
            )
            Screen.drawTransparentImage(
                wordLogo,
                Screen.LEFT_EDGE + ((Screen.WIDTH - wordLogo.width) >> 1),
                Screen.TOP_EDGE + 40
            )
            //this.drawConsoleView()
            this.editBtn.draw()
            this.sampleBtn.draw()
            super.draw()
        }
    }
}
