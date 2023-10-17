microcode.elecfreaksCuteBot.start()
//microcode.yahboomTinyBit.start()
//microcode.elecfreaksCuteBotPro.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)
//microcode.dfRobotMaqueen.start()
//microcode.dfRobotMaqueenPlusV2.start()

microcode.setRadioGroup(2)
microcode.setMotorDrift(0)

const r = microcode.robot
//r.motorRun(-100, 80)

basic.forever(() => {
    const lines = r.currentLineState
    if (lines === RobotLineState.Left) {
        r.motorRun(-80, 100)
    } else if (lines === RobotLineState.Right) {
        r.motorRun(80, 100)
    } else if (lines === RobotLineState.Both) {
        r.motorRun(0, 70)
    } else if (lines === RobotLineState.LostLeft) {
        r.motorRun(200, 70)
    } else if (lines === RobotLineState.LostRight) {
        r.motorRun(-200, 70)
    }
})

/*
// calibrate
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
*/

/*
// test motors
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
