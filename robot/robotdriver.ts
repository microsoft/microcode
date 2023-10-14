/**
 * Microcode Robot
 */
//% color="#ff6800" icon="\uf1b9" weight=15
namespace microcode {
    const RUN_STOP_THRESHOLD = 2
    const TARGET_SPEED_THRESHOLD = 4
    const SPEED_TRANSITION_ALPHA = 0.915
    const TARGET_TURN_RATIO_THRESHOLD = 20
    const TURN_RATIO_TRANSITION_ALPHA = 0.8
    const ULTRASONIC_MIN_READING = 1

    /**
     *
     */
    //% fixedInstances
    export class RobotDriver {
        readonly robot: robots.Robot
        private lastReceivedMessageId: number = undefined
        private running = false
        currentUltrasonicDistance: number = 100
        private showConfiguration: boolean = false
        private configDrift = false
        private currentArmAperture = -1
        private currentSpeed: number = 0
        private targetSpeed: number = 0
        private currentTurnRatio = 0
        private targetTurnRatio: number = 0

        currentLineState: RobotLineState = RobotLineState.None

        private stopToneMillis: number = 0
        lineAssist = false
        runDrift = 0

        constructor(robot: robots.Robot) {
            this.robot = robot

            microcode.robot = this
        }

        private configureButtons() {
            input.onButtonPressed(Button.A, () => {
                if (this.showConfiguration) return
                this.playTone(440, 500)
                if (this.configDrift)
                    this.runDrift--
                else
                    robots.previousGroup()
                this.showConfigurationState()
            })
            input.onButtonPressed(Button.B, () => {
                if (this.showConfiguration) return
                this.playTone(640, 500)
                if (this.configDrift)
                    this.runDrift++
                else
                    robots.nextGroup()
                this.showConfigurationState()
            })
            input.onButtonPressed(Button.AB, () => {
                if (this.showConfiguration) return
                this.playTone(840, 500)
                this.configDrift = !this.configDrift
                this.showConfigurationState(true)
            })
        }

        private showConfigurationState(showTitle?: boolean) {
            this.showConfiguration = true
            const title = this.configDrift ? "DRIFT" : "RADIO"
            const value = this.configDrift ? this.runDrift : robots.radioGroup
            led.stopAnimation()
            if (showTitle) {
                basic.clearScreen()
                basic.showString(title, 60)
            }
            basic.showNumber(value, 50)
            this.showConfiguration = false
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
            this.robot.headlightsSetColor(0, 0xff, 0)
            // wake up sensors
            this.motorStop()
            this.ultrasonicDistance()
            this.lineState()
            this.startRadioReceiver()
            this.configureButtons()
            basic.forever(() => this.updateSonar()) // potentially slower
            control.inBackground(() => this.backgroundWork())
            this.showConfigurationState(true)
        }

        private backgroundWork() {
            while (this.running) {
                this.updateTone()
                this.updateLineState()
                this.updateSpeed()
                this.updateArm()
                basic.pause(5)
            }
        }

        private updateArm() {
            if (this.currentArmAperture < 0) return

            this.robot.armOpen(this.currentArmAperture)
        }

        private inRadioMessageId = 0

        private startRadioReceiver() {
            // handle radio package messages
            //radio.onReceivedBuffer(buf => {
            //    const msg = robots.decodeRobotCommand(buf)
            //    this.dispatch(msg)
            //})
            radio.setTransmitSerialNumber(true);
            radio.onReceivedNumber(code => {
                const msg = robots.decodeRobotCompactCommand(code)
                this.dispatch(msg)
            })
        }

        private updateSpeed() {
            // smooth update of speed
            {
                const alpha = SPEED_TRANSITION_ALPHA
                this.currentSpeed =
                    this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (Math.abs(this.currentSpeed - this.targetSpeed) < TARGET_SPEED_THRESHOLD)
                    this.currentSpeed = this.targetSpeed
            }
            // smoth update of turn ratio
            {
                const alpha = TURN_RATIO_TRANSITION_ALPHA
                this.currentTurnRatio =
                    this.currentTurnRatio * alpha + this.targetTurnRatio * (1 - alpha)
                if (Math.abs(this.currentTurnRatio - this.targetTurnRatio) < TARGET_TURN_RATIO_THRESHOLD)
                    this.currentTurnRatio = this.targetTurnRatio
            }

            if (Math.abs(this.currentSpeed) < RUN_STOP_THRESHOLD) {
                this.setMotorState(0, 0)
            }
            else {
                let s = this.currentSpeed
                if (this.lineAssist && this.currentLineState && s > 0)
                    s = Math.min(Math.abs(s), this.robot.maxLineTurnSpeed)
                const ns = Math.abs(s)

                let left = 0
                let right = 0
                // apply turn ratio
                if (this.currentTurnRatio < 0) {
                    right += s
                    left += s * (1 + (this.currentTurnRatio / 100))
                } else {
                    left += s
                    right += s * (1 - (this.currentTurnRatio / 100))
                }

                // clamp
                left = Math.clamp(-ns, ns, Math.round(left))
                right = Math.clamp(-ns, ns, Math.round(right))

                // apply drift
                const drift = this.runDrift / 2
                left -= drift
                right += drift

                // clamp again
                left = Math.clamp(-100, 100, Math.round(left))
                right = Math.clamp(-100, 100, Math.round(right))
                this.setMotorState(left, right)
            }
        }

        private setMotorState(left: number, right: number) {
            this.robot.motorRun(left, right)
            if (this.showConfiguration) return
            this.showSingleMotorState(3, left)
            this.showSingleMotorState(1, right)
        }

        private showSingleMotorState(x: number, speed: number) {
            if (this.showConfiguration) return

            if (Math.abs(speed) < 30) led.unplot(x, 2)
            else led.plot(x, 2)
            if (speed >= 30) led.plot(x, 1)
            else led.unplot(x, 1)
            if (speed >= 50) led.plot(x, 0)
            else led.unplot(x, 0)
            if (speed <= -30) led.plot(x, 3)
            else led.unplot(x, 3)
            if (speed <= -50) led.plot(x, 4)
            else led.unplot(x, 4)
        }

        private updateLineState() {
            const lineState = this.lineState()
            if (this.showConfiguration) return

            // render left/right lines
            const left =
                (lineState & RobotLineState.Left) === RobotLineState.Left
            const right =
                (lineState & RobotLineState.Right) === RobotLineState.Right
            for (let i = 1; i < 5; ++i) {
                if (left) led.plot(4, i)
                else led.unplot(4, i)
                if (right) led.plot(0, i)
                else led.unplot(0, i)
            }
            if (this.inRadioMessageId % 2)
                led.plot(4, 0)
            else
                led.unplot(4, 0)
        }

        private lastSonarValue = 0
        private updateSonar() {
            const dist = this.ultrasonicDistance()
            if (this.showConfiguration) return

            // render sonar
            if (dist > ULTRASONIC_MIN_READING) {
                const d = Math.clamp(1, 5, Math.ceil(dist / 5))
                for (let y = 0; y < 5; y++)
                    if (y + 1 >= d) led.plot(2, y)
                    else led.unplot(2, y)

                if (d !== this.lastSonarValue) {
                    this.lastSonarValue = d
                    const msg = microcode.robots.RobotCompactCommand.ObstacleState | d
                    microcode.robots.sendCompactCommand(msg)
                    this.playTone(2400 - d * 400, 200 + d * 25)
                }
            }
        }

        private setHeadlingSpeedColor(speed: number) {
            if (speed === 0) this.robot.headlightsSetColor(0, 0, 0)
            else if (speed > 0) this.robot.headlightsSetColor(0, 0, 0xf0)
            else this.robot.headlightsSetColor(0xf0, 0, 0)
        }

        armOpen(aperture: number) {
            this.start()
            this.currentArmAperture = Math.clamp(-1, 100, Math.round(aperture))
        }

        motorRun(turnRatio: number, speed: number) {
            this.start()
            turnRatio = Math.clamp(-200, 200, turnRatio)
            speed = Math.clamp(-100, 100, Math.round(speed))
            if (this.targetSpeed !== speed || this.currentTurnRatio !== turnRatio) {
                this.setHeadlingSpeedColor(speed)
                this.targetSpeed = speed
                this.targetTurnRatio = turnRatio
            }
        }

        motorStop() {
            this.motorRun(0, 0)
        }

        ultrasonicDistance() {
            let retry = 3
            while (retry-- > 0) {
                const dist = this.robot.ultrasonicDistance()
                if (dist > 1) {
                    this.currentUltrasonicDistance = dist
                    break
                }
            }
            return this.currentUltrasonicDistance
        }

        lineState(): RobotLineState {
            const ls = this.robot.lineState()
            if (ls !== this.currentLineState) {
                this.currentLineState = ls
                const msg = microcode.robots.RobotCompactCommand.LineState | this.currentLineState
                microcode.robots.sendCompactCommand(msg)
            }
            return ls
        }

        private headlightsSetColor(red: number, green: number, blue: number) {
            this.robot.headlightsSetColor(red, green, blue)
        }

        stop() {
            this.setHeadlingSpeedColor(0)
            this.robot.motorRun(0, 0)
        }

        playTone(frequency: number, duration: number) {
            if (this.robot.musicVolume <= 0) return
            music.setVolume(this.robot.musicVolume)
            this.stopToneMillis = control.millis() + duration
            music.ringTone(frequency)
        }

        private updateTone() {
            if (this.stopToneMillis && this.stopToneMillis < control.millis()) {
                music.stopAllSounds()
                this.stopToneMillis = 0
            }
        }

        dispatch(msg: robots.RobotMessage) {
            if (!msg) return

            const messageId = msg.messageId
            if (this.lastReceivedMessageId === messageId) {
                return // duplicate
            }

            // decode message
            this.lastReceivedMessageId = messageId
            const cmd = msg.cmd
            const payload = msg.payload

            switch (cmd) {
                case robots.RobotCommand.MotorTurn: {
                    const turnRatio = payload.getNumber(NumberFormat.Int16LE, 0)
                    const speed = payload.getNumber(NumberFormat.Int16LE, 2)
                    this.motorRun(turnRatio, speed)
                    this.inRadioMessageId++
                    this.playTone(440, 50)
                    break
                }
                case robots.RobotCommand.MotorArm: {
                    const aperture = payload.getNumber(NumberFormat.Int16LE, 0)
                    this.armOpen(aperture)
                    this.inRadioMessageId++
                    this.playTone(1132, 50)
                    break
                }
            }
        }
    }
}
