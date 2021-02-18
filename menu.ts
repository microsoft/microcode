namespace kojac {
    export type MenuDirection
        = "up"
        | "down"
        | "right"
        ;

    export type MenuItemDefn = {
        icon: string;
        label: string;
        style?: ButtonStyle;
    };

    export class Menu extends Component {
        buttons: Button[];

        constructor(stage: Stage, private layer: StageLayer, private items: MenuItemDefn[], private wrap: number = 4) {
            super(stage, layer, "menu");
            this.buttons = [];
        }

        public show(x: number, y: number, direction: MenuDirection, onSelect: (button: Button) => void) {
            const origX = x;
            const origY = y;
            if (this.isVisible()) { this.hide(); }
            this.items.forEach((item, index) => {
                const icon = icons.get(item.icon);
                item.style = item.style || "white";
                const button = new Button(this.stage, this.layer, {
                    style: item.style,
                    icon: item.icon,
                    label: item.label,
                    x,
                    y,
                    onClick: (button) => onSelect(button)
                });
                this.buttons.push(button);
                if (direction === "right") { x += icon.width; }
                else if (direction === "up") { y -= icon.height; }
                else if (direction === "down") { y += icon.height; }
                if (this.wrap > 0 && index > 0 && !((index + 1) % this.wrap)) {
                    if (direction === "right") { y += icon.height; x = origX; }
                    else if (direction === "up") { x -= icon.width; y = origY; }
                    else if (direction === "down") { x += icon.width; y = origY; }
                }
            });
        }

        public hide() {
            for (let button of this.buttons) {
                button.destroy();
            }
            this.buttons = [];
        }

        public destroy() {
            this.hide();
            this.stage.remove(this);
        }

        public isVisible() {
            return this.buttons.length > 0;
        }

        update(dt: number) {
            this.buttons.forEach(button => button.update(dt));
        }
    }
}