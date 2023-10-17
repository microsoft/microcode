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
            run()
        })
        input.onButtonPressed(Button.B, () => {
            r.robot.speed0++
            run()
        })
        basic.showString("speed0 ", 60)
        run()
    }

    export function calibrateLineFollowing() {
        const r = microcode.robot
        r.robot.stopThreshold = 0
        r.hud = false

        const run = () => {
            led.stopAnimation()
            r.playTone(440, 50)
            basic.showNumber(r.robot.maxLineSpeed, 60)
        }

        input.onButtonPressed(Button.A, () => {
            r.robot.maxLineSpeed--
            run()
        })
        input.onButtonPressed(Button.B, () => {
            r.robot.maxLineSpeed++
            run()
        })

        basic.forever(() => {
            const lines = r.currentLineState
            if (lines === RobotLineState.Both) {
                robot.decodeRobotCompactCommand(
                    RobotCompactCommand.MotorRunForward
                )
            } else if (lines === RobotLineState.Right) {
                robot.decodeRobotCompactCommand(
                    RobotCompactCommand.MotorTurnRight
                )
            } else if (lines === RobotLineState.Left) {
                robot.decodeRobotCompactCommand(
                    RobotCompactCommand.MotorTurnLeft
                )
            } else if (lines === RobotLineState.LostLeft) {
                robot.decodeRobotCompactCommand(
                    RobotCompactCommand.MotorSpinLeft
                )
            } else if (lines === RobotLineState.LostRight) {
                robot.decodeRobotCompactCommand(
                    RobotCompactCommand.MotorSpinRight
                )
            } else {
                robot.decodeRobotCompactCommand(RobotCompactCommand.MotorStop)
            }
            basic.pause(100)
        })
    }
}
