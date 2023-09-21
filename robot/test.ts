const robotDriver = microcode.elecfreaksCuteBot
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