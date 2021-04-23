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
            super(picker.scene, {
                style: "white",
                icon: btn.icon,
                label: btn.label,
                x: 0,
                y: 0,
                z: 15,
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
        private prevquadtree: QuadTree;
        private prevhudtree: QuadTree;
        private prevpos: Vec2;
        private groups: PickerGroup[];
        private cancelBtn: Button;
        private panel: Bounds;
        private offset: Vec2;

        public z: number;

        constructor(scene: Scene, private opts: {
            cursor: Cursor,
            backgroundImage?: Image;
            backgroundColor?: number;
            title?: string;
            onClick?: (btn: string) => void
        }) {
            super(scene, "picker");
            this.groups = [];
            this.quadtree = new QuadTree(new Bounds({
                left: 0,
                top: 0,
                width: 2048,
                height: 2048
            }), 1, 16);
            this.prevquadtree = opts.cursor.quadtree;
            this.prevhudtree = opts.cursor.hudtree;
            this.prevpos = opts.cursor.pos;
            opts.cursor.quadtree = this.quadtree;
            opts.cursor.hudtree = new QuadTree(new Bounds({ top: 0, left: 0, width: 160, height: 160 }));
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
            const onClick = this.opts.onClick;
            this.destroy();
            if (onClick) {
                onClick(icon);
            }
        }

        private cancelClicked() {
            this.opts.cursor.cancelHandlerStack.pop();
            this.destroy();
        }

        show() {
            this.offset = this.scene.camera.offset;
            this.cancelBtn = new Button(this.scene, {
                style: "white",
                icon: "cancel",
                x: 0,
                y: 0,
                z: 15,
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
            this.opts.cursor.quadtree = this.prevquadtree;
            this.opts.cursor.hudtree = this.prevhudtree;
            this.opts.cursor.pos = this.prevpos;
            this.groups.forEach(group => group.destroy());
            this.cancelBtn.destroy();
            this.opts = undefined;
            this.quadtree = undefined;
            this.prevquadtree = undefined;
            this.prevhudtree = undefined;
            this.groups = undefined;
            super.destroy();
        }

        draw(drawOffset: Vec2) {
            const left = this.panel.left - drawOffset.x;
            const right = this.panel.right - 1 - drawOffset.x;
            const top = this.panel.top - drawOffset.y;
            const bottom = this.panel.bottom - 1 - drawOffset.y;
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
            maxBtnCount = Math.min(maxBtnCount, MAX_PER_ROW);

            let computedHeight = HEADER;
            let computedWidth = maxBtnCount * 16;

            this.groups.forEach(group => {
                if (group.opts.label) {
                    computedHeight += LABEL;
                }
                computedHeight += TRAY * Math.ceil(group.buttons.length / MAX_PER_ROW);
            });

            let computedLeft = this.offset.x + (scene.screenWidth() >> 1) - (computedWidth >> 1);
            let computedTop = this.offset.y + (scene.screenHeight() >> 1) - (computedHeight >> 1);
            computedLeft = Math.max(this.offset.x, computedLeft);
            computedTop = Math.max(this.offset.y, computedTop);

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
                group.buttons.forEach((btn, index) => {
                    if (!firstBtn) { firstBtn = btn; }
                    if (index && (index % MAX_PER_ROW) === 0) {
                        currentTop += TRAY;
                        currentLeft = computedLeft;
                    }
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
            this.opts.cursor.snapTo(firstBtn.pos.x, firstBtn.pos.y);
        }
    }

    const HEADER = 16;
    const LABEL = 14;
    const TRAY = 16;
    const MAX_PER_ROW = 7;
}
