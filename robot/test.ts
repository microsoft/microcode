microcode.elecfreaksCuteBot.start()
//microcode.elecfreaksCuteBotPro.start()
//microcode.yahboomTinyBit.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)

let tr = 0
input.onButtonPressed(Button.A, () => {
    tr -= 10
    microcode.robotDriver.motorTurn(tr, 50)    
})
input.onButtonPressed(Button.B, () => {
    tr += 10
    microcode.robotDriver.motorTurn(tr, 50)
})
