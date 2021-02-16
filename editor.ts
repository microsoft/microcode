namespace kojac {

    class Page extends Stage {
        constructor(app: App, pagedef: PageDefn) {
            super(app, "page");
        }
    }

    export class Editor extends Stage {
        private pdefn: ProgramDefn;

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
            this.pdefn = undefined;
            super.shutdown();
        }

        activate() {
            super.activate();
            scene.setBackgroundColor(11);
            this.pdefn = this.app.load(SAVESLOT_AUTO);
        }
    }
}