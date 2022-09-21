namespace microcode {
    const STORED_SAMPLES =
        ["{\"progdef\":{\"P\":[{\"R\":[{\"S\":[],\"A\":[\"A5\"],\"M\":[\"M15(0101010101100010101000100)\"]},{\"S\":[\"S4\"],\"A\":[\"A1\"],\"M\":[\"M2\"]}]},{\"R\":[{\"S\":[],\"A\":[\"A5\"],\"M\":[\"M15(0000000000000000000000000)\"]},{\"S\":[\"S4\"],\"A\":[\"A1\"],\"M\":[\"M1\"]},{\"S\":[],\"A\":[]}]},{},{},{}]}}",
            "{\"progdef\":{\"P\":[{\"R\":[{\"S\":[\"S2\"],\"A\":[\"A5\"],\"F\":[\"F3\"],\"M\":[\"M15(1101111011000001000101110)\"]},{\"S\":[\"S2\"],\"A\":[\"A5\"],\"F\":[\"F4\"],\"M\":[\"M15(1101111011000000111010001)\"]}]},{\"R\":[{\"S\":[],\"A\":[]}]},{\"R\":[{\"S\":[],\"A\":[]}]},{\"R\":[{\"S\":[],\"A\":[]}]},{}]}}"]
    
    export class Home extends CursorScene {
        editBtn: Button
        sampleBtn: Button
        sampleBtn2: Button

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
                style: ButtonStyles.ShadowedWhite,
                icon: "paint",
                ariaId: "editor",
                x: -26,
                y: 32,
                onClick: () => {
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })
            this.sampleBtn = new Button({
                parent: null,
                style: ButtonStyles.ShadowedWhite,
                icon: "plus",
                ariaId: "flashing heart sample",
                x: 0,
                y: 32,
                onClick: () => {
                    settings.writeString(SAVESLOT_AUTO, STORED_SAMPLES[0])
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })
            this.sampleBtn2 = new Button({
                parent: null,
                style: ButtonStyles.ShadowedWhite,
                icon: "plus",
                ariaId: "smiley buttons sample",
                x: 26,
                y: 32,
                onClick: () => {
                    settings.writeString(SAVESLOT_AUTO, STORED_SAMPLES[1])
                    this.app.popScene()
                    this.app.pushScene(new Editor(this.app))
                },
            })

            this.navigator.addButtons([this.editBtn, this.sampleBtn, this.sampleBtn2])
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
            this.sampleBtn.draw()
            this.sampleBtn2.draw()
            super.draw()
        }
    }
}
