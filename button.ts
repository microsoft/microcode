namespace microcode {
    export interface ButtonStyle {
        fill: number
        borders: { top: number; bottom: number; left: number; right: number }
        shadow: boolean
    }

    export namespace ButtonStyles {
        export const ShadowedWhite: ButtonStyle = {
            fill: 1,
            borders: { top: 1, bottom: 12, left: 1, right: 1 },
            shadow: true,
        }
        export const LightShadowedWhite: ButtonStyle = {
            fill: 1,
            borders: { top: 1, bottom: 11, left: 1, right: 1 },
            shadow: true,
        }
        export const FlatWhite: ButtonStyle = {
            fill: 1,
            borders: { top: 1, bottom: 1, left: 1, right: 1 },
            shadow: false,
        }
        export const RectangleWhite: ButtonStyle = {
            fill: 1,
            borders: { top: 0, bottom: 0, left: 0, right: 0 },
            shadow: false,
        }
        export const BorderedPurple: ButtonStyle = {
            fill: 11,
            borders: { top: 12, bottom: 12, left: 12, right: 12 },
            shadow: false,
        }
        export const RedBorderedWhite: ButtonStyle = {
            fill: 1,
            borders: { top: 2, bottom: 2, left: 2, right: 2 },
            shadow: false,
        }
        export const Transparent: ButtonStyle = {
            fill: 0,
            borders: { top: 0, bottom: 0, left: 0, right: 0 },
            shadow: false,
        }
    }

    export function borderLeft(style: ButtonStyle) {
        return style.borders.left ? 1 : 0
    }

    export function borderTop(style: ButtonStyle) {
        return style.borders.top ? 1 : 0
    }

    export function borderRight(style: ButtonStyle) {
        return style.borders.right ? 1 : 0
    }

    export function borderBottom(style: ButtonStyle) {
        return style.borders.bottom ? 1 : 0
    }

    export function borderWidth(style: ButtonStyle) {
        return borderLeft(style) + borderRight(style)
    }

    export function borderHeight(style: ButtonStyle) {
        return borderTop(style) + borderBottom(style)
    }

    export class Button implements IComponent, ISizable, IPlaceable {
        private xfrm_: Affine
        private icon: Sprite
        //private text: TextSprite;
        private style: ButtonStyle
        private iconId: string | Image
        private _ariaId: string
        public onClick?: (button: Button) => void
        private bounds_: Bounds

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() {
            return this.xfrm_
        }
        //% blockCombine block="width" callInDebugger
        public get width() {
            return this.bounds.width
        }
        //% blockCombine block="height" callInDebugger
        public get height() {
            return this.bounds.height
        }

        public get ariaId(): string {
            return (
                this._ariaId ||
                (typeof this.iconId === "string" ? <string>this.iconId : "")
            )
        }

        public set ariaId(value: string) {
            this._ariaId = value
        }

        reportAria(force = false) {
            const msg: accessibility.TileAccessibilityMessage = {
                type: "tile",
                value: this.ariaId,
                force,
            }
            accessibility.setLiveContent(msg)
        }

        public get bounds() {
            // Returns bounds in local space
            return this.bounds_
        }

        public get rootXfrm(): Affine {
            let xfrm = this.xfrm
            while (xfrm.parent) {
                xfrm = xfrm.parent
            }
            return xfrm
        }

        constructor(opts: {
            parent?: IPlaceable
            style?: ButtonStyle
            icon: string | Image
            ariaId?: string
            x: number
            y: number
            onClick?: (button: Button) => void
        }) {
            this.xfrm_ = new Affine()
            this.xfrm.parent = opts.parent && opts.parent.xfrm
            this.style = opts.style || ButtonStyles.Transparent
            this.iconId = opts.icon
            this._ariaId = opts.ariaId
            this.xfrm.localPos.x = opts.x
            this.xfrm.localPos.y = opts.y
            this.onClick = opts.onClick
            this.buildSprite()
        }

        destroy() {
            if (this.icon) {
                this.icon.destroy()
            }
            this.icon = undefined
        }

        public getIcon() {
            return this.iconId
        }

        public setIcon(iconId: string, img?: Image) {
            this.iconId = iconId
            if (img)
                this.icon.setImage(img)
            else
                this.buildSprite()
        }

        public getImage() {
            return this.icon.image
        }

        private buildSprite() {
            if (this.icon) {
                this.icon.destroy()
            }
            //if (this.text) { this.text.destroy(); }
            this.icon = new Sprite({
                parent: this,
                img:
                    typeof this.iconId == "string"
                        ? icons.get(this.iconId)
                        : this.iconId,
            })
            this.icon.xfrm.parent = this.xfrm
            //this.icon.xfrm.localPos.x = borderLeft(this.style);
            //this.icon.xfrm.localPos.y = borderTop(this.style);

            // This isn't quite right, but it's close enough for now
            this.bounds_ = Bounds.GrowXY(
                this.icon.bounds,
                borderLeft(this.style),
                borderTop(this.style)
            )
        }

        public occlusions(bounds: Bounds) {
            return this.icon.occlusions(bounds)
        }

        public setVisible(visible: boolean) {
            this.icon.invisible = !visible
            //if (this.text) {
            //    this.text.setFlag(SpriteFlag.Invisible, !visible);
            //}
            if (!visible) {
                this.hover(false)
            }
        }

        public visible() {
            return !this.icon.invisible
        }
        public clickable() {
            return this.visible() && this.onClick != null
        }

        public click() {
            if (!this.visible()) {
                return
            }
            if (this.onClick) {
                this.onClick(this)
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

        isOffScreenX(): boolean {
            return this.icon.isOffScreenX()
        }

        /* override */ draw() {
            control.enablePerfCounter()
            this.drawStyle()
            this.drawIcon()
            //const iconbounds = Bounds.Translate(this.icon.bounds, this.icon.xfrm.worldPos);
            //iconbounds.drawRect(5);
            //const mybounds = Bounds.Translate(this.bounds, this.xfrm.worldPos);
            //mybounds.drawRect(14)
        }

        private drawIcon() {
            control.enablePerfCounter()
            this.icon.draw()
        }

        private drawStyle() {
            control.enablePerfCounter()
            if (this.style.fill)
                Screen.fillBoundsXfrm(
                    this.xfrm,
                    this.icon.bounds,
                    this.style.fill
                )
            if (this.style.borders)
                Screen.outlineBoundsXfrm4(
                    this.xfrm,
                    this.icon.bounds,
                    1,
                    this.style.borders
                )
            if (this.style.shadow) {
                Screen.setPixelXfrm(
                    this.xfrm,
                    this.icon.bounds.left - 1,
                    this.icon.bounds.bottom,
                    this.style.borders.bottom
                )
                Screen.setPixelXfrm(
                    this.xfrm,
                    this.icon.bounds.right + 1,
                    this.icon.bounds.bottom,
                    this.style.borders.bottom
                )
            }
        }
    }
}
