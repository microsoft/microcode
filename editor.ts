namespace kojac {

    class PageEditor extends Stage {
        constructor(app: App, pagedef: PageDefn) {
            super(app, "page_editor");
        }
    }

    export class Editor extends Stage {
        private progdef: ProgramDefn;
        private currPage: number;
        private pageBtn: Button;

        constructor(app: App) {
            super(app, "editor");
        }

        startup() {
            super.startup();
            controller.right.onEvent(ControllerButtonEvent.Released, function() {
                this.app.popStage();
            });
            this.currPage = 0;
            this.pageBtn = new Button(
                this,
                StageLayer.HUD,
                "white",
                PAGE_IDS[this.currPage],
                "page",
                scene.screenWidth() >> 1, 8);
        }

        shutdown() {
            this.progdef = undefined;
            super.shutdown();
        }

        activate() {
            super.activate();
            scene.setBackgroundColor(11);
            this.progdef = this.app.load(SAVESLOT_AUTO);
            this.currPage = 0;
            this.pageBtn.setIcon(PAGE_IDS[this.currPage]);
        }
    }
}