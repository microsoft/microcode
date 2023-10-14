microcode.elecfreaksCuteBot.start()
//microcode.elecfreaksCuteBotPro.start()
//microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)

const r = microcode.robot
r.lineAssist = false

basic.forever(() => {
    r.motorRun(0, 50)
    pause(2000)
    r.motorStop()
    pause(1000)
    r.motorRun(200, 50)
    pause(400)
    r.motorStop()
    pause(1000)
})

/*
basic.forever(() => {
    r.motorRun(0, 80)
    pause(400)
    r.motorRun(0, -80)
    pause(400)
    r.motorRun(0, 50)
    pause(800)
    r.motorRun(0, -50)
    pause(800)
    r.motorRun(80, 80)
    pause(400)
    r.motorRun(-80, 80)
    pause(400)
    r.motorRun(200, 50)
    pause(1000)
    r.motorRun(-200, 50)
    pause(1000)
})
*/
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
/*
basic.forever(() => {
    const lines = r.lineState()
    if (lines === RobotLineState.Left) {
        r.motorTurn(-100, 100)
    }
    else if (lines === RobotLineState.Right) {
        r.motorTurn(100, 100)
    } else
        r.motorRun(80)
})*/