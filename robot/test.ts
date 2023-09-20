basic.forever(() => {
    [0, 80, -80, 50, -50].forEach(speed => {
        game.addScore(1)
        microcode.robotDriver.motorRun(speed)
        basic.pause(1000)
        microcode.robotDriver.motorRun(0)
        basic.pause(100)
        microcode.robotDriver.motorTurn(speed)
        basic.pause(1000)
    })
})