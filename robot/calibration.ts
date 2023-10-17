namespace microcode.robots {
    /**
     * This function lets you find the `speed0` parameter:
     * the minimum speed input to get the robot moving. Press A/B to change the speed0 parameter.
     */
    export function calibrateSpeed0() {
        const r = microcode.robot
        r.robot.stopThreshold = 0
        r.hud = false

        const run = () => {
            led.stopAnimation()
            r.playTone(440, 50)
            basic.showNumber(r.robot.speed0, 60)
            r.motorRun(1, 1)
        }

        input.onButtonPressed(Button.A, () => {
            r.robot.speed0--
            r.playTone(440, 50)
            run()
        })
        input.onButtonPressed(Button.B, () => {
            r.robot.speed0++
            run()
        })
        run()
    }
}
