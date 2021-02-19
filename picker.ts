namespace kojac {

    class PickerButton extends Button {
        constructor(
            private picker: Picker,
            opts: {
                icon: string,
                label?: string,
            }
        ) {
            super(picker, {
                style: "white",
                icon: opts.icon,
                label: opts.label,
                x: 0,
                y: 0,
                onClick: () => this.picker.onButtonClicked(opts.icon)
            });
        }
    }

    export class Picker extends Stage {
        public quadtree: QuadTree;
        private cursor: Cursor;
        private groups: PickerGroup[];
        private cancelBtn: Button;

        constructor(app: App, private opts?: {
            backgroundImage?: Image;
            backgroundColor?: number;
            title?: string;
            onClick?: (btn: string) => void
        }) {
            super(app, "picker");
            this.groups = [];
            this.opts = this.opts || {};
        }

        public addGroup(label: string, btns: string[]) {
            this.groups.push(new PickerGroup(this, {label, icons: btns}));
        }

        public onButtonClicked(icon: string) {
            const onClick = this.opts.onClick;
            this.app.stageManager.pop();
            if (onClick) {
                onClick(icon);
            }
        }

        public show() {
            this.app.stageManager.push(this);
        }

        private cancelClicked() {
            this.app.stageManager.pop();
        }

        startup() {
            super.startup();
            controller.up.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveUp());
            controller.up.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveUp());
            controller.down.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveDown());
            controller.down.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveDown());
            controller.left.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveLeft());
            controller.left.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveLeft());
            controller.right.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.moveRight());
            controller.right.onEvent(ControllerButtonEvent.Repeated, () => this.cursor.moveRight());
            controller.A.onEvent(ControllerButtonEvent.Pressed, () => this.cursor.click());
            this.cursor = new Cursor(this);
            this.quadtree = new QuadTree(new Bounds({
                left: 0,
                top: 0,
                width: 2048,
                height: 2048
            }), 1, 16);
            this.cursor.quadtree = this.quadtree;
            this.cancelBtn = new Button(this, {
                style: "white",
                icon: "cancel",
                hud: true,
                x: 0,
                y: 0,
                onClick: () => this.cancelClicked()
            });
            this.layout();
        }

        shutdown() {
            this.quadtree.clear();
            this.quadtree = undefined;
            this.cursor = undefined;
            this.groups = undefined;
        }

        activate() {
            if (this.opts.backgroundImage) {
                scene.setBackgroundImage(this.opts.backgroundImage);
            } else if (this.opts.backgroundColor !== undefined) {
                scene.setBackgroundColor(this.opts.backgroundColor);
            }
        }

        draw(camera: scene.Camera) {
            super.draw(camera);
        }

        private layout() {
            this.cancelBtn.x = 40;
            this.cancelBtn.y = 40;
            this.quadtree.insert(Bounds.Translate(this.cancelBtn.hitbox, this.cancelBtn.pos), this.cancelBtn);
            this.cursor.snapTo(this.cancelBtn.x, this.cancelBtn.y);
        }
    }

    class PickerGroup {
        public buttons: Button[];
        constructor(private picker: Picker, public opts?: {
            label?: string,
            icons?: string[]
        }) {
            this.opts = this.opts || {};
            this.buttons = [];
        }

        public layout(x: number, y: number) {

        }
    }

}
