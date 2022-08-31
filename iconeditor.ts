namespace microcode {


    const ledIcon1 = img`
        . . . . .
        . 1 . 1 .
        . . . . .
        1 . . . 1
        . 1 1 1 .
    `
    const ledIcon2 = img`
        1 . . . 1
        . 1 . 1 .
        . . 1 . .
        . 1 . 1 .
        1 . . . 1
    `
    const ledIcon3 = img`
        . . . . .
        . 1 . 1 .
        . . 1 . .
        . 1 . 1 .
        . . . . .
    `
    const ledIcon4 = img`
        . . . . .
        . 1 . 1 .
        . . . . .
        . 1 1 1 .
        1 . . . 1
    `
    const ledIcons = [ledIcon1, ledIcon2, ledIcon3, ledIcon4]

    // icon gallery

    // - upscale 5x5 image to 16 x 16
    function scaleUp(led55: ImageG) {
        const ret = image.create(16, 16)
        ret.fill(15)
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const color = led55.getPixel(col, row) ? 2 : 12;
                const nrow = 1 + row * 3, ncol = 1 + col * 3
                ret.setPixel(ncol, nrow, color)
                ret.setPixel(ncol + 1, nrow, color)
                ret.setPixel(ncol, nrow + 1, color)
                ret.setPixel(ncol + 1, nrow + 1, color)
            }
        }
        return ret
    }

    // two modes for icon gallery
    // 1. entrance to editor
    // 2. picker
    export class IconGallery extends Picker {
        private scaledImages: Image[];
        constructor(cursor: Cursor) {
            super(cursor)
            // TODO; make more memory efficient (reuse image if present)
            this.scaledImages = ledIcons.map(scaleUp)
            this.scaledImages.forEach((v,i)=> {
                icons.reg["led55_"+i.toString()] = v
            })
            let btns: PickerButtonDef[] = this.scaledImages.map((v,i) => { return { icon: "led55_"+i.toString() } })
            this.addGroup({label: "gallery", btns})
        }

        public onButtonClicked(button: PickerButton, icon: string) {
            // go to Icon Editor
        }
    }

    // icon editor

    function getPixel(col: number, row: number) {
        return ledIcon1.getPixel(col, row) ? tid.modifier.color_red : tid.modifier.color_darkpurple
    }

    export class IconEditor extends Picker {
        constructor(cursor: Cursor) {
            super(cursor)
            // make 5 x 5 matrix of buttons
            for(let row = 0; row < 5; row++) {
                let btns: PickerButtonDef[] = []
                for (let col = 0; col < 5; col++) {
                    btns.push({ icon: getPixel(col,row) })
                }
                this.addGroup({label: row.toString(), btns})
            }
        }

        public onButtonClicked(button: PickerButton, icon: string) {
            let on = button.getIcon() === tid.modifier.color_red
            let row = 0, col = 0
            for (; row < 5; row++) {
                let index = this.groups[row].buttons.indexOf(button);
                if (index >= 0) {
                    col = index;
                    break;
                }
            }
            ledIcon1.setPixel(col, row, on ? 0 : 1)
            button.setIcon(getPixel(col,row))
            this.draw()
        }
    }
}
