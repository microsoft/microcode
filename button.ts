namespace kodu {
    export class Button extends Component {
        icon: Kelpie;
        back: Kelpie;
        text: TextSprite;

        get id() { return this.iconId; }
        get width() { return this.back ? this.back.width : this.icon.width; }
        get height() { return this.back ? this.back.height : this.icon.height; }
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
        get data() { return this.icon.data; }

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
            this.buildSprite(900);
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
                        if (this.icon) {
                this.icon.destroy();
            }
            this.icon = new Kelpie(icons.get(this.iconId));
            if (this.style) {
                this.back = new Kelpie(icons.get(`button_${this.style}`));
            }
            this.icon.x = this.x;
            this.icon.y = this.y;
            this.icon.z = z_;
            this.icon.data["kind"] = "button";
            this.icon.data["component"] = this;
            if (this.back) {
                this.back.x = this.x;
                this.back.y = this.y;
                this.back.z = this.z - 1;
                this.back.data["kind"] = "button";
                this.back.data["component"] = this;
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

        public clickable() { return this.onClick != null; }

        public click() {
            if (this.icon.invisible) { return; }
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
            if (hov) {
                this.text = textsprite.create(this.label, 1, 15);
                this.text.setBorder(1, 15);
                this.text.x = this.x;
                this.text.y = this.y - this.height;
                this.text.z = this.icon.z;
            } else {
                this.text.destroy();
                this.text = null;
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