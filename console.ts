namespace kojac {

    export class Console extends Stage {
        cursor: Cursor;
        editBtn: Button;
        logBtn: Button;
        plotBtn: Button;

        constructor(app: App) {
            super(app, "console");
        }

        initScene() {
            super.initScene();
            scene.setBackgroundColor(13);
            this.cursor = new Cursor(this);
            let top = 112;
            let left = 8;
            this.editBtn = new Button(this, "white", "edit", "Edit", left, top, true, () => this.handleEditClicked());
            left += 16;
            left += 4;
            left += 1;

            let right = scene.screenWidth() - 8;
            this.plotBtn = new Button(this, "white", "plot", "Plot", right, top, true, () => this.handlePlotClicked());
            right -= 16;
            right -= 1;
            this.logBtn = new Button(this, "white", "log", "Log", right, top, true, () => this.handleConsoleClicked());
            this.cursor.add(this.editBtn);
            this.cursor.add(this.logBtn);
            this.cursor.add(this.plotBtn);
        }

        private handleEditClicked() {
            this.app.pushStage(new Editor(this.app));
        }

        private handleConsoleClicked() {
        }

        private handlePlotClicked() {
        }

        __draw(camera: scene.Camera) {
            const height = 17;
            const top = scene.screenHeight() - height;
            screen.fillRect(0, top, scene.screenWidth(), height, 11);
        }
    }
}
