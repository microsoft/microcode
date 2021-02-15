namespace kojac {

    export class Console extends Stage {
        editBtn: Button;
        consoleBtn: Button;
        plotBtn: Button;

        constructor(app: App) {
            super(app, "console");
        }

        initScene() {
            super.initScene();
            this.editBtn = new Button(this, "white", "edit", "Edit", 8, 112, true, () => this.handleEditClicked());
            this.consoleBtn = new Button(this, "white", "log", "Log", 1 + 8 + 16, 112, true, () => this.handleConsoleClicked());
            this.plotBtn = new Button(this, "white", "plot", "Plot", 2 + 8 + 16 + 16, 112, true, () => this.handlePlotClicked());
        }
        
        private handleEditClicked() {
            this.app.pushStage(new Editor(this.app));
        }

        private handleConsoleClicked() {
        }

        private handlePlotClicked() {
        }
    }
}
