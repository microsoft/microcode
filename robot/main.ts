//const robot = new microcode.YahboomTinybitRobot()
//const robot = new microcode.KeyStudioMiniSmartRobot()
const robot = new microcode.ElecfreaksCutebotRobot()
const robotDriver = new microcode.RobotDriver(robot)


// init
robotDriver.start()

basic.forever(() => {
    [0, 80, -80].forEach(speed => {
        robotDriver.motorRun(speed)
        basic.pause(1000)
        robotDriver.motorRun(0)
        basic.pause(500)
        robotDriver.motorTurn(speed)
        basic.pause(1000)
    })
})