// configure group using button A, cycle through groups 1-9
input.onButtonPressed(Button.A, () => {
    microcode.nextGroup()
})

// show status
basic.forever(() => {
    microcode.showRadioStatus()
    basic.pause(1000)
})
