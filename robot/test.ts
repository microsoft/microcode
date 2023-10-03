//microcode.elecfreaksCuteBot.start()
microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)

//microcode.robotDriver.motorTurn(-100)

basic.forever(() => {
    const dist = microcode.robotDriver.currentUltrasonicDistance
    if (dist > 10) {
        microcode.robotDriver.motorRun(100)
        pause(200)
    }
    else {
        microcode.robotDriver.motorRun(-100)
        basic.pause(1000)
        microcode.robotDriver.motorTurn(100)
        basic.pause(1000)
    }
})
