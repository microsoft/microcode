basic.forever(() => {
    [0, 100, -100, 50, -50].forEach(speed => {
        game.addScore(1)
        microcode.robotDriver.robot.motorRun(speed)
        basic.pause(1000)
        microcode.robotDriver.robot.motorRun(0)
        basic.pause(100)
        microcode.robotDriver.robot.motorTurn(speed)
        basic.pause(1000)
    })
})