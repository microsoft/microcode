namespace kojac {
    export class Button extends Component {
        icon: Kelpie;
        back: Kelpie;
        text: TextSprite;

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

        constructor(
            stage: Stage,
            private style: ButtonStyle,
            private iconId: string,
            private label: string,
            public x: number,
            public y: number,
            private hud: boolean,
            private onClick?: (button: Button) => void
        ) {
            super(stage, "button");
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
            this.icon = new Kelpie(icons.get(this.iconId));
            this.icon.hud = this.hud;
            if (this.style) {
                this.back = new Kelpie(icons.get(`button_${this.style}`));
                this.back.hud = this.hud;
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

        public moveTo(x: number, y: number) {
            this.x = x;
            this.y = y;
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
            if (this.hud) {
                this.updateScreenRelative();
            } else {
                this.updateAbsolute();
            }
        }

        updateAbsolute() {
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

        updateScreenRelative() {
            const camera = this.stage.camera;
            camera.setScreenRelativePosition(this.icon, this.x, this.y);
            if (this.back) {
                camera.setScreenRelativePosition(this.back, this.x, this.y);
            }
            if (this.text) {
                camera.setScreenRelativePosition(this.text, this.x, this.y - this.height);
            }
        }
    }
}