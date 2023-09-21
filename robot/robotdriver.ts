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

        private setHeadlingSpeedColor(speed: number) {
            if (speed === 0) this.robot.headlightsSetColor(0, 0, 0)
            else if (speed > 0) this.robot.headlightsSetColor(0, 0, 0xff)
            else this.robot.headlightsSetColor(0xff, 0, 0)
        }

        motorRun(speed: number) {
            this.keepAlive()
            speed = speed > 0 ? Math.min(this.robot.maxRunSpeed, speed) : Math.max(-this.robot.maxRunSpeed, speed)
            this.setHeadlingSpeedColor(speed)
            this.robot.motorRun(speed)
        }

        motorTurn(speed: number) {
            this.keepAlive()
            speed = speed > 0 ? Math.min(this.robot.maxTurnSpeed, speed) : Math.max(-this.robot.maxTurnSpeed, speed)
            this.setHeadlingSpeedColor(speed)
            this.robot.motorTurn(speed)
        }

        ultrasonicDistance() {
            return this.robot.ultrasonicDistance()
        }

        private headlightsSetColor(red: number, green: number, blue: number) {
            this.keepAlive()
            this.robot.headlightsSetColor(red, green, blue)
        }

        checkAlive() {
            if (control.millis() - this.lastCommandTime > ROBOT_TIMEOUT)
                this.stop()
        }

        stop() {
            this.setHeadlingSpeedColor(0)
            this.robot.motorRun(0)
        }

        playMelody(melody: Melodies) {
            if (this.robot.musicVolume <= 0) return
            music.setVolume(this.robot.musicVolume)
            music.play(music.builtInPlayableMelody(melody), music.PlaybackMode.InBackground)
        }

        playTone(frequency: number) {
            if (this.robot.musicVolume <= 0) return
            music.setVolume(this.robot.musicVolume)
            music.playTone(frequency, 200)
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
            }
        }
    }
}