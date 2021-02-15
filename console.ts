namespace kojac {
    enum ConsoleView {
        Log, Plot
    };

    export class Console extends Stage {
        currView: ConsoleView;
        cursor: Cursor;
        editBtn: Button;
        logBtn: Button;
        plotBtn: Button;
        logLines: string[];

        constructor(app: App) {
            super(app, "console");
            this.currView = ConsoleView.Log;
        }

        initScene() {
            super.initScene();
            scene.setBackgroundColor(15);
            this.cursor = new Cursor(this);
            let top = 111;
            let left = 8;
            left += 1;
            this.editBtn = new Button(this, "white", "edit", "Edit", left, top, true, () => this.handleEditClicked());
            let right = scene.screenWidth() - 8;
            right -= 1;
            this.plotBtn = new Button(this, "white", "plot", "Plot", right, top, true, () => this.handlePlotClicked());
            this.logBtn = new Button(this, "white", "log", "Log", right, top, true, () => this.handleConsoleClicked());
            this.setConsoleView(this.currView);
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

        private setConsoleView(view: ConsoleView) {
            this.currView = view;
            this.logBtn.setVisible(view !== ConsoleView.Log);
            this.plotBtn.setVisible(view !== ConsoleView.Plot);
        }

        __draw(camera: scene.Camera) {
            const toolbarHeight = 18;
            const top = scene.screenHeight() - toolbarHeight;
            screen.fillRect(0, top, scene.screenWidth(), toolbarHeight, 11);

            if (this.currView === ConsoleView.Log) {
                this.drawLogView();
            } else if (this.currView === ConsoleView.Plot) {
                this.drawPlotView();
            }
        }

        private drawLogView() {

        }

        private drawPlotView() {
            
        }
    }
}
