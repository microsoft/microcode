//microcode.elecfreaksCuteBot.start()
//microcode.elecfreaksCuteBotPro.start()
microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)

const r = microcode.robot

/*
let tr = 0
input.onButtonPressed(Button.A, () => {
    tr -= 10
    microcode.robotDriver.motorTurn(tr, 50)    
})
input.onButtonPressed(Button.B, () => {
    tr += 10
    microcode.robotDriver.motorTurn(tr, 50)
})
*/

basic.forever(() => {
    const lines = r.lineState()
    if (lines === RobotLineState.Left) {
        r.motorTurn(-100, 100)
    }
    else if (lines === RobotLineState.Right) {
        r.motorTurn(100, 100)
    } else
        r.motorRun(80)
})