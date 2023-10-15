/**
 * Microcode Robot
 */
//% color="#ff6800" icon="\uf1b9" weight=15
//% groups=['Move', 'Input', 'Configuration']
namespace microcode {
    const MAX_GROUPS = 32

    function radioGroupFromDeviceSerialNumber() {
        const sn = control.deviceLongSerialNumber()
        return (sn.hash(10) % 20) + 1
    }

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

        private leds: robots.RobotLEDs
        private ledsBuffer: Buffer

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

            // prep lights
            this.leds = this.robot.leds()
            if (this.leds)
                this.ledsBuffer = Buffer.create(this.leds.count * 3)
            this.setColor(0x0000ff)
            // stop motors
            this.motorStop()
            // wake up sensors
            this.ultrasonicDistance()
            this.lineState()

            this.startRadioReceiver()
            this.configureButtons()
            basic.forever(() => this.updateSonar()) // potentially slower
            control.inBackground(() => this.backgroundWork())

            // schedule after main
            control.inBackground(() => {
                this.showConfigurationState(true)
            })
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

        public setColor(rgb: number) {
            let red = (rgb >> 16) & 0xff
            let green = (rgb >> 8) & 0xff
            let blue = (rgb >> 0) & 0xff
            this.robot.headlightsSetColor(red, green, blue)
            if (!this.leds) return
            const b = this.ledsBuffer

            red = Math.min(0xe0, red)
            green = Math.min(0xe0, green)
            blue = Math.min(0xe0, blue)

            for (let i = 0; i + 2 < b.length; i += 3) {
                b[i] = green
                b[i + 1] = red
                b[i + 2] = blue
            }
            ws2812b.sendBuffer(this.ledsBuffer, this.leds.pin)
        }

        private updateArm() {
            if (this.currentArmAperture < 0) return

            this.robot.armOpen(this.currentArmAperture)
        }

        private inRadioMessageId = 0

        private startRadioReceiver() {
            this.setRadioGroup(radioGroupFromDeviceSerialNumber())
            radio.setTransmitSerialNumber(true);
            radio.onReceivedNumber(code => {
                this.decodeRobotCompactCommand(code)
            })
        }

        private updateSpeed() {
            // smooth update of speed
            {
                const accelerating = this.targetSpeed > 0 && this.currentSpeed < this.targetSpeed
                const alpha = accelerating ? this.robot.speedTransitionAlpha : this.robot.speedBrakeTransitionAlpha
                this.currentSpeed =
                    this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (this.lineAssist && this.currentSpeed > 0) {
                    if (this.currentLineState // left, right, front
                        || this.currentLineStateCounter < this.robot.lineAssistLostThreshold) // recently lost line
                        this.currentSpeed = Math.min(this.currentSpeed, this.robot.maxLineSpeed)
                }
                if (Math.abs(this.currentSpeed - this.targetSpeed) < this.robot.targetSpeedThreshold)
                    this.currentSpeed = this.targetSpeed
            }
            // smoth update of turn ratio
            {
                const alpha = this.robot.turnRatioTransitionAlpha
                this.currentTurnRatio =
                    this.currentTurnRatio * alpha + this.targetTurnRatio * (1 - alpha)
                if (Math.abs(this.currentTurnRatio - this.targetTurnRatio) < this.robot.targetTurnRatioThreshold)
                    this.currentTurnRatio = this.targetTurnRatio
            }

            if (Math.abs(this.currentSpeed) < this.robot.runStopThreshold)
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
            if (dist > this.robot.ultrasonicMinReading) {
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

        armOpen(aperture: number) {
            this.start()
            this.currentArmAperture = Math.clamp(-1, 100, Math.round(aperture))
        }

        motorRun(turnRatio: number, speed: number) {
            this.start()
            turnRatio = Math.clamp(-200, 200, turnRatio)
            speed = Math.clamp(-100, 100, Math.round(speed))
            if (this.targetSpeed !== speed || this.currentTurnRatio !== turnRatio) {
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
                    const command = this.robot.commands[msg] || {}
                    const turnRatio = command.turnRatio || 0
                    const speed = command.speed || 0
                    this.motorRun(turnRatio, speed);
                    this.playTone(440, 50)
                    break
                }
                case microcode.robots.RobotCompactCommand.MotorLEDRed:
                    this.setColor(0xff0000); break;
                case microcode.robots.RobotCompactCommand.MotorLEDGreen:
                    this.setColor(0x00ff00); break;
                case microcode.robots.RobotCompactCommand.MotorLEDBlue:
                    this.setColor(0x0000ff); break;
            }
        }
    }
}