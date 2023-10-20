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

        let btns: PickerButtonDef[] = []
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                btns.push({
                    icon: getColor(col, row),
                    style: ButtonStyles.Transparent,
                })
            }
        }
        picker.setGroup({ btns })

        const red = icons.get("solid_red")
        const black = icons.get("solid_black")

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_ICON_EDITOR),
                onClick: (iconId: any, button: PickerButton) => {
                    let on = button.getIcon() === "solid_red"
                    let index = button.picker.group.buttons.indexOf(button)
                    let row = Math.floor(index / 5)
                    let col = index % 5
                    image5x5.setPixel(col, row, on ? 0 : 1)
                    button.setIcon(getColor(col, row), on ? black : red)
                    button.draw()
                    picker.navigator.updateAria()
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

        let btns: PickerButtonDef[] = []
        for (let row = 0; row < NUM_NOTES; row++) {
            for (let col = 0; col < MELODY_LENGTH; col++) {
                btns.push({
                    icon: getIcon(col, row),
                    style: ButtonStyles.Transparent,
                })
            }
        }
        picker.setGroup({ btns })

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_MELODY_EDITOR),
                onClick: (iconId: any, button: PickerButton) => {
                    let index = button.picker.group.buttons.indexOf(button)
                    let row = Math.floor(index / MELODY_LENGTH)
                    let col = index % MELODY_LENGTH
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
                        button.picker.group.buttons[row*MELODY_LENGTH +col].setIcon(
                            getIcon(col, row)
                        )
                    }
                    picker.draw()
                    picker.navigator.updateAria()
                },
                onHide,
                onDelete,
                navigator: () => new MelodyNavigator(),
            },
            false
        )
    }
}
