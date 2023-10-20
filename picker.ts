namespace microcode {
    // TODO: functionalize the Picker to reduce memory pressure
    // 1. a function to get image from col, row
    // 2. a function to set image from col, row
    // 2. the number of rows and columns (supported ragged)

    export type PickerButtonDef = {
        icon: string | Image
        style?: ButtonStyle
        ariaId?: string
        start?: boolean
    }

    export interface IPicker {
        size: number
        getPickerButtonDef(index: number): PickerButtonDef
    }

    // TODO: get rid of PickerButton
    export class PickerButton extends Button {
        constructor(public picker: Picker, btn: PickerButtonDef) {
            super({
                parent: picker,
                style: btn.style || ButtonStyles.LightShadowedWhite,
                icon: btn.icon,
                ariaId: btn.ariaId,
                x: 0,
                y: 0,
                onClick: () =>
                    this.picker.onButtonClicked(this, <string>btn.icon),
            })
        }
    }

    class PickerGroup {
        public xfrm: Affine
        public buttons: Button[]
        public bounds: Bounds

        constructor(
            picker: Picker,
            public opts?: {
                btns?: PickerButtonDef[]
            }
        ) {
            this.opts = this.opts || {}
            this.buttons = []
            this.bounds = new Bounds()
            this.xfrm = new Affine()
            this.xfrm.parent = picker.xfrm
        }

        public layout(maxPerRow: number) {
            const cell = new Bounds()
            this.buttons.forEach(btn => cell.add(btn.bounds))
            this.buttons.forEach((btn, idx) => {
                btn.xfrm.parent = this.xfrm
                const row = Math.idiv(idx, maxPerRow)
                btn.xfrm.localPos.x =
                    (cell.width >> 1) +
                    (idx % maxPerRow) * cell.width +
                    (idx % maxPerRow)
                btn.xfrm.localPos.y = row * cell.height
            })
            this.bounds = new Bounds()
            this.buttons.forEach(btn =>
                this.bounds.add(Bounds.Translate(btn.bounds, btn.xfrm.localPos))
            )
        }

        public draw() {
            this.buttons.forEach(btn => btn.draw())
        }
    }

    export class Picker implements IPlaceable {
        public group: PickerGroup
        public navigator: MatrixNavigator
        public visible: boolean

        private xfrm_: Affine
        private prevState: CursorState
        private deleteBtn: Button
        private startBtn: Button
        private panel: Bounds
        private onClick: (btn: string, button?: Button) => void
        private onHide: () => void
        private onDelete: () => void
        private hideOnClick: boolean
        private title: string

        public get xfrm() {
            return this.xfrm_
        }

        constructor(private cursor: Cursor) {
            this.xfrm_ = new Affine()
            this.group = undefined
            this.navigator = new MatrixNavigator()
        }

        public setGroup(opts: { btns: PickerButtonDef[] }) {
            this.group = new PickerGroup(this, opts)
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
            // restart jacs?
        }

        show(
            opts: {
                title?: string
                onClick?: (btn: string, button: Button) => void
                onHide?: () => void
                onDelete?: () => void
                navigator?: () => MatrixNavigator
            },
            hideOnClick: boolean = true
        ) {
            // no need to run while working in the picker
            jacs.stop()

            this.startBtn = undefined
            this.onClick = opts.onClick
            this.onHide = opts.onHide
            this.onDelete = opts.onDelete
            if (opts.navigator) {
                this.navigator.clear()
                this.navigator = opts.navigator()
            } else {
                this.navigator.clear()
                this.navigator = new MatrixNavigator()
            }
            this.hideOnClick = hideOnClick
            this.title = opts.title
            this.prevState = this.cursor.saveState()
            this.cursor.navigator = this.navigator
            this.cursor.cancelHandlerStack.push(() => this.cancelClicked())
            if (this.onDelete) {
                this.deleteBtn = new Button({
                    parent: this,
                    style: ButtonStyles.RedBorderedWhite,
                    icon: "delete",
                    x: 0,
                    y: 0,
                    onClick: () => {
                        this.hide()
                        this.onDelete()
                    },
                })
            }
            if (this.group) {
                const btns = this.group.opts.btns || []
                btns.forEach(btn => {
                    const button = new PickerButton(this, btn)
                    this.group.buttons.push(button)
                    if (btn.start) this.startBtn = button
                })
            }
            this.layout(PICKER_MAX_PER_ROW)
            this.visible = true
        }

        hide() {
            this.visible = false
            this.navigator.clear()
            this.cursor.restoreState(this.prevState)
            this.deleteBtn = undefined
            this.group = undefined
            if (this.onHide) {
                this.onHide()
            }
        }

        draw() {
            control.enablePerfCounter()
            if (!this.visible) return
            Screen.fillBoundsXfrm(this.xfrm, this.panel, 12)
            Screen.outlineBoundsXfrm(this.xfrm, this.panel, 1, 15)
            if (this.title) {
                const w = this.xfrm.worldPos
                Screen.print(
                    this.title,
                    w.x + this.panel.left + 2,
                    w.y + this.panel.top + 4,
                    1,
                    microcode.font
                )
            }
            if (this.group) this.group.draw()
            if (this.deleteBtn) this.deleteBtn.draw()
        }

        private layout(maxPerRow: number) {
            this.panel = new Bounds()
            const padding = 2
            let top = padding
            if (this.deleteBtn || this.title) {
                top += this.deleteBtn ? this.deleteBtn.height : HEADER
            }
            if (this.deleteBtn) {
                this.navigator.addDelete(this.deleteBtn)
            }
            if (this.group) {
                const group = this.group
                group.layout(maxPerRow)
                top += group.buttons[0].height >> 1
                group.xfrm.localPos.y = top
                this.panel.add(Bounds.Translate(group.bounds, new Vec2(0, top)))
                top += group.bounds.height
                this.navigator.addButtons(group.buttons)
            }

            if (this.deleteBtn) {
                this.deleteBtn.xfrm.localPos.x =
                    this.panel.right - (this.deleteBtn.width >> 1) + 1
                this.deleteBtn.xfrm.localPos.y =
                    this.panel.top + (this.deleteBtn.height >> 1)
            }
            this.navigator.finished()

            this.panel.grow(padding)
            this.xfrm.localPos.x = padding - (this.panel.width >> 1)
            this.xfrm.localPos.y = padding - (this.panel.height >> 1)

            if (!this.startBtn) {
                const btn = this.navigator.initialCursor(
                    this.deleteBtn ? 1 : 0,
                    0
                )
                this.cursor.moveTo(btn.xfrm.worldPos, btn.ariaId, btn.bounds)
                btn.reportAria()
            } else {
                const btn = this.startBtn
                this.cursor.moveTo(btn.xfrm.worldPos, btn.ariaId, btn.bounds)
                this.navigator.screenToButton(
                    btn.xfrm.worldPos.x,
                    btn.xfrm.worldPos.y
                )
                btn.reportAria()
            }
        }
    }

    const HEADER = 16
    export const PICKER_MAX_PER_ROW = 5
}
