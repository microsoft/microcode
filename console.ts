namespace kojac {

    export class Console extends Stage {
        editBtn: Button;

        constructor(app: App) {
            super(app, "console");
        }

        initScene() {
            super.initScene();
            this.editBtn = new Button(this, "white", "edit", "Edit", 8, 112, true, () => this.handleEditClicked());
        }
        
        private handleEditClicked() {
            this.app.pushStage(new Editor(this.app));
        }
    }
}
