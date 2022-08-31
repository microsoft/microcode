namespace microcode {

    // icon gallery
/*
    export class IconGallery extends Picker {
        private scaledImages: Image[];
        private selected: number;
        private editor: Picker;
        constructor(cursor: Cursor) {
            super(cursor)
            // TODO; make more memory efficient (reuse image if present)
            this.scaledImages = ledIcons.map(scaleUp)
            this.scaledImages.forEach((v,i)=> {
                icons.reg["led55_"+i.toString()] = v
            })
            let btns: PickerButtonDef[] = this.scaledImages.map((v,i) => { return { icon: "led55_"+i.toString() } })
        }
    }
*/

    // icon editor

    export class IconEditor extends Picker {
        constructor(private image5x5: Image, cursor: Cursor) {
            super(cursor)
            // make 5 x 5 matrix of buttons
            for(let row = 0; row < 5; row++) {
                let btns: PickerButtonDef[] = []
                for (let col = 0; col < 5; col++) {
                    btns.push({ icon: this.getColor(col,row) })
                }
                this.addGroup({label: row.toString(), btns})
            }
        }

        getColor(col: number, row: number) {
            return this.image5x5.getPixel(col, row) ? tid.modifier.color_red : tid.modifier.color_darkpurple
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
            this.image5x5.setPixel(col, row, on ? 0 : 1)
            button.setIcon(this.getColor(col,row))
            this.draw()
        }
    }
}
