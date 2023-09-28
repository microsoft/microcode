microcode.elecfreaksCuteBot.start()
//microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
microcode.setMotorDrift(0)

microcode.robotDriver.motorRun(100)

/*
basic.forever(() => {
    const dist = microcode.robotDriver.ultrasonicDistance()
    if (dist > 10) microcode.robotDriver.motorRun(100)
    else {
        microcode.robotDriver.motorStop()
        microcode.robotDriver.motorRun(-100)
        pause(400)
        microcode.robotDriver.motorStop()
        microcode.robotDriver.motorTurn(100)
        pause(400)
        microcode.robotDriver.motorStop()
    }
})
*/