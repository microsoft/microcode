microcode.elecfreaksCuteBot.start()
//microcode.yahboomTinyBit.start()
//microcode.elecfreaksCuteBotPro.start()
//microcode.keyStudioMiniSmartRobot.start()
//microcode.setMotorDrift(6)
//microcode.dfRobotMaqueen.start()
//microcode.dfRobotMaqueenPlusV2.start()

microcode.robot.startRadio()
microcode.robot.setColor(0xff000)

input.onButtonPressed(Button.A, function () {
    microcode.robot.setColor(0x0000ff)
})
input.onButtonPressed(Button.B, function () {
    microcode.robot.setColor(0xff0000)
})
