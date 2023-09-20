basic.forever(() => {
    [0, 100, -100, 50, -50].forEach(speed => {
        game.addScore(1)
        microcode.robot.motorRun(speed)
        basic.pause(1000)
        microcode.robot.motorRun(0)
        basic.pause(100)
        microcode.robot.motorTurn(speed)
        basic.pause(1000)
    })
})