namespace kojac {
    export class Button extends Component {
        private icon: Kelpie;
        private back: Kelpie;
        private text: TextSprite;
        private layer: StageLayer;
        private style: ButtonStyle;
        private iconId: string;
        private label: string;
        public x: number;
        public y: number;
        private onClick?: (button: Button) => void;

        //% blockCombine block="width" callInDebugger
        get width() { return this.back ? this.back.width : this.icon.width; }
        //% blockCombine block="height" callInDebugger
        get height() { return this.back ? this.back.height : this.icon.height; }
        //% blockCombine block="z" callInDebugger
        get z() { return this.icon.z; }
        set z(n: number) {
            this.icon.z = n;
            if (this.back) {
                this.back.z = n - 1;
            }
            if (this.text) {
                this.text.z = n;
            }
        }

        //% blockCombine block="z" callInDebugger
        get pos() { return new Vec2(this.x, this.y); }
        set pos(v: Vec2) {
            this.x = v.x;
            this.y = v.y;
        }

        constructor(
            stage: Stage,
            layer: StageLayer,
            opts: {
                style?: ButtonStyle,
                icon: string,
                label?: string,
                x: number,
                y: number,
                onClick?: (button: Button) => void
            }
        ) {
            super(stage, layer, "button");
            this.layer = layer;
            this.style = opts.style;
            this.iconId = opts.icon;
            this.label = opts.label;
            this.x = opts.x;
            this.y = opts.y;
            this.onClick = opts.onClick;
            this.buildSprite(0);
        }

        destroy() {
            if (this.icon) { this.icon.destroy(); }
            if (this.back) { this.back.destroy(); }
            if (this.text) { this.text.destroy(); }
            this.icon = undefined;
            this.back = undefined;
            this.text = undefined;
            super.destroy();
        }

        public setIcon(iconId: string) {
            this.iconId = iconId;
            this.buildSprite(this.z);
        }

        private buildSprite(z_: number) {
            if (this.icon) { this.icon.destroy(); }
            if (this.back) { this.back.destroy(); }
            if (this.text) { this.text.destroy(); }
            this.icon = new Kelpie(this.stage, this.layer, icons.get(this.iconId));
            if (this.style) {
                this.back = new Kelpie(this.stage, this.layer, icons.get(`button_${this.style}`));
            }
            this.icon.x = this.x;
            this.icon.y = this.y;
            this.icon.z = z_;
            if (this.back) {
                this.back.x = this.x;
                this.back.y = this.y;
                this.back.z = this.z - 1;
            }
        }

        public setVisible(visible: boolean) {
            this.icon.invisible = !visible;
            if (this.back) {
                this.back.invisible = !visible;
            }
            if (this.text) {
                this.text.setFlag(SpriteFlag.Invisible, !visible);
            }
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
        }

        update(dt: number) {
            this.icon.x = this.x;
            this.icon.y = this.y;
            if (this.back) {
                this.back.x = this.x;
                this.back.y = this.y;
            }
            if (this.text) {
                this.text.x = this.x;
                this.text.y = this.y - this.height;
            }
        }
    }
}