namespace microcode {
    // Auto-save slot
    export const SAVESLOT_AUTO = "sa"

    interface SavedState {
        progdef: any
        version?: string
    }

    export class App {
        sceneManager: SceneManager

        constructor() {
            // One interval delay to ensure all static constructors have executed.
            setTimeout(() => {
                reportEvent("app.start")

                controller.setRepeatDefault(250, 30)
                keymap.setupKeys()
                icons.init()

                // start jacscript
                jdc.setParameters(
                    0x3e92f825,
                    microcode.VERSION,
                    "MicroCode on micro:bit V2"
                )
                jdc.start()

                this.sceneManager = new SceneManager()
                const home = new Home(this)
                this.pushScene(home)
            }, 1)
        }

        public saveSource(slot: string, s: string) {
            reportEvent("app.save", { slot: slot, size: s.length })
            settings.writeString(slot, s)
        }

        public save(slot: string, progdef: ProgramDefn) {
            const saved: SavedState = {
                progdef: progdef.toObj(),
                version: microcode.VERSION,
            }
            const s = JSON.stringify(saved)
            this.saveSource(slot, s)
        }

        public load(slot: string): ProgramDefn {
            try {
                const s = settings.readString(slot)
                if (s) {
                    const saved: SavedState = JSON.parse(s)
                    if (saved) return ProgramDefn.FromObj(saved.progdef)
                }
            } catch (e) {
                console.log(e)
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
