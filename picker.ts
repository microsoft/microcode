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

    class PickerGroup {
        public buttons: Button[];
        constructor(private picker: Picker, public opts?: {
            label?: string,
            icons?: string[]
        }) {
            this.opts = this.opts || {};
            this.buttons = [];
        }
    }

    export class Picker extends Stage {
        public quadtree: QuadTree;
        private cursor: Cursor;
        private groups: PickerGroup[];
        private cancelBtn: Button;
        private panel: Bounds;

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

        public addGroup(opts: {
            label?: string;
            btns: string[];
        }) {
            this.groups.push(new PickerGroup(this, { label: opts.label, icons: opts.btns }));
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
                x: 0,
                y: 0,
                onClick: () => this.cancelClicked()
            });
            this.groups.forEach(group => {
                const icons = group.opts.icons || [];
                icons.forEach(icon => {
                    const button = new PickerButton(this, {
                        icon,
                    });
                    group.buttons.push(button);
                });
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
            const ofs = new Vec2(camera.drawOffsetX, camera.drawOffsetY);
            const left = this.panel.left;
            const right = this.panel.right - 1;
            const top = this.panel.top;
            const bottom = this.panel.bottom - 1;
            this.panel.fill(ofs, 15);
            screen.drawLine(left + 1, top - 1, right - 1, top - 1, 15);
            screen.drawLine(left + 1, bottom + 1, right - 1, bottom + 1, 15);
            screen.drawLine(left - 1, top + 1, left - 1, bottom - 1, 15);
            screen.drawLine(right + 1, top + 1, right + 1, bottom - 1, 15);
            super.draw(camera);
            //this.quadtree.draw(new Vec2(camera.drawOffsetX, camera.drawOffsetY), 5);
        }

        private layout() {
            let firstBtn: Button;

            let maxBtnCount = 0;
            this.groups.forEach(group => maxBtnCount = Math.max(maxBtnCount, group.opts.icons.length));

            let computedHeight = HEADER;
            let computedWidth = maxBtnCount * 16;

            this.groups.forEach(group => {
                if (group.opts.label) {
                    computedHeight += LABEL;
                }
                computedHeight += TRAY;
            });

            let computedLeft = (scene.screenWidth() >> 1) - (computedWidth >> 1);
            let computedTop = (scene.screenHeight() >> 1) - (computedHeight >> 1);
            computedTop = Math.max(0, computedTop);

            this.panel = new Bounds({
                top: computedTop,
                left: computedLeft,
                width: computedWidth,
                height: computedHeight
            });
            this.panel = Bounds.Grow(this.panel, 2);

            let currentTop = computedTop + HEADER;
            this.groups.forEach(group => {
                let currentLeft = computedLeft;
                if (group.opts.label) {
                    currentTop += LABEL;
                }
                group.buttons.forEach(btn => {
                    if (!firstBtn) { firstBtn = btn; }
                    btn.y = currentTop + 8;
                    btn.x = currentLeft + 8;
                    currentLeft += 16;
                    this.quadtree.insert(Bounds.Translate(btn.hitbox, btn.pos), btn);
                });
            });

            this.cancelBtn.x = computedLeft + computedWidth - 8;
            this.cancelBtn.y = computedTop + 8;
            this.quadtree.insert(Bounds.Translate(this.cancelBtn.hitbox, this.cancelBtn.pos), this.cancelBtn);
            if (!firstBtn) { firstBtn = this.cancelBtn; }
            this.cursor.snapTo(firstBtn.x, firstBtn.y);
        }
    }

    const HEADER = 16;
    const LABEL = 14;
    const TRAY = 16;
}
