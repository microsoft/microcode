namespace microcode {
    const MAX_GROUPS = 25

    function radioGroupFromDeviceSerialNumber() {
        const sn = control.deviceLongSerialNumber()
        return (sn.hash(10) % 9) + 1
    }

    //% shim=TD_NOOP
    function nativeSendNumber(msg: number) {
        radio.sendNumber(msg)
    }

    /**
     *
     */
    //% fixedInstances
    export class RobotDriver {
        readonly robot: robots.Robot
        /**
         * Gets the latest distance returned by the sensor
         */
        currentUltrasonicDistance: number = 100
        private lastSonarValue = 0

        private showConfiguration: boolean = false
        private configDrift: boolean = undefined
        private currentArmAperture = -1
        private currentSpeed: number = 0
        private targetSpeed: number = 0
        private currentTurnRatio = 0
        private targetTurnRatio: number = 0
        private radioGroup: number
        private inRadioMessageId: number = undefined

        /**
         * Gets the latest line sensor state
         */
        currentLineState: RobotLineState = RobotLineState.None
        private currentLineStateCounter = 0

        private stopToneMillis: number = 0
        lineAssist = true
        private runDrift = 0

        private leds: robots.RobotLEDs
        private ledsBuffer: Buffer

        private sonar: robots.Sonar
        private lineDetectors: robots.LineDetectors

        constructor(robot: robots.Robot) {
            this.robot = robot
        }

        private configureButtons() {
            input.onButtonPressed(Button.A, () => {
                if (this.showConfiguration) return
                this.playTone(440, 500)
                if (this.configDrift !== undefined) {
                    if (this.configDrift) this.setRunDrift(this.runDrift - 1)
                    else this.previousGroup()
                }
                this.showConfigurationState()
            })
            input.onButtonPressed(Button.B, () => {
                if (this.showConfiguration) return
                this.playTone(640, 500)
                if (this.configDrift !== undefined) {
                    if (this.configDrift) this.setRunDrift(this.runDrift + 1)
                    else this.nextGroup()
                }
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

            led.stopAnimation()
            basic.clearScreen()
            if (this.configDrift === undefined) {
                basic.showString(
                    `RADIO ${this.radioGroup} DRIFT ${this.runDrift}`,
                    64
                )
            } else {
                const title = this.configDrift ? "DRIFT" : "RADIO"
                const value = this.configDrift ? this.runDrift : this.radioGroup
                basic.showString(title + " " + value, 64)
            }
            this.showConfiguration = false
        }

        /**
         * Starts the motor driver
         */
        //% block="robot %this start"
        //% blockId=microcoderobotstart
        //% weight=100
        //% group="Configuration"
        start() {
            if (microcode.robot === this) return // already started
            if (microcode.robot) throw "Another robot has already been started."
            microcode.robot = this

            // configuration of common hardware
            this.radioGroup =
                microcode.__readCalibration(0) ||
                radioGroupFromDeviceSerialNumber()
            this.runDrift = microcode.__readCalibration(1)
            this.leds = this.robot.leds
            if (this.leds) this.ledsBuffer = Buffer.create(this.leds.count * 3)
            this.lineDetectors = this.robot.lineDetectors
            if (this.lineDetectors) {
                pins.setPull(this.lineDetectors.left, PinPullMode.PullNone)
                pins.setPull(this.lineDetectors.right, PinPullMode.PullNone)
            }
            this.sonar = this.robot.sonar
            if (this.sonar) pins.setPull(this.sonar.trig, PinPullMode.PullNone)

            // stop motors
            this.setColor(0x0000ff)
            this.motorRun(0, 0)
            // wake up sensors
            this.ultrasonicDistance()
            this.lineState()

            this.configureButtons()
            basic.forever(() => this.updateSonar()) // potentially slower
            control.inBackground(() => this.backgroundWork())
        }

        private backgroundWork() {
            while (true) {
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

        /**
         * Starts the reception and transmission of robot command messages
         */
        startRadio() {
            if (this.inRadioMessageId === undefined) {
                radio.setGroup(this.radioGroup)
                radio.setTransmitSerialNumber(true)
                radio.onReceivedNumber(code =>
                    this.decodeRobotCompactCommand(code)
                )
                this.inRadioMessageId = 0
            }
        }

        private updateSpeed() {
            // smooth update of speed
            {
                const accelerating =
                    this.targetSpeed > 0 && this.currentSpeed < this.targetSpeed
                const alpha = accelerating
                    ? this.robot.speedTransitionAlpha
                    : this.robot.speedBrakeTransitionAlpha
                this.currentSpeed =
                    this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (this.lineAssist && this.currentSpeed > 0) {
                    if (
                        this.currentLineState || // left, right, front
                        this.currentLineStateCounter <
                            this.robot.lineAssistLostThreshold
                    )
                        // recently lost line
                        this.currentSpeed = Math.min(
                            this.currentSpeed,
                            this.robot.maxLineSpeed
                        )
                }
                if (
                    Math.abs(this.currentSpeed - this.targetSpeed) <
                    this.robot.targetSpeedThreshold
                )
                    this.currentSpeed = this.targetSpeed
            }
            // smoth update of turn ratio
            {
                const alpha = this.robot.turnRatioTransitionAlpha
                this.currentTurnRatio =
                    this.currentTurnRatio * alpha +
                    this.targetTurnRatio * (1 - alpha)
                if (
                    Math.abs(this.currentTurnRatio - this.targetTurnRatio) <
                    this.robot.targetTurnRatioThreshold
                )
                    this.currentTurnRatio = this.targetTurnRatio
            }

            if (Math.abs(this.currentSpeed) < this.robot.stopThreshold)
                this.setMotorState(0, 0)
            else {
                let s = this.currentSpeed
                const ns = Math.abs(s)

                let left = 0
                let right = 0
                // apply turn ratio
                if (this.currentTurnRatio < 0) {
                    right += s
                    left += s * (1 + this.currentTurnRatio / 100)
                } else {
                    left += s
                    right += s * (1 - this.currentTurnRatio / 100)
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
            if (this.inRadioMessageId % 2) led.plot(4, 0)
            else led.unplot(4, 0)
        }

        private updateSonar() {
            const dist = this.ultrasonicDistance()
            if (dist > this.robot.ultrasonicMinReading) {
                const d = Math.clamp(1, 5, Math.ceil(dist / 5))
                if (!this.showConfiguration) {
                    for (let y = 0; y < 5; y++)
                        if (y + 1 >= d) led.plot(2, y)
                        else led.unplot(2, y)
                }
                if (d !== this.lastSonarValue) {
                    this.lastSonarValue = d
                    //this.playTone(2400 - d * 400, 200 + d * 25)
                    const msg =
                        microcode.robots.RobotCompactCommand.ObstacleState | d
                    this.sendCompactCommand(msg)
                    microcode.robots.raiseEvent(
                        microcode.robots.RobotCompactCommand.ObstacleState
                    )
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
            if (
                this.targetSpeed !== speed ||
                this.currentTurnRatio !== turnRatio
            ) {
                this.targetSpeed = speed
                this.targetTurnRatio = turnRatio
            }
        }

        private ultrasonicDistanceOnce() {
            if (!this.sonar) return this.robot.ultrasonicDistance()
            else {
                const trig = this.sonar.trig
                const echo = this.sonar.echo
                const maxCmDistance = 50
                const TO_CM = 58

                // send pulse
                pins.digitalWritePin(trig, 0)
                control.waitMicros(4)
                pins.digitalWritePin(trig, 1)
                control.waitMicros(10)
                pins.digitalWritePin(trig, 0)

                // read pulse
                const d = pins.pulseIn(
                    echo,
                    PulseValue.High,
                    maxCmDistance * TO_CM
                )
                return Math.idiv(d, TO_CM)
            }
        }

        private ultrasonicDistance() {
            let retry = 3
            while (retry-- > 0) {
                const dist = this.ultrasonicDistanceOnce()
                if (dist > this.robot.ultrasonicMinReading) {
                    this.currentUltrasonicDistance = dist
                    break
                } else basic.pause(1)
            }
            return this.currentUltrasonicDistance
        }

        private readLineState() {
            if (this.lineDetectors) {
                const left =
                    pins.digitalReadPin(this.lineDetectors.left) > 0 ===
                    this.lineDetectors.lineHigh
                        ? 1
                        : 0
                const right =
                    pins.digitalReadPin(this.lineDetectors.right) > 0 ===
                    this.lineDetectors.lineHigh
                        ? 1
                        : 0
                return (left << 0) | (right << 1)
            } else return this.robot.lineState()
        }

        private lineState(): RobotLineState {
            const ls = this.readLineState()
            if (ls !== this.currentLineState) {
                const prev = this.currentLineState
                this.currentLineState = ls
                this.currentLineStateCounter = 0

                let msg: microcode.robots.RobotCompactCommand
                if (
                    this.currentLineState === RobotLineState.None &&
                    prev === RobotLineState.Left
                )
                    msg = microcode.robots.RobotCompactCommand.LineLostLeft
                else if (
                    this.currentLineState === RobotLineState.None &&
                    prev === RobotLineState.Right
                )
                    msg = microcode.robots.RobotCompactCommand.LineLostRight
                else
                    msg =
                        microcode.robots.RobotCompactCommand.LineState |
                        this.currentLineState

                this.sendCompactCommand(msg)
                microcode.robots.raiseEvent(msg)
            }
            this.currentLineStateCounter++
            return ls
        }

        private playTone(frequency: number, duration: number) {
            if (this.robot.musicVolume <= 0) return
            music.setVolume(this.robot.musicVolume)
            this.stopToneMillis = control.millis() + duration
            pins.analogPitch(frequency, 0)
        }

        private updateTone() {
            if (this.stopToneMillis && this.stopToneMillis < control.millis()) {
                pins.analogPitch(0, 0)
                this.stopToneMillis = 0
            }
        }

        private previousGroup() {
            this.setRadioGroup(
                this.radioGroup === 1 ? MAX_GROUPS - 1 : this.radioGroup - 1
            )
        }

        private nextGroup() {
            this.setRadioGroup(
                this.radioGroup === MAX_GROUPS - 1 ? 1 : this.radioGroup + 1
            )
        }

        setRunDrift(runDrift: number) {
            if (!isNaN(runDrift)) {
                this.runDrift = runDrift >> 0
                __writeCalibration(this.radioGroup, this.runDrift)
                led.stopAnimation()
            }
        }

        /**
         * Sets the radio group used to transfer messages. Also starts the radio
         * if needed
         */
        setRadioGroup(newGroup: number) {
            newGroup = newGroup >> 0
            if (newGroup === 0) return // not allowed

            this.start()
            if (newGroup < 0) newGroup += MAX_GROUPS
            this.radioGroup = newGroup % MAX_GROUPS
            radio.setGroup(this.radioGroup)
            __writeCalibration(this.radioGroup, this.runDrift)
            led.stopAnimation()
            this.startRadio()
        }

        private sendCompactCommand(cmd: microcode.robots.RobotCompactCommand) {
            if (this.inRadioMessageId !== undefined) {
                radio.sendNumber(cmd)
                nativeSendNumber(cmd)
            }
        }

        public decodeRobotCompactCommand(msg: number) {
            switch (msg) {
                case microcode.robots.RobotCompactCommand.MotorStop:
                case microcode.robots.RobotCompactCommand.MotorTurnLeft:
                case microcode.robots.RobotCompactCommand.MotorTurnRight:
                case microcode.robots.RobotCompactCommand.MotorSpinLeft:
                case microcode.robots.RobotCompactCommand.MotorSpinRight:
                case microcode.robots.RobotCompactCommand.MotorRunForwardFast:
                case microcode.robots.RobotCompactCommand.MotorRunForward:
                case microcode.robots.RobotCompactCommand.MotorRunBackward: {
                    this.inRadioMessageId++
                    const command = this.robot.commands[msg] || {}
                    const turnRatio = command.turnRatio || 0
                    const speed = command.speed || 0
                    this.motorRun(turnRatio, speed)
                    this.playTone(440, 40)
                    break
                }
                case microcode.robots.RobotCompactCommand.MotorLEDRed:
                    this.setColor(0xff0000)
                    break
                case microcode.robots.RobotCompactCommand.MotorLEDGreen:
                    this.setColor(0x00ff00)
                    break
                case microcode.robots.RobotCompactCommand.MotorLEDBlue:
                    this.setColor(0x0000ff)
                    break
            }
        }
    }
}
