//microcode.elecfreaksCuteBot.start()
microcode.elecfreaksCuteBotPro.start()
//microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)

microcode.robotDriver.motorRun(100)

basic.forever(() => {
    const lines = microcode.robotDriver.currentLineState
    if (lines === microcode.robots.RobotLineState.Left)
        microcode.robotDriver.motorTurn(-100)
    else if (lines === microcode.robots.RobotLineState.Right)
        microcode.robotDriver.motorTurn(100)
    else
        microcode.robotDriver.motorRun(100)
})
