const robot = new microcode.YahboomTinybitRobot()
//const robot = new microcode.KeyStudioMiniSmartRobot()
microcode.robotDriver = new microcode.RobotDriver(robot)

// configure group using button A/B, cycle through groups 1-99
input.onButtonPressed(Button.A, () => {
    microcode.previousGroup()
})
input.onButtonPressed(Button.B, () => {
    microcode.nextGroup()
})

// show status
basic.forever(() => {
    microcode.robotDriver.checkAlive()
    microcode.showRadioStatus()
    basic.pause(1000)
})

// init
microcode.robotDriver.stop()
