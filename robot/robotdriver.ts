/**
 * Microcode Robot
 */
//% color="#ff6800" icon="\uf1b9" weight=15
//% groups=['Move', 'Input', 'Configuration']
namespace microcode {
    const MAX_GROUPS = 32
    const RUN_STOP_THRESHOLD = 2
    const TARGET_SPEED_THRESHOLD = 4
    const SPEED_TRANSITION_ALPHA = 0.97
    const SPEED_BRAKE_TRANSITION_ALPHA = 0.8
    const TARGET_TURN_RATIO_THRESHOLD = 20
    const TURN_RATIO_TRANSITION_ALPHA = 0.2
    const ULTRASONIC_MIN_READING = 1
    const LINE_ASSIST_LOST_THRESHOLD = 72

    /**
     *
     */
    //% fixedInstances
    export class RobotDriver {
        readonly robot: robots.Robot
        private running = false
        /**
         * Gets the latest distance returned by the se nsor
         */
        currentUltrasonicDistance: number = 100
        private showConfiguration: boolean = false
        private configDrift = false
        private currentArmAperture = -1
        private currentSpeed: number = 0
        private targetSpeed: number = 0
        private currentTurnRatio = 0
        private targetTurnRatio: number = 0
        private radioGroup: number

        /**
         * Gets the latest line sensor state
         */
        currentLineState: RobotLineState = RobotLineState.None
        private currentLineStateCounter = 0

        private stopToneMillis: number = 0
        lineAssist = true
        runDrift = 0

        constructor(robot: robots.Robot) {
            this.robot = robot
            const sn = control.deviceSerialNumber()
            this.setRadioGroup(Math.abs(control.deviceSerialNumber() % 9) + 1)
            microcode.robot = this
        }

        private configureButtons() {
            input.onButtonPressed(Button.A, () => {
                if (this.showConfiguration) return
                this.playTone(440, 500)
                if (this.configDrift)
                    this.runDrift--
                else
                    this.previousGroup()
                this.showConfigurationState()
            })
            input.onButtonPressed(Button.B, () => {
                if (this.showConfiguration) return
                this.playTone(640, 500)
                if (this.configDrift)
                    this.runDrift++
                else
                    this.nextGroup()
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
            const value = this.configDrift ? this.runDrift : this.radioGroup
            led.stopAnimation()
            if (showTitle) {
                basic.clearScreen()
                basic.showString(title + " " + value, 60)
            }
            else
                basic.showNumber(value, 60)
            this.showConfiguration = false
        }

        /**
         * Starts the motor driver
         */
        //% block="robot start %this"
        //% blockId=microcoderobotstart
        //% weight=100
        //% group="Configuration"
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
            radio.setTransmitSerialNumber(true);
            radio.onReceivedNumber(code => {
                this.decodeRobotCompactCommand(code)
            })
        }

        private updateSpeed() {
            // smooth update of speed
            {
                const accelerating = this.targetSpeed > 0 && this.currentSpeed < this.targetSpeed
                const alpha = accelerating ? SPEED_TRANSITION_ALPHA : SPEED_BRAKE_TRANSITION_ALPHA
                this.currentSpeed =
                    this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (this.lineAssist && this.currentSpeed > 0) {
                    if (this.currentLineState // left, right, front
                        || this.currentLineStateCounter < LINE_ASSIST_LOST_THRESHOLD) // recently lost line
                        this.currentSpeed = Math.min(this.currentSpeed, this.robot.maxLineSpeed)
                }
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

            if (Math.abs(this.currentSpeed) < RUN_STOP_THRESHOLD)
                this.setMotorState(0, 0)
            else {
                let s = this.currentSpeed
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
                    this.playTone(2400 - d * 400, 200 + d * 25)
                    const msg = microcode.robots.RobotCompactCommand.ObstacleState | d
                    this.sendCompactCommand(msg)
                    microcode.robots.raiseEvent(microcode.robots.RobotCompactCommand.ObstacleState)
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

        private lineState(): RobotLineState {
            const ls = this.robot.lineState()
            if (ls !== this.currentLineState) {
                this.currentLineState = ls
                this.currentLineStateCounter = 0
                const msg = microcode.robots.RobotCompactCommand.LineState | this.currentLineState
                this.sendCompactCommand(msg)
                microcode.robots.raiseEvent(msg)
            }
            this.currentLineStateCounter++
            return ls
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

        private previousGroup() {
            this.setRadioGroup(this.radioGroup === 1 ? MAX_GROUPS - 1 : this.radioGroup - 1)
        }

        private nextGroup() {
            this.setRadioGroup(this.radioGroup === MAX_GROUPS - 1 ? 1 : this.radioGroup + 1)
        }

        setRadioGroup(newGroup: number) {
            if (newGroup < 0) newGroup += MAX_GROUPS
            this.radioGroup = newGroup % MAX_GROUPS
            radio.setGroup(this.radioGroup)
        }

        private sendCompactCommand(cmd: microcode.robots.RobotCompactCommand) {
            radio.sendNumber(cmd)
        }


        private decodeRobotCompactCommand(msg: number) {
            this.inRadioMessageId++
            switch (msg) {
                case microcode.robots.RobotCompactCommand.MotorStop:
                case microcode.robots.RobotCompactCommand.MotorTurnLeft:
                case microcode.robots.RobotCompactCommand.MotorTurnRight:
                case microcode.robots.RobotCompactCommand.MotorSpinLeft:
                case microcode.robots.RobotCompactCommand.MotorSpinRight:
                case microcode.robots.RobotCompactCommand.MotorRunForwardFast:
                case microcode.robots.RobotCompactCommand.MotorRunForward:
                case microcode.robots.RobotCompactCommand.MotorRunBackward: {
                    let turnRatio = 0
                    let speed = 0
                    switch (msg) {
                        case microcode.robots.RobotCompactCommand.MotorRunForward: speed = 70; break;
                        case microcode.robots.RobotCompactCommand.MotorRunForwardFast: speed = 100; break;
                        case microcode.robots.RobotCompactCommand.MotorRunBackward: speed = -50; break;
                        case microcode.robots.RobotCompactCommand.MotorTurnLeft: turnRatio = -50; speed = 70; break;
                        case microcode.robots.RobotCompactCommand.MotorTurnRight: turnRatio = 50; speed = 70; break;
                        case microcode.robots.RobotCompactCommand.MotorSpinLeft: turnRatio = -200; speed = 60; break;
                        case microcode.robots.RobotCompactCommand.MotorSpinRight: turnRatio = 200; speed = 60; break;
                    }
                    this.motorRun(turnRatio, speed);
                    this.playTone(440, 50)
                    break
                }
                case microcode.robots.RobotCompactCommand.MotorArmClose: {
                    this.armOpen(0)
                    break
                }
                case microcode.robots.RobotCompactCommand.MotorArmOpen: {
                    this.armOpen(100)
                    break
                }
            }
        }
    }
}