namespace microcode {
    export function iconEditor(
        image5x5: Image,
        picker: Picker,
        onHide: () => void,
        onDelete?: () => void
    ) {
        const getColor = (col: number, row: number) => {
            return image5x5.getPixel(col, row) ? "solid_red" : "solid_black"
        }

        for (let row = 0; row < 5; row++) {
            let btns: PickerButtonDef[] = []
            for (let col = 0; col < 5; col++) {
                btns.push({
                    icon: getColor(col, row),
                    style: ButtonStyles.Transparent,
                })
            }
            picker.addGroup({ btns })
        }

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_ICON_EDITOR),
                onClick: (iconId: any, button: PickerButton) => {
                    let on = button.getIcon() === "solid_red"
                    let row = 0,
                        col = 0
                    for (; row < 5; row++) {
                        let index =
                            button.picker.groups[row].buttons.indexOf(button)
                        if (index >= 0) {
                            col = index
                            break
                        }
                    }
                    image5x5.setPixel(col, row, on ? 0 : 1)
                    button.setIcon(getColor(col, row))
                    picker.draw()
                },
                onHide,
                onDelete,
                navigator: () => new LEDNavigator(),
            },
            false
        )
    }


    export function melodyEditor(
        melody: Melody,
        picker: Picker,
        onHide: () => void,
        onDelete?: () => void
    ) {
        const getIcon = (col: number, row: number) => {
            const note_icon = melody.notes[col] === "." ? "note_off" :
                parseInt(melody.notes[col]) === row ? "note_on" : "note_off"
            return note_icon
        }

        for (let row = 0; row < 8; row++) {
            let btns: PickerButtonDef[] = []
            for (let col = 0; col < 8; col++) {
                btns.push({
                    icon: getIcon(col, row),
                    style: ButtonStyles.Transparent,
                })
            }
            picker.addGroup({ btns })
        }

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_ICON_EDITOR),
                onClick: (iconId: any, button: PickerButton) => {
                    let on = button.getIcon() === "note_on"
                    let row = 0,
                        col = 0
                    for (; row < 8; row++) {
                        let index =
                            button.picker.groups[row].buttons.indexOf(button)
                        if (index >= 0) {
                            col = index
                            break
                        }
                    }
                    melody.notes = melody.notes.slice(0, col) +
                        (getIcon(col, row) === "note_on" ? "." : row.toString())
                        + melody.notes.slice(col + 1)
                    for (row = 0; row < 8; row++) {
                        button.picker.groups[row].buttons[col].setIcon(getIcon(col, row))
                    }
                    picker.draw()
                },
                onHide,
                onDelete,
                navigator: () => new LEDNavigator(),
            },
            false
        )
    }
}
