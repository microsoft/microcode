namespace microcode {
    const MAX_GROUPS = 25
    const SCROLL_SPEED = 50

    function radioGroupFromDeviceSerialNumber() {
        const sn = control.deviceLongSerialNumber()
        return (sn.hash(10) % 9) + 1
    }

    //% shim=TD_NOOP
    function nativeSendNumber(msg: number) {
        radio.sendNumber(msg)
    }

    function lerpChannel(c: number, tc: number) {
        const FACTOR = 0.8
        return Math.abs(c - tc) < 16
            ? tc
            : Math.round(c * FACTOR + tc * (1 - FACTOR)) & 0xff
    }

    /**
     * A driver for a generic robot interface
     */
    //% fixedInstances
    export class RobotDriver {
        /**
         * The robot instance
         */
        readonly robot: robots.Robot
        /**
         * Gets the latest distance returned by the sensor
         */
        private readonly sonarDistanceFilter = new KalmanFilter1D()
        private lastSonarValue = 0

        private showConfiguration: number = 0
        private configDrift: boolean = undefined
        private targetColor = 0
        private currentColor = 0
        private currentArmAperture: number = undefined
        private currentSpeed: number = 0
        private targetSpeed: number = 0
        private currentTurnRatio = 0
        private targetTurnRatio: number = 0
        radioGroup: number
        useRadio: boolean = false

        /**
         * Gets the latest line sensor state
         */
        currentLineState: RobotLineState = RobotLineState.None
        private lineLostCounter: number

        private stopToneMillis: number = 0
        lineAssist = true
        private runDrift = 0

        private leds: robots.LEDStrip

        private sonar: robots.Sonar
        private lineDetectors: robots.LineDetectors
        private arm: robots.Arm

        /**
         * Maximum distance in cm for the ultrasonic sensor
         */
        maxCmDistance = 40

        constructor(robot: robots.Robot) {
            this.robot = robot
        }

        get currentUltrasonicDistance() {
            return Math.round(this.sonarDistanceFilter.x)
        }

        private configureButtons() {
            input.onButtonPressed(Button.A, () =>
                control.inBackground(() => {
                    if (this.configDrift !== undefined) {
                        this.playTone(440, 500)
                        if (this.configDrift)
                            this.setRunDrift(this.runDrift - 1)
                        else this.previousGroup()
                    }
                    this.showConfigurationState()
                })
            )
            input.onButtonPressed(Button.B, () =>
                control.inBackground(() => {
                    if (this.configDrift !== undefined) {
                        this.playTone(640, 500)
                        if (this.configDrift)
                            this.setRunDrift(this.runDrift + 1)
                        else this.nextGroup()
                    }
                    this.showConfigurationState()
                })
            )
            input.onButtonPressed(Button.AB, () =>
                control.inBackground(() => {
                    this.playTone(840, 500)
                    this.configDrift = !this.configDrift
                    this.showConfigurationState(true)
                })
            )
        }

        private showConfigurationState(showTitle?: boolean) {
            this.showConfiguration++
            try {
                led.stopAnimation()
                if (this.configDrift === undefined) {
                    basic.showString(
                        `RADIO ${this.radioGroup} DRIFT ${this.runDrift}`,
                        SCROLL_SPEED
                    )
                } else {
                    const title = this.configDrift ? "DRIFT" : "RADIO"
                    const value = this.configDrift
                        ? this.runDrift
                        : this.radioGroup
                    basic.showString(title + " " + value, SCROLL_SPEED)
                }
            } finally {
                this.showConfiguration--
            }
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
            this.lineLostCounter = this.robot.lineLostThreshold + 1
            this.leds = this.robot.leds
            if (this.leds) this.leds.start()
            this.lineDetectors = this.robot.lineDetectors
            if (this.lineDetectors) this.lineDetectors.start()
            this.sonar = this.robot.sonar
            if (this.sonar) this.sonar.start()
            this.arm = this.robot.arm
            if (this.arm) this.arm.start()

            // stop motors
            this.setColor(0x0000ff)
            this.motorRun(0, 0)
            // wake up sensors
            this.ultrasonicDistance()
            this.lineState()

            this.configureButtons()
            basic.forever(() => this.updateSonar()) // potentially slower
            control.inBackground(() => this.backgroundWork())

            // notify the robot
            this.robot.onStarted(this)
        }

        private backgroundWork() {
            while (true) {
                this.updateTone()
                this.updateLineState()
                this.updateColor()
                this.updateSpeed()
                this.updateArm()
                basic.pause(5)
            }
        }

        public setColor(rgb: number) {
            this.targetColor = rgb
        }

        private updateColor() {
            if (this.targetColor === this.currentColor) return

            let red = (this.currentColor >> 16) & 0xff
            let green = (this.currentColor >> 8) & 0xff
            let blue = (this.currentColor >> 0) & 0xff

            const tred = (this.targetColor >> 16) & 0xff
            const tgreen = (this.targetColor >> 8) & 0xff
            const tblue = (this.targetColor >> 0) & 0xff

            red = lerpChannel(red, tred)
            green = lerpChannel(green, tgreen)
            blue = lerpChannel(blue, tblue)

            this.currentColor = (red << 16) | (green << 8) | blue
            this.robot.headlightsSetColor(red, green, blue)
            if (this.leds) this.leds.setColor(red, green, blue)
        }

        private updateArm() {
            if (isNaN(this.currentArmAperture) || this.currentArmAperture < 0)
                return
            const arm = this.robot.arm
            if (arm) arm.open(this.currentArmAperture)
            else this.robot.armOpen(this.currentArmAperture)
            this.currentArmAperture = undefined
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

                // apply line assist
                if (
                    this.lineAssist &&
                    this.lineLostCounter < this.robot.lineLostThreshold
                ) {
                    // recently lost line
                    this.currentSpeed = Math.min(
                        this.currentSpeed,
                        this.robot.maxLineSpeed
                    )
                }
                // accelerate convergence to target speed
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
            for (let i = 0; i < 5; ++i) {
                if (left) led.plot(4, i)
                else led.unplot(4, i)
                if (right) led.plot(0, i)
                else led.unplot(0, i)
            }
        }

        private updateSonar() {
            const dist = this.ultrasonicDistance()
            const d = Math.clamp(1, 5, Math.ceil(dist / 5))
            if (d !== this.lastSonarValue) {
                const prevd = this.lastSonarValue
                this.lastSonarValue = d

                // emit all intermediate events
                const sd = Math.sign(d - prevd)
                const n = Math.abs(d - prevd)
                let di = prevd
                for (let i = 0; i < n; ++i) {
                    di = di + sd
                    const msg =
                        microcode.robots.RobotCompactCommand.ObstacleState | di
                    this.sendCompactCommand(msg)
                }
                microcode.robots.raiseEvent(
                    microcode.robots.RobotCompactCommand.ObstacleState
                )
            }

            if (!this.showConfiguration && this.lastSonarValue !== undefined) {
                const d = this.lastSonarValue
                for (let y = 0; y < 5; y++)
                    if (5 - y <= d) led.plot(2, y)
                    else led.unplot(2, y)
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
            if (this.sonar) return this.sonar.distance(this.maxCmDistance)
            else return this.robot.ultrasonicDistance(this.maxCmDistance)
        }

        private ultrasonicDistance() {
            const dist = this.ultrasonicDistanceOnce()
            if (dist > this.robot.sonarMinReading)
                this.sonarDistanceFilter.filter(dist)
            const filtered = this.sonarDistanceFilter.x
            return filtered
        }

        private readLineState() {
            if (this.lineDetectors) return this.lineDetectors.lineState()
            else return this.robot.lineState()
        }

        private lineState(): RobotLineState {
            const ls = this.readLineState()
            const leftOrRight =
                ls === RobotLineState.Left || ls === RobotLineState.Right
            if (ls !== this.currentLineState) {
                const prev = this.currentLineState
                this.currentLineState = ls
                if (leftOrRight) this.lineLostCounter = 0

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
            if (!leftOrRight) this.lineLostCounter++
            return ls
        }

        playTone(frequency: number, duration: number) {
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
         * Sets the radio group used to transfer messages.
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
        }

        private sendCompactCommand(cmd: microcode.robots.RobotCompactCommand) {
            if (this.useRadio) {
                radio.sendNumber(cmd)
                nativeSendNumber(cmd)
            }
        }
    }
}
