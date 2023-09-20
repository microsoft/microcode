microcode.robot = new microcode.KeyStudioMiniSmartRobot()

// configure group using button A/B, cycle through groups 1-99
input.onButtonPressed(Button.A, () => {
    microcode.previousGroup()
})
input.onButtonPressed(Button.B, () => {
    microcode.nextGroup()
})

// show status
basic.forever(() => {
    microcode.showRadioStatus()
    basic.pause(1000)
})

// init
microcode.robot.motorRun(0)
microcode.robot.ledSetColor(0, 0, 0)