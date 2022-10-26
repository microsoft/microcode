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
            const note_icon =
                melody.notes[col] === "."
                    ? "note_off"
                    : parseInt(melody.notes[col]) === NUM_NOTES - 1 - row
                    ? "note_on"
                    : "note_off"
            return note_icon
        }

        for (let row = 0; row < 5; row++) {
            let btns: PickerButtonDef[] = []
            for (let col = 0; col < 5; col++) {
                btns.push({
                    icon: getIcon(col, row),
                    style: ButtonStyles.Transparent,
                })
            }
            picker.addGroup({ btns })
        }

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_MELODY_EDITOR),
                onClick: (iconId: any, button: PickerButton) => {
                    let row = 0,
                        col = 0
                    // note that this row is graphics, not music
                    for (; row < NUM_NOTES; row++) {
                        let index =
                            button.picker.groups[row].buttons.indexOf(button)
                        if (index >= 0) {
                            col = index
                            break
                        }
                    }
                    if (getIcon(col, row) !== "note_on") {
                        const note = (NUM_NOTES - 1 - row).toString()
                        const buf = Buffer.create(6)
                        setNote(buf, 0, note)
                        new jacs.TopWriter().deployFreq(buf)
                    }
                    melody.notes =
                        melody.notes.slice(0, col) +
                        (getIcon(col, row) === "note_on"
                            ? "."
                            : (NUM_NOTES - 1 - row).toString()) +
                        melody.notes.slice(col + 1)
                    for (row = 0; row < NUM_NOTES; row++) {
                        button.picker.groups[row].buttons[col].setIcon(
                            getIcon(col, row)
                        )
                    }
                    picker.draw()
                },
                onHide,
                onDelete,
                navigator: () => new MelodyNavigator(),
            },
            false
        )
    }
}
