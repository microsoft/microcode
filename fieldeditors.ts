namespace microcode {
    export function iconEditor(
        image5x5: Image,
        picker: Picker,
        onHide: () => void,
        onDelete?: () => void
    ) {
        const getColor = (col: number, row: number) => {
            return image5x5.getPixel(col, row)
                ? "solid_red"
                : "solid_black"
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

    function noteToImageRaw(img: Image, note: number): Image {
        img.fill(0)
        img.drawImage(icondb.staffEGB, 0, 0)
        if (note < 5) {
            if (note === 0) img.drawLine(4, 14, 12, 14, 15)
            img.drawTransparentImage(
                icondb.noteStemUp,
                6,
                8 - (note == 4 ? note + 1 : note)
            )
        } else {
            // TODO: special case for top note
            img.drawTransparentImage(icondb.noteStemDown, 6, 11 - note)
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
        let btns: PickerButtonDef[] = []
        btns.push({
            icon: "prev_page",
            style: ButtonStyles.BorderedPurple,
        })
        btns.push({
            icon: noteToImageRaw(image.create(16, 16), field.note),
            style: ButtonStyles.FlatWhite,
        })
        btns.push({
            icon: "next_page",
            style: ButtonStyles.BorderedPurple,
        })
        picker.addGroup({ btns })

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
            },
            false
        )
    }

    export function upperToImage(field: RandomUpper): Image {
        const die = icondb.diceToss.clone()
        die.drawTransparentImage(icondb.oneToFive[field.upper - 1], 0, 0)
        return die
    }

    export function randomEditor(
        field: RandomUpper,
        picker: Picker,
        onHide: () => void,
        onDelete: () => void
    ) {
        let btns: PickerButtonDef[] = []
        for (let upper = 2; upper < 6; upper++) {
            btns.push({
                icon: upperToImage({ upper }),
                style: ButtonStyles.FlatWhite,
            })
        }
        picker.addGroup({ btns })

        picker.show({
            onClick: (iconId: any, button: PickerButton) => {
                const index = picker.groups[0].buttons.indexOf(button)
                field.upper = 2 + index
            },
            onHide,
            onDelete,
        })
    }
}
