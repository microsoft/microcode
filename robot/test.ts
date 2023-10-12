microcode.elecfreaksCuteBot.start()
//microcode.elecfreaksCuteBotPro.start()
//microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)

// microcode...
microcode.elecfreaksCuteBot.robot.maxLineRunSpeed = 28
microcode.elecfreaksCuteBot.robot.maxLineTurnSpeed = 26

//microcode.robotDriver.motorRun(-100)
/*
microcode.robotDriver.motorRun(100)
let i = 0
basic.forever(() => {
    const lines = microcode.robotDriver.currentLineState
    console.log(`lines: ${lines}`)
    if (lines === microcode.robots.RobotLineState.Left) {
        microcode.robotDriver.motorTurn(-100)
    }
    else if (lines === microcode.robots.RobotLineState.Right) {
        microcode.robotDriver.motorTurn(100)
    }
    else if (lines === microcode.robots.RobotLineState.None)
        microcode.robotDriver.motorTurn(50)
    else
        microcode.robotDriver.motorRun(100)
})
*/