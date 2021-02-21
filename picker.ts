namespace kojac {

    export type PickerButtonDef = {
        icon: string;
        label?: string;
    };

    class PickerButton extends Button {
        constructor(
            private picker: Picker,
            btn: PickerButtonDef
        ) {
            super(picker.stage, {
                style: "white",
                icon: btn.icon,
                label: btn.label,
                x: 0,
                y: 0,
                z: 15,
                hud: true,
                onClick: () => this.picker.onButtonClicked(btn.icon)
            });
            this.z = 11;
        }
    }

    class PickerGroup {
        public buttons: Button[];
        constructor(private picker: Picker, public opts?: {
            label?: string;
            btns?: PickerButtonDef[];
        }) {
            this.opts = this.opts || {};
            this.buttons = [];
        }

        public destroy() {
            this.buttons.forEach(btn => btn.destroy());
            this.buttons = undefined;
            this.opts = undefined;
        }
    }

    export class Picker extends Component {
        private quadtree: QuadTree;
        private prevtree: QuadTree;
        private prevpos: Vec2;
        private groups: PickerGroup[];
        private cancelBtn: Button;
        private panel: Bounds;

        public z: number;

        constructor(stage: Stage, private opts: {
            cursor: Cursor,
            backgroundImage?: Image;
            backgroundColor?: number;
            title?: string;
            onClick?: (btn: string) => void
        }) {
            super(stage, "picker");
            this.groups = [];
            this.quadtree = new QuadTree(new Bounds({
                left: 0,
                top: 0,
                width: 2048,
                height: 2048
            }), 1, 16);
            this.prevtree = opts.cursor.quadtree;
            this.prevpos = opts.cursor.pos;
            opts.cursor.quadtree = this.quadtree;
            opts.cursor.cancelHandlerStack.push(() => this.cancelClicked());
            this.z = 10;
        }

        public addGroup(opts: {
            label: string;
            btns: PickerButtonDef[];
        }) {
            this.groups.push(new PickerGroup(this, opts));
        }

        public onButtonClicked(icon: string) {
            this.opts.cursor.cancelHandlerStack.pop();
            if (this.opts.onClick) {
                this.opts.onClick(icon);
            }
            this.destroy();
        }

        private cancelClicked() {
            this.opts.cursor.cancelHandlerStack.pop();
            this.destroy();
        }

        show() {
            this.cancelBtn = new Button(this.stage, {
                style: "white",
                icon: "cancel",
                x: 0,
                y: 0,
                z: 15,
                hud: true,
                onClick: () => this.cancelClicked()
            });
            this.groups.forEach(group => {
                const btns = group.opts.btns || [];
                btns.forEach(btn => {
                    const button = new PickerButton(this, btn);
                    group.buttons.push(button);
                });
            });
            this.layout();
        }

        destroy() {
            this.quadtree.clear();
            this.opts.cursor.quadtree = this.prevtree;
            this.opts.cursor.pos = this.prevpos;
            this.groups.forEach(group => group.destroy());
            this.cancelBtn.destroy();
            this.opts = undefined;
            this.quadtree = undefined;
            this.prevtree = undefined;
            this.groups = undefined;
            super.destroy();
        }

        update(dt: number) {
            this.quadtree.offset = this.stage.camera.offset;
        }

        draw(drawOffset: Vec2) {
            drawOffset = new Vec2(0, 0);
            const left = this.panel.left;
            const right = this.panel.right - 1;
            const top = this.panel.top;
            const bottom = this.panel.bottom - 1;
            this.panel.fillRect(drawOffset, 15);
            screen.drawLine(left + 1, top - 1, right - 1, top - 1, 15);
            screen.drawLine(left + 1, bottom + 1, right - 1, bottom + 1, 15);
            screen.drawLine(left - 1, top + 1, left - 1, bottom - 1, 15);
            screen.drawLine(right + 1, top + 1, right + 1, bottom - 1, 15);
            if (this.opts.title) {
                screen.print(this.opts.title, left + 2, top + 4, 1, image.font8);
            }
            //this.quadtree.draw(drawOffset, 5);
        }

        private layout() {
            let firstBtn: Button;

            let maxBtnCount = 0;
            this.groups.forEach(group => maxBtnCount = Math.max(maxBtnCount, group.opts.btns.length));

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
            computedLeft = Math.max(0, computedLeft);
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
            this.opts.cursor.snapTo(firstBtn.worldPos.x, firstBtn.worldPos.y);
        }
    }

    const HEADER = 16;
    const LABEL = 14;
    const TRAY = 16;
}
