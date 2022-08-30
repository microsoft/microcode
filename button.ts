namespace microcode {
    export class Button extends Component implements ISizable, IPlaceable {
        private xfrm_: Affine;
        private icon: Sprite;
        private back: Sprite;
        //private text: TextSprite;
        private style: ButtonStyle;
        private iconId: string;
        private label: string;
        private onClick?: (button: Button) => void;

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() { return this.xfrm_; }
        //% blockCombine block="width" callInDebugger
        public get width() { return this.back ? this.back.width : this.icon.width; }
        //% blockCombine block="height" callInDebugger
        public get height() { return this.back ? this.back.height : this.icon.height; }

        public get hitbox() {
            if (this.back) { return this.back.hitbox; }
            return this.icon.hitbox;
        }

        public get rootXfrm(): Affine {
            let xfrm = this.xfrm;
            while (xfrm.parent) {
                xfrm = xfrm.parent;
            }
            return xfrm;
        }

        constructor(
            opts: {
                parent?: IPlaceable,
                style?: ButtonStyle,
                icon: string,
                label?: string,
                x: number,
                y: number,
                onClick?: (button: Button) => void
            }
        ) {
            super("button");
            this.xfrm_ = new Affine();
            this.xfrm.parent = opts.parent && opts.parent.xfrm;
            this.style = opts.style;
            this.iconId = opts.icon;
            this.label = opts.label;
            this.xfrm.localPos.x = opts.x;
            this.xfrm.localPos.y = opts.y;
            this.onClick = opts.onClick;
            this.buildSprite();
        }

        destroy() {
            if (this.icon) { this.icon.destroy(); }
            if (this.back) { this.back.destroy(); }
            //if (this.text) { this.text.destroy(); }
            this.icon = undefined;
            this.back = undefined;
            //this.text = undefined;
            super.destroy();
        }

        public getIcon() {
            return this.iconId
        }
        
        public setIcon(iconId: string) {
            this.iconId = iconId;
            this.buildSprite();
        }

        private buildSprite() {
            if (this.icon) { this.icon.destroy(); }
            if (this.back) { this.back.destroy(); }
            //if (this.text) { this.text.destroy(); }
            this.icon = new Sprite({
                parent: this,
                img: icons.get(this.iconId)
            });
            if (this.style) {
                this.back = new Sprite({
                    parent: this,
                    img: icons.get(`button_${this.style}`)
                });
            }
            this.icon.bindXfrm(this.xfrm);
            if (this.back) {
                this.back.bindXfrm(this.xfrm);
            }
        }

        public occlusions(bounds: Bounds) {
            if (this.back) { return this.back.occlusions(bounds); }
            return this.icon.occlusions(bounds);
        }

        public setVisible(visible: boolean) {
            this.icon.invisible = !visible;
            if (this.back) {
                this.back.invisible = !visible;
            }
            //if (this.text) {
            //    this.text.setFlag(SpriteFlag.Invisible, !visible);
            //}
            if (!visible) {
                this.hover(false);
            }
        }

        public visible() { return !this.icon.invisible; }
        public clickable() { return this.visible() && this.onClick != null; }

        public click() {
            if (!this.visible()) { return; }
            if (this.onClick) {
                this.onClick(this);
            }
        }

        hover(hov: boolean) {
            /*
            if (hov && this.text) { return; }
            if (!hov && !this.text) { return; }
            if (!this.label) { return; }
            if (!this.visible()) { return; }
            if (hov) {
                this.text = textsprite.create(this.label, 1, 15);
                this.text.setBorder(1, 15);
                this.text.x = this.x;
                this.text.y = this.y - this.height;
                this.text.z = this.icon.z;
            } else {
                this.text.destroy();
                this.text = undefined;
            }
            */
        }

        /* override */ update() {
            /*
            if (this.text) {
                this.text.x = this.x;
                this.text.y = this.y - this.height;
            }
            */
        }

        /* override */ draw() {
            if (this.back) {
                this.back.draw();
            }
            this.icon.draw();
            //const dbgImg = this.back ? this.back : this.icon;
            //const hitbox = Bounds.FromSprite(dbgImg);
            //const bounds = Bounds.Translate(hitbox, this.xfrm.worldPos);
            //bounds.dbgRect(15);
        }
    }
}