namespace microcode {
    // Auto-save slot
    export const SAVESLOT_AUTO = "sa"

    export interface SavedState {
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

        private saveSource(slot: string, s: string) {
            reportEvent("app.save", { slot: slot, size: s.length })
            console.log(`save to ${slot}: ${s.length}b`)
            profile()
            settings.writeString(slot, s)
        }

        private saveBuffer(slot: string, buf: Buffer) {
            reportEvent("app.save", { slot: slot, size: buf.length })
            console.log(`save to ${slot}: ${buf.length}b`)
            profile()
            settings.writeBuffer(slot, buf)
        }

        private save(slot: string, prog: ProgramDefn) {
            let saved: SavedState = {
                progdef: progDefnToJson(prog),
                version: microcode.VERSION,
            }
            let s = JSON.stringify(saved)
            saved = undefined
            this.saveSource(slot, s)
        }

        public saveAsBuffer(slot: string, prog: ProgramDefn) {
            this.saveBuffer(slot, prog.toBuffer())
        }

        private load(slot: string): ProgramDefn {
            try {
                let s = settings.readString(slot)
                if (s) {
                    const saved: SavedState = JSON.parse(s)
                    s = undefined
                    if (saved) return progDefnFromJson(saved.progdef)
                }
            } catch (e) {
                console.log(e)
            }
            return undefined
        }

        public loadFromBuffer(slot: string): ProgramDefn {
            try {
                let buf = settings.readBuffer(slot)
                if (buf) {
                    return ProgramDefn.fromBuffer(new BufferReader(buf))
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
