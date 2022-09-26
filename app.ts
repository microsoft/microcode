namespace microcode {
    // Auto-save slot
    export const SAVESLOT_AUTO = "sa"
    const LOAD_SLOT = "jdcs"

    type SavedState = {
        progdef: any
    }

    export class App {
        sceneManager: SceneManager

        constructor() {
            // One interval delay to ensure all static constructors have executed.
            setTimeout(() => {
                controller.setRepeatDefault(250, 30)
                keymap.setupKeys()
                icons.init()
                this.firstLaunchJacscript()
                this.sceneManager = new SceneManager()
                const home = new Home(this)
                this.pushScene(home)
            }, 1)
        }

        private firstLaunchJacscript() {
            // check that we've been able to load the previous program
            if (settings.exists(LOAD_SLOT)) {
                settings.writeString(SAVESLOT_AUTO, samples()[0].src) // now program is loaded
            }

            // start jacscript
            settings.writeNumber(LOAD_SLOT, 1)
            jdc.setParameters(
                0x3e92f825,
                microcode.VERSION,
                "MicroCode on micro:bit V2"
            )
            jdc.start()

            // clear flag if successful
            setTimeout(() => {
                settings.remove(LOAD_SLOT)
            }, 1000)
        }

        public save(slot: string, progdef: ProgramDefn) {
            const saved: SavedState = {
                progdef: progdef.toObj(),
            }
            const s = JSON.stringify(saved)
            console.log(`save ${slot} (${s.length}c)`)
            //console.log(s)
            settings.writeString(slot, s)
        }

        public load(slot: string): ProgramDefn {
            const s = settings.readString(slot)
            if (s) {
                const saved: SavedState = JSON.parse(s)
                if (saved) {
                    return ProgramDefn.FromObj(saved.progdef)
                }
            }
            return undefined
        }

        public pushScene(scene: Scene) {
            this.sceneManager.pushScene(scene)
        }

        public popScene() {
            this.sceneManager.popScene()
        }
    }
}
