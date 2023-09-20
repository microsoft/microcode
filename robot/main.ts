const robot = new microcode.YahboomTinybitRobot()
//const robot = new microcode.KeyStudioMiniSmartRobot()
const robotDriver = new microcode.RobotDriver(robot)

// configure group using button A/B, cycle through groups 1-99
input.onButtonPressed(Button.A, () => {
    microcode.previousGroup()
})
input.onButtonPressed(Button.B, () => {
    microcode.nextGroup()
})

// show status
basic.forever(() => {
    robotDriver.checkAlive()
    microcode.showRadioStatus()
    basic.pause(1000)
})

// init
robotDriver.stop()
microcode.startRadioReceiver(robotDriver)

basic.forever(() => {
    [0, 80, -80].forEach(speed => {
        robotDriver.motorRun(speed)
        basic.pause(1000)
        robotDriver.motorRun(0)
        basic.pause(100)
        robotDriver.motorTurn(speed)
        basic.pause(1000)
    })
})

robotDriver.playMelody(Melodies.BaDing)