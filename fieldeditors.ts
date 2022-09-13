namespace microcode {
    export function iconEditor(
        image5x5: Image,
        picker: Picker,
        onHide: () => void,
        onDelete?: () => void
    ) {
        const getColor = (col: number, row: number) => {
            return image5x5.getPixel(col, row)
                ? TID_MODIFIER_COLOR_RED
                : TID_MODIFIER_COLOR_DARKPURPLE
        }

        for (let row = 0; row < 5; row++) {
            let btns: PickerButtonDef[] = []
            for (let col = 0; col < 5; col++) {
                btns.push({ icon: getColor(col, row) })
            }
            picker.addGroup({ label: row.toString(), btns })
        }

        picker.show(
            {
                onClick: (iconId: any, button: PickerButton) => {
                    let on = button.getIcon() === TID_MODIFIER_COLOR_RED
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
                title: "LEDs",
            },
            false
        )
    }

    function noteToImageRaw(img: Image, note: number): Image {
        img.drawImage(icondb.staffEGB, 0, 0)
        if (note < 5) {
            img.drawImage(icondb.noteStemUp, 8, 8 - note * 3)
        } else {
        }
        return img
    }

    export function noteToImage(field: NoteField): Image {
        return noteToImageRaw(image.create(16, 16), field.note)
    }

    export function musicEditor(
        field: NoteField,
        picker: Picker,
        onHide: () => void,
        onDelete?: () => void
    ) {
        // TODO: centering???
        let btns: PickerButtonDef[] = []
        btns.push({ icon: "prev_page" })
        btns.push({ icon: noteToImageRaw(image.create(16, 16), field.note) })
        btns.push({ icon: "next_page" })
        picker.addGroup({ label: "", btns })

        picker.show(
            {
                onClick: (iconId: any, button: PickerButton) => {
                    let icon = button.getIcon()
                    let noteBtn = picker.groups[0].buttons[1]
                    if (icon === "prev_page") {
                        if (field.note > 0) field.note--
                    } else if (icon === "next_page") {
                        if (field.note < 7) field.note++
                    }
                    noteToImageRaw(noteBtn.getImage(), field.note)
                    picker.draw()
                },
                onHide,
                onDelete,
                title: "Note",
            },
            false
        )
    }
}
