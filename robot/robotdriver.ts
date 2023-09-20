namespace microcode {
    export const ROBOT_TIMEOUT = 1000

    export class RobotDriver implements Robot {
        private readonly robot: Robot
        private lastCommandTime: number

        constructor(robot: Robot) {
            this.robot = robot
        }


        keepAlive() {
            this.lastCommandTime = control.millis()
        }

        motorRun(speed: number) {
            this.keepAlive()
            this.robot.motorRun(speed)
        }

        motorTurn(speed: number) {
            this.keepAlive()
            this.robot.motorTurn(speed)
        }

        ledSetColor(red: number, green: number, blue: number) {
            this.keepAlive()
            this.robot.ledSetColor(red, green, blue)
        }

        checkAlive() {
            if (control.millis() - this.lastCommandTime > ROBOT_TIMEOUT)
                this.stop()
        }

        stop() {
            this.robot.motorRun(0)
            this.robot.ledSetColor(0, 0, 0)
        }
    }

    export let robot: RobotDriver
}