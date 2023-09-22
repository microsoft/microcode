microcode.elecfreaksCuteBot.start()
//microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
microcode.setMotorDrift(0)

const robotDriver = microcode.robotDriver
robotDriver.motorRun(60)
/*
basic.forever(() => {
    robotDriver.motorRun(100)
    pause(1500)
    robotDriver.motorRun(-100)
    pause(1500)
})
*/
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
