namespace kojac {
    // Auto-save slot
    export const SAVESLOT_AUTO = "sa";
    // Save slots
    export const SAVESLOT_1 = "s1";
    export const SAVESLOT_2 = "s2";
    export const SAVESLOT_3 = "s3";

    type SavedState = {
        progdef: any;
    };

    export class App {
        stageManager: StageManager;

        constructor() {
            // One interval delay to ensure all static constructors have executed.
            setTimeout(() => {
                controller.setRepeatDefault(200, 20);
                icons.init();
                this.stageManager = new StageManager();
                const home = new Home(this);
                this.pushStage(home);
            }, 1);
        }

        public save(slot: string, progdef: ProgramDefn) {
            const saved: SavedState = {
                progdef: progdef.toObj()
            };
            const s = JSON.stringify(saved);
            settings.writeString(slot, s);
        }

        public load(slot: string): ProgramDefn {
            const s = settings.readString(slot);
            if (s) {
                const saved: SavedState = JSON.parse(s);
                if (saved) {
                    return ProgramDefn.FromObj(saved.progdef);
                }
            }
            return undefined;
        }

        public pushStage(stage: Stage) {
            this.stageManager.push(stage);
        }

        public popStage() {
            this.stageManager.pop();
        }
    }
}
