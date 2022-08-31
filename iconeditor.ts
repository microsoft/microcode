namespace microcode {

    // TODO
    // - set of buffers with preset icons
    // - updated
    
    const ledIcon1 = img`
        1 . . . .
        . 1 . . .
        . . 1 . .
        . . . 1 .
        . . . . 1
    `

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