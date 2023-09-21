//const robot = new microcode.YahboomTinybitRobot()
//const robot = new microcode.KeyStudioMiniSmartRobot()
const robot = new microcode.ElecfreaksCutebotRobot()
const robotDriver = new microcode.RobotDriver(robot)


// init
robotDriver.start()
basic.forever(() => {
    const dist = robotDriver.ultrasonicDistance()
    if (dist > 10)
        robotDriver.motorRun(100)
    else {
        robotDriver.motorStop()
        robotDriver.motorRun(-50)
        pause(400)
        robotDriver.motorStop()
        robotDriver.motorTurn(50)
        pause(400)
        robotDriver.motorStop()
    }
})