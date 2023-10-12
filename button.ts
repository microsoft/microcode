namespace microcode {
    export class Borders {
        constructor(
            public top: number,
            public bottom: number,
            public left: number,
            public right: number
        ) {}
    }

    export class ButtonStyle {
        constructor(
            public fill: number,
            public borders: Borders,
            public shadow: boolean
        ) {}
    }

    export namespace ButtonStyles {
        export const ShadowedWhite = new ButtonStyle(
            1,
            new Borders(1, 12, 1, 1),
            true
        )
        export const LightShadowedWhite = new ButtonStyle(
            1,
            new Borders(1, 11, 1, 1),
            true
        )
        export const FlatWhite = new ButtonStyle(
            1,
            new Borders(1, 1, 1, 1),
            false
        )
        export const RectangleWhite = new ButtonStyle(
            1,
            new Borders(0, 0, 0, 0),
            false
        )
        export const BorderedPurple = new ButtonStyle(
            11,
            new Borders(12, 12, 12, 12),
            false
        )
        export const RedBorderedWhite = new ButtonStyle(
            1,
            new Borders(2, 2, 2, 2),
            false
        )
        export const Transparent = new ButtonStyle(
            0,
            new Borders(0, 0, 0, 0),
            false
        )
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
        private style: ButtonStyle
        private iconId: string | Image
        private _ariaId: string
        public onClick?: (button: Button) => void

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
            // This isn't quite right, but it's close enough for now
            return Bounds.GrowXY(
                this.icon.bounds,
                borderLeft(this.style),
                borderTop(this.style)
            )
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

        public getIcon() {
            return this.iconId
        }

        public setIcon(iconId: string, img?: Image) {
            this.iconId = iconId
            if (img) this.icon.setImage(img)
            else this.buildSprite()
        }

        public getImage() {
            return this.icon.image
        }

        private buildSprite() {
            this.icon = new Sprite({
                parent: this,
                img:
                    typeof this.iconId == "string"
                        ? icons.get(this.iconId)
                        : this.iconId,
            })
            this.icon.xfrm.parent = this.xfrm
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

        hover(hov: boolean) {}

        update() {}

        isOffScreenX(): boolean {
            return this.icon.isOffScreenX()
        }

        draw() {
            control.enablePerfCounter()
            this.drawStyle()
            this.drawIcon()
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
