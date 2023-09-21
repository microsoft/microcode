//microcode.elecfreaksCuteBot.start()
microcode.yahboomTinyBit.start()
microcode.setMotorDrift(-4)

const robotDriver = microcode.robotDriver
basic.forever(() => {
    robotDriver.motorRun(100)
    pause(1500)
    robotDriver.motorRun(-100)
    pause(1500)

/*    

    const dist = robotDriver.ultrasonicDistance()
    if (dist > 5)
        robotDriver.motorRun(100)
    else {
        robotDriver.motorRun(-50)
        pause(400)
        robotDriver.motorTurn(50)
        pause(800)
    }
    */
})