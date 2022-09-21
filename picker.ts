namespace microcode {
    export type PickerButtonDef = {
        icon: string | Image
        label?: string
    }

    export class PickerButton extends Button {
        constructor(public picker: Picker, btn: PickerButtonDef) {
            super({
                parent: picker,
                style: ButtonStyles.ShadowedWhite,
                icon: btn.icon,
                label: btn.label,
                x: 0,
                y: 0,
                onClick: () =>
                    this.picker.onButtonClicked(this, <string>btn.icon),
            })
        }
    }

    class PickerGroup {
        public buttons: Button[]
        constructor(
            private picker: Picker,
            public opts?: {
                label?: string
                btns?: PickerButtonDef[]
            }
        ) {
            this.opts = this.opts || {}
            this.buttons = []
        }

        public destroy() {
            this.buttons.forEach(btn => btn.destroy())
            this.buttons = undefined
            this.opts = undefined
        }
    }

    export class Picker extends Component implements IPlaceable {
        public groups: PickerGroup[]
        private xfrm_: Affine
        private navigator: INavigator
        private prevNavigator: INavigator
        private prevpos: Vec2
        private prevAriaId: string
        private deleteBtn: Button
        private panel: Bounds
        private onClick: (btn: string, button?: Button) => void
        private onHide: () => void
        private onDelete: () => void
        private hideOnClick: boolean
        private title: string
        public visible: boolean

        public get xfrm() {
            return this.xfrm_
        }

        constructor(private cursor: Cursor) {
            super("picker")
            this.xfrm_ = new Affine()
            this.groups = []
            this.navigator = new RowNavigator()
        }

        public addGroup(opts: { label: string; btns: PickerButtonDef[] }) {
            this.groups.push(new PickerGroup(this, opts))
        }

        public onButtonClicked(button: PickerButton, icon: string) {
            const onClick = this.onClick
            if (this.hideOnClick) {
                this.cursor.cancelHandlerStack.pop()
                this.hide()
            }
            if (onClick) {
                onClick(icon, button)
            }
        }

        private cancelClicked() {
            this.cursor.cancelHandlerStack.pop()
            this.hide()
        }

        show(
            opts: {
                title?: string
                onClick?: (btn: string, button: Button) => void
                onHide?: () => void
                onDelete?: () => void
                navigator?: () => INavigator
            },
            hideOnClick: boolean = true
        ) {
            this.onClick = opts.onClick
            this.onHide = opts.onHide
            this.onDelete = opts.onDelete
            if (opts.navigator) {
                this.navigator.clear()
                this.navigator = opts.navigator()
            } else {
                this.navigator.clear()
                this.navigator = new RowNavigator()
            }
            this.hideOnClick = hideOnClick
            this.title = opts.title
            this.prevNavigator = this.cursor.navigator
            this.prevpos = this.cursor.xfrm.localPos.clone()
            this.prevAriaId = this.cursor.ariaId
            this.cursor.navigator = this.navigator
            this.cursor.cancelHandlerStack.push(() => this.cancelClicked())
            if (this.onDelete) {
                this.deleteBtn = new Button({
                    parent: this,
                    style: ButtonStyles.FlatWhite,
                    icon: "delete",
                    label: "delete",
                    x: 0,
                    y: 0,
                    onClick: () => {
                        this.hide()
                        this.onDelete()
                    },
                })
            }
            this.groups.forEach(group => {
                const btns = group.opts.btns || []
                btns.forEach(btn => {
                    const button = new PickerButton(this, btn)
                    group.buttons.push(button)
                })
            })
            this.layout()
            this.visible = true
        }

        hide() {
            this.visible = false
            this.navigator.clear()
            this.cursor.navigator = this.prevNavigator
            this.cursor.snapTo(this.prevpos.x, this.prevpos.y, this.prevAriaId)
            this.groups.forEach(group => group.destroy())
            if (this.deleteBtn) {
                this.deleteBtn.destroy()
                this.deleteBtn = undefined
            }
            this.groups = []
            if (this.onHide) {
                this.onHide()
            }
        }

        draw() {
            if (this.visible) {
                const left = this.panel.left
                const right = this.panel.right - 1
                const top = this.panel.top
                const bottom = this.panel.bottom - 1
                this.panel.fillRect(15)
                Screen.drawLine(left + 1, top - 1, right - 1, top - 1, 15)
                Screen.drawLine(left + 1, bottom + 1, right - 1, bottom + 1, 15)
                Screen.drawLine(left - 1, top + 1, left - 1, bottom - 1, 15)
                Screen.drawLine(right + 1, top + 1, right + 1, bottom - 1, 15)
                if (this.title) {
                    Screen.print(this.title, left + 2, top + 4, 1, image.font8)
                }
                this.groups.forEach(group => {
                    group.buttons.forEach(btn => {
                        btn.draw()
                    })
                })
                if (this.deleteBtn) this.deleteBtn.draw()
            }
        }

        private layout() {
            let maxBtnCount = 0
            this.groups.forEach(
                group =>
                    (maxBtnCount = Math.max(
                        maxBtnCount,
                        group.opts.btns.length
                    ))
            )
            maxBtnCount = Math.min(maxBtnCount, MAX_PER_ROW)

            let computedHeight = this.deleteBtn || this.title ? HEADER : 0
            let computedWidth = maxBtnCount * 16

            this.groups.forEach(group => {
                if (group.opts.label) {
                    computedHeight += LABEL
                } else {
                    // WHAT IS THIS FOR?
                    // why is height dependent on number of buttons in group?
                    computedHeight +=
                        TRAY * Math.ceil(group.buttons.length / MAX_PER_ROW)
                }
            })

            let computedLeft = -(computedWidth >> 1)
            let computedTop = -(computedHeight >> 1)
            //computedLeft = Math.max(this.offset.x, computedLeft);
            //computedTop = Math.max(this.offset.y, computedTop);

            this.panel = new Bounds({
                top: computedTop,
                left: computedLeft,
                width: computedWidth,
                height: computedHeight,
            })
            this.panel = Bounds.Grow(this.panel, 2)

            let currentTop =
                computedTop + (this.deleteBtn || this.title ? HEADER : 0)

            if (this.deleteBtn) {
                this.deleteBtn.xfrm.localPos.x =
                    computedLeft + computedWidth - 8
                this.deleteBtn.xfrm.localPos.y = computedTop + 8
                this.navigator.addButtons([this.deleteBtn])
            }

            this.groups.forEach(group => {
                let currentLeft = computedLeft
                group.buttons.forEach((btn, index) => {
                    if (index && index % MAX_PER_ROW === 0) {
                        currentTop += TRAY
                        currentLeft = computedLeft
                    }
                    btn.xfrm.localPos.y = currentTop + 8
                    btn.xfrm.localPos.x = currentLeft + 8
                    currentLeft += 16
                })
                this.navigator.addButtons(group.buttons)
                if (group.opts.label) {
                    currentTop += LABEL
                }
            })

            const btn = this.navigator.initialCursor(this.cursor)
            this.cursor.moveTo(btn.xfrm.worldPos, btn.ariaId)
        }
    }

    const HEADER = 16
    const LABEL = 14
    const TRAY = 16
    const MAX_PER_ROW = 5
}
