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

        // TODO: replace this with a function from index to colo
        let defs: PickerButtonDef[] = []
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                defs.push({
                    icon: getColor(col, row),
                })
            }
        }
        picker.setGroup(defs)

        const red = icons.get("solid_red")
        const black = icons.get("solid_black")

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_ICON_EDITOR),
                onClick: (index: number) => {
                    let row = Math.floor(index / 5)
                    let col = index % 5
                    const on = image5x5.getPixel(col, row)
                    image5x5.setPixel(col, row, on ? 0 : 1)
                    defs[index].icon = getColor(col, row)
                    picker.draw()
                },
                onHide,
                onDelete,
                navigator: () => new LEDNavigator(),
            },
            false
            // TODO style: ButtonStyles.Transparent,
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

        let defs: PickerButtonDef[] = []
        for (let row = 0; row < NUM_NOTES; row++) {
            for (let col = 0; col < MELODY_LENGTH; col++) {
                defs.push({
                    icon: getIcon(col, row),
                })
            }
        }
        picker.setGroup(defs)

        picker.show(
            {
                title: accessibility.ariaToTooltip(TID_MODIFIER_MELODY_EDITOR),
                onClick: index => {
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
                        defs[row * MELODY_LENGTH + col].icon
                            = getIcon(col, row)
                    }
                    picker.draw()
                    picker.navigator.updateAria()
                },
                onHide,
                onDelete,
                navigator: () => new MelodyNavigator(),
                //                     style: ButtonStyles.Transparent,
            },
            false
        )
    }
}
