namespace microcode {
    export type MenuDirection = "up" | "down" | "right"

    export type MenuItemDefn = {
        icon: string
        label: string
        style?: ButtonStyle
    }

    export class Menu extends Component implements IPlaceable {
        private xfrm_: Affine
        buttons: Button[]

        public get xfrm() {
            return this.xfrm_
        }

        constructor(private items: MenuItemDefn[], private wrap: number = 4) {
            super("menu")
            this.xfrm_ = new Affine()
            this.buttons = []
        }

        public show(
            x: number,
            y: number,
            direction: MenuDirection,
            onSelect: (button: Button) => void
        ) {
            const origX = x
            const origY = y
            if (this.isVisible()) {
                this.hide()
            }
            this.items.forEach((item, index) => {
                const icon = icons.get(item.icon)
                item.style = item.style || "white"
                const button = new Button({
                    parent: this,
                    style: item.style,
                    icon: item.icon,
                    label: item.label,
                    x,
                    y,
                    onClick: button => onSelect(button),
                })
                this.buttons.push(button)
                if (direction === "right") {
                    x += icon.width
                } else if (direction === "up") {
                    y -= icon.height
                } else if (direction === "down") {
                    y += icon.height
                }
                if (this.wrap > 0 && index > 0 && !((index + 1) % this.wrap)) {
                    if (direction === "right") {
                        y += icon.height
                        x = origX
                    } else if (direction === "up") {
                        x -= icon.width
                        y = origY
                    } else if (direction === "down") {
                        x += icon.width
                        y = origY
                    }
                }
            })
        }

        public hide() {
            for (let button of this.buttons) {
                button.destroy()
            }
            this.buttons = []
        }

        public isVisible() {
            return this.buttons.length > 0
        }

        /* override */ destroy() {
            this.hide()
            super.destroy()
        }

        /* override */ update() {
            this.buttons.forEach(button => button.update())
        }

        /* override */ draw() {
            this.buttons.forEach(button => button.draw())
        }
    }
}
