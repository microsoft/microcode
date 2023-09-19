// debug
input.onButtonPressed(Button.AB, () => {
    while (true) {
        const a = input.acceleration(Dimension.X)
        const b = input.acceleration(Dimension.Y)
        const payload = Buffer.create(2)
        payload.setNumber(NumberFormat.Int16LE, 0, a / 4)
        payload.setNumber(NumberFormat.Int16LE, 1, b / 4)
        microcode.sendCommand(microcode.RobotCommand.MotorRun, payload)
        pause(100)
    }
})
