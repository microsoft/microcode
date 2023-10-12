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
            console.log(`save to ${slot}: ${s.length}b`)
            profile()
            settings.writeString(slot, s)
        }

        public save(slot: string, progdef: ProgramDefn) {
            let saved: SavedState = {
                progdef: progdef.toJson(),
                version: microcode.VERSION,
            }
            let s = JSON.stringify(saved)
            saved = undefined
            this.saveSource(slot, s)
        }

        public load(slot: string): ProgramDefn {
            try {
                let s = settings.readString(slot)
                if (s) {
                    const saved: SavedState = JSON.parse(s)
                    s = undefined
                    if (saved) return ProgramDefn.fromJson(saved.progdef)
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
