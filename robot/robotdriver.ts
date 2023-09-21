/**
 * Microcode Robot
 */
//% color="#ff6800" icon="\uf1b9" weight=15
namespace microcode {
    const ROBOT_TIMEOUT = 1000
    const SHOW_RADIO_COUNT = 50

    enum RobotSpeedMode {
        Run, Turn
    }

    /**
     * 
     */
    //% fixedInstances
    export class RobotDriver {
        readonly robot: robots.Robot
        private lastReceivedMessageId: number = undefined
        private lastCommandTime: number
        private running = false
        private lastUltrasonicDistance: number = 100
        private showRadio: number
        private currentSpeed: number = 0
        private currentSpeedMode = RobotSpeedMode.Run
        private targetSpeed: number = 0
        private targetSpeedMode = RobotSpeedMode.Run

        runDrift = 0

        constructor(robot: robots.Robot) {
            this.robot = robot

            microcode.robotDriver = this
        }

        /**
         * Starts the motor driver
         */
        //% block="robot start %this"
        //% blockId=microcoderobotstart
        //% weight=100
        start() {
            if (this.running) return

            this.running = true
            this.showRadio = SHOW_RADIO_COUNT
            this.playMelody(Melodies.BaDing)
            // wake up sensors
            this.ultrasonicDistance()
            this.lineState()
            input.onButtonPressed(Button.A, () => {
                robots.previousGroup()
                this.showRadio = SHOW_RADIO_COUNT
            })
            input.onButtonPressed(Button.B, () => {
                robots.nextGroup()
                this.showRadio = SHOW_RADIO_COUNT
            })
            this.startRadioReceiver()
            control.inBackground(() => this.backgroundWork())
        }

        private backgroundWork() {
            while (this.running) {
                this.checkAlive()
                this.updateSpeed()
                if (this.showRadio-- > 0)
                    robots.showRadioStatus()
                else
                    this.showSensors()
                basic.pause(20)
            }
        }

        private startRadioReceiver() {
            // handle radio package messages
            radio.onReceivedBuffer(buf => {
                const msg = robots.decodeRobotCommand(buf)
                this.dispatch(msg)
            })
        }


        private updateSpeed() {
            if (this.currentSpeed === this.targetSpeed && this.currentSpeedMode === this.targetSpeedMode) return // nothing to do

            // transition from one mode to the other, robot should stop
            if (this.currentSpeedMode !== this.targetSpeedMode) {
                const alpha = 0.8
                this.currentSpeed = this.currentSpeed * alpha
                if (Math.abs(this.currentSpeed) < 10) {
                    this.currentSpeed = 0
                    this.currentSpeedMode = this.targetSpeedMode
                }
            }
            else {
                const alpha = 0.8
                this.currentSpeed = this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (Math.abs(this.currentSpeed - this.targetSpeed) < 10)
                    this.currentSpeed = this.targetSpeed
            }

            if (this.currentSpeedMode === RobotSpeedMode.Run) {
                let d = Math.abs(this.currentSpeed) > this.runDrift ? this.runDrift >> 1 : 0
                const left = this.currentSpeed - d
                const right = this.currentSpeed + d
                this.robot.motorRun(left, right)
            }
            else
                this.robot.motorTurn(this.targetSpeed)
        }

        private showSensors() {
            const lineState = this.lineState()
            const dist = this.ultrasonicDistance()

            // render
            basic.clearScreen()
            // render left/right lines
            const left = (lineState & RobotLineState.Left) === RobotLineState.Left
            const right = (lineState & RobotLineState.Right) === RobotLineState.Right
            for (let i = 0; i < 5; ++i) {
                if (left) led.plot(0, i); else led.unplot(0, i)
                if (right) led.plot(4, i); else led.unplot(4, i)
            }
            // render sonar
            if (dist > 0) {
                for (let x = 1; x < 4; x++)
                    for (let y = 0; y < 5; y++)
                        if (dist > 0 && dist < 5 + y * 5) led.plot(x, y); else led.unplot(x, y)
            }
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
            this.start()
            this.keepAlive()
            speed = speed > 0 ? Math.min(this.robot.maxRunSpeed, speed) : Math.max(-this.robot.maxRunSpeed, speed)
            this.setHeadlingSpeedColor(speed)
            this.targetSpeedMode = RobotSpeedMode.Run
            this.targetSpeed = speed
        }

        motorTurn(speed: number) {
            this.start()
            this.keepAlive()
            speed = speed > 0 ? Math.min(this.robot.maxTurnSpeed, speed) : Math.max(-this.robot.maxTurnSpeed, speed)
            this.setHeadlingSpeedColor(speed)
            this.targetSpeedMode = RobotSpeedMode.Turn
            this.targetSpeed = speed
        }

        motorStop() {
            this.motorRun(0)
        }

        ultrasonicDistance() {
            const dist = this.robot.ultrasonicDistance()
            if (dist > 0)
                this.lastUltrasonicDistance = dist
            return this.lastUltrasonicDistance
        }

        lineState(): RobotLineState {
            return this.robot.lineState()
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
            this.robot.motorRun(0, 0)
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

        dispatch(msg: robots.RobotMessage) {
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
                case robots.RobotCommand.MotorRun: {
                    const speed = Math.clamp(-100, 100, payload.getNumber(NumberFormat.Int16LE, 0))
                    console.log(`motor run ${speed}`)
                    this.motorRun(speed)
                    break
                }
                case robots.RobotCommand.MotorTurn: {
                    const speed = Math.clamp(-100, 100, payload.getNumber(NumberFormat.Int16LE, 0))
                    console.log(`motor turn ${speed}`)
                    this.motorTurn(speed)
                    break
                }
            }
        }
    }
}