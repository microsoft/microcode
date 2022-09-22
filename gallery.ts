// screen for selecting from samples

namespace microcode {
    export class SamplesGallery extends CursorScene {
        sampleButtons: Button[]

        /* override */ shutdown() {
            super.shutdown()
        }

        /* override */ startup() {
            super.startup()

            let x = -72,
                y = -55
            this.sampleButtons = []
            samples()
                .slice(1)
                .forEach(sample => {
                    const btn = new Button({
                        parent: null,
                        style: ButtonStyles.BorderedPurple,
                        icon: sample.icon,
                        ariaId: sample.ariaId,
                        x: x + 16,
                        y: y + 16,
                        onClick: () => {
                            settings.writeString(SAVESLOT_AUTO, sample.src)
                            this.app.popScene()
                            this.app.pushScene(new Editor(this.app))
                        },
                    })
                    this.sampleButtons.push(btn)
                    x += 38
                    if (x + 32 > 75) {
                        y += 38
                        x = -72
                    }
                })

            this.navigator.addButtons(this.sampleButtons)
        }

        protected moveCursor(dir: CursorDir) {
            if (dir == CursorDir.Back) {
                // go back to home screen
                this.app.popScene()
                this.app.pushScene(new Home(this.app))
            } else {
                super.moveCursor(dir)
            }
        }
        /* override */ activate() {
            super.activate()
            this.color = 15
        }

        /* override */ deactivate() {}

        /* override */ update() {
            super.update()
        }

        /* override */ draw() {
            this.sampleButtons.forEach(s => s.draw())
            super.draw()
        }
    }
}

/* 

            this.carouselBtn = new Button({
                parent: null,
                style: ButtonStyles.Transparent,
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
            
*/
