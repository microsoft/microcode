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
        basic.showString("SPEED0 ", 60)
        run()
    }

    /**
     * Implements a Arcade like line following algorithm
     */
    export function calibrateLineFollowing() {
        const r = microcode.robot
        r.robot.stopThreshold = 0
        r.hud = false

        const run = () => {
            led.stopAnimation()
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

        basic.showString("LINE SPEED", 60)
        run()

        microcode.onLineDetected(RobotLineState.Both, () => {
            pause(40)
            robot.decodeRobotCompactCommand(RobotCompactCommand.MotorRunForward)
        })
        microcode.onLineDetected(RobotLineState.Left, () => {
            pause(40)
            robot.decodeRobotCompactCommand(RobotCompactCommand.MotorTurnLeft)
        })
        microcode.onLineDetected(RobotLineState.Right, () => {
            pause(40)
            robot.decodeRobotCompactCommand(RobotCompactCommand.MotorTurnRight)
        })
        microcode.onLineDetected(RobotLineState.LostLeft, () => {
            pause(40)
            robot.decodeRobotCompactCommand(RobotCompactCommand.MotorSpinLeft)
        })
        microcode.onLineDetected(RobotLineState.LostRight, () => {
            pause(40)
            robot.decodeRobotCompactCommand(RobotCompactCommand.MotorSpinRight)
        })
        microcode.onLineDetected(RobotLineState.None, () => {
            pause(40)
            robot.decodeRobotCompactCommand(RobotCompactCommand.MotorStop)
        })
    }
}
