namespace kojac {

    export class IconEditor extends Picker {
        constructor(cursor: Cursor) {
            super(cursor)
            // make 5 x 5 matrix of buttons
            for(let row = 0; row < 5; row++) {
                let btns: PickerButtonDef[] = []
                for (let col = 0; col < 5; col++) {
                    btns.push({ icon: tid.modifier.color_darkpurple })
                }
                this.addGroup({label: row.toString(), btns})
            }
        }

        public onButtonClicked(button: PickerButton, icon: string) {
            button.setIcon(icon === tid.modifier.color_red ? tid.modifier.color_darkpurple : tid.modifier.color_red)
            this.draw()
        }
    }
}