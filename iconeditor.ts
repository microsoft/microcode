namespace microcode {

    export function iconEditor(image5x5: Image, picker: Picker, onHide:() => void) {
        const getColor = (col: number, row: number) => {
            return image5x5.getPixel(col, row) ? tid.modifier.color_red : tid.modifier.color_darkpurple
        }

        for (let row = 0; row < 5; row++) {
            let btns: PickerButtonDef[] = []
            for (let col = 0; col < 5; col++) {
                btns.push({ icon: getColor(col, row) })
            }
            picker.addGroup({ label: row.toString(), btns })
        }

        picker.show({
            onClick: (iconId: any, button: PickerButton) => {
                let on = button.getIcon() === tid.modifier.color_red
                let row = 0, col = 0
                for (; row < 5; row++) {
                    let index = button.picker.groups[row].buttons.indexOf(button);
                    if (index >= 0) {
                        col = index;
                        break;
                    }
                }
                image5x5.setPixel(col, row, on ? 0 : 1)
                button.setIcon(getColor(col, row))
            },
            onHide,
            title: "Icon",
        }, false);
    }
}