namespace kojac {
    // Auto-save slot
    export const SAVESLOT_AUTO = "sa";
    // Save slots
    export const SAVESLOT_1 = "s1";
    export const SAVESLOT_2 = "s2";
    export const SAVESLOT_3 = "s3";

    type SavedState = {
        bdefn: any;
    };

    export class App {
        stageManager: StageManager;

        constructor() {
            // One interval delay to ensure all static constructors have executed.
            setTimeout(() => {
                icons.init();
                this.stageManager = new StageManager();
                const home = new Home(this);
                this.pushStage(home);
            }, 1);
        }

        public save(slot: string, bdefn: BrainDefn) {
            const saved: SavedState = {
                bdefn: bdefn.toObj()
            };
            const s = JSON.stringify(saved);
            settings.writeString(slot, s);
        }

        public load(slot: string): BrainDefn {
            const s = settings.readString(slot);
            if (s) {
                const saved: SavedState = JSON.parse(s);
                if (saved) {
                    return BrainDefn.FromObj(saved.bdefn);
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
