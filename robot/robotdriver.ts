namespace microcode {
    export const ROBOT_TIMEOUT = 1000

    export class RobotDriver {
        readonly robot: Robot
        private lastReceivedMessageId: number = undefined
        private lastCommandTime: number

        constructor(robot: Robot) {
            this.robot = robot
        }

        keepAlive() {
            this.lastCommandTime = control.millis()
        }

        private motorRun(speed: number) {
            this.keepAlive()
            this.robot.motorRun(speed)
        }

        private motorTurn(speed: number) {
            this.keepAlive()
            this.robot.motorTurn(speed)
        }

        private ledSetColor(red: number, green: number, blue: number) {
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

        dispatch(msg: RobotMessage) {
            if (!msg) return

            const messageId = msg.messageId
            if (this.lastReceivedMessageId === messageId) {
                this.keepAlive()
                return // duplicate
            }

            // decode message
            this.lastReceivedMessageId = messageId
            const cmd = msg.cmd
            const payload = msg.payload
            switch (cmd) {
                case RobotCommand.MotorRun: {
                    const speed = Math.clamp(-100, 100, payload.getNumber(NumberFormat.Int16LE, 0))
                    console.log(`motor run ${speed}`)
                    this.motorRun(speed)
                    break
                }
                case RobotCommand.MotorTurn: {
                    const speed = Math.clamp(-100, 100, payload.getNumber(NumberFormat.Int16LE, 0))
                    console.log(`motor turn ${speed}`)
                    this.motorTurn(speed)
                    break
                }
                case RobotCommand.LedSetColor: {
                    const red = payload[0]
                    const green = payload[1]
                    const blue = payload[2]
                    console.log(`led set color ${red} ${green} ${blue}`)
                    this.ledSetColor(red, green, blue)
                }
            }
        }
    }

    export let robotDriver: RobotDriver
}