microcode.elecfreaksCuteBot.start()
microcode.setMotorDrift(6)

const robotDriver = microcode.robotDriver
basic.forever(() => {
    const dist = robotDriver.ultrasonicDistance()
    if (dist > 10)
        robotDriver.motorRun(100)
    else {
        robotDriver.motorRun(-50)
        pause(400)
        robotDriver.motorTurn(50)
        pause(400)
    }
})