namespace microcode {
    // Auto-save slot
    export const SAVESLOT_AUTO = "sa"
    // Save slots
    export const SAVESLOT_1 = "s1"
    export const SAVESLOT_2 = "s2"
    export const SAVESLOT_3 = "s3"

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
                jdc.start()
                this.sceneManager = new SceneManager()
                const home = new Home(this)
                this.pushScene(home)
            }, 1)
        }

        public save(slot: string, progdef: ProgramDefn) {
            const saved: SavedState = {
                progdef: progdef.toObj(),
            }
            const s = JSON.stringify(saved)
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
