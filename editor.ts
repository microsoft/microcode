namespace kojac {

    class Page extends Stage {
        constructor(app: App, pagedef: PageDefn) {
            super(app, "page");
        }
    }

    export class Editor extends Stage {
        private progdef: ProgramDefn;

        constructor(app: App) {
            super(app, "editor");
        }

        startup() {
            super.startup();
            controller.right.onEvent(ControllerButtonEvent.Released, function() {
                this.app.popStage();
            });
        }

        shutdown() {
            this.progdef = undefined;
            super.shutdown();
        }

        activate() {
            super.activate();
            scene.setBackgroundColor(11);
            this.progdef = this.app.load(SAVESLOT_AUTO);
        }
    }
}