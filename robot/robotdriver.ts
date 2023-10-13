/**
 * Microcode Robot
 */
//% color="#ff6800" icon="\uf1b9" weight=15
namespace microcode {
    const ROBOT_TIMEOUT = 1000
    const SHOW_CONFIG_COUNT = 6

    const RUN_STOP_THRESHOLD = 2
    const MODE_SWITCH_THRESHOLD = 2
    const TARGET_SPEED_THRESHOLD = 4
    const MODE_TRANSITION_ALPHA = 0.2
    const SPEED_TRANSITION_ALPHA = 0.915
    const ULTRASONIC_MIN_READING = 1
    const LINE_TURN_ALPHA = 0.7

    enum RobotMotorMode {
        Run,
        Turn,
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
        currentUltrasonicDistance: number = 100
        private showConfiguration: boolean = false
        private configDrift = false
        private currentSpeed: number = 0
        private currentMotorMode = RobotMotorMode.Run
        private targetSpeed: number = 0
        turnRatio = 0
        private targetMotorMode = RobotMotorMode.Run
        currentLineState: RobotLineState = RobotLineState.None

        private stopToneMillis: number = 0
        lineAssist = false

        debug = true
        safe = false
        runDrift = 0
        lineDrift = 10

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
                this.checkAlive()
                this.updateTone()
                this.updateLineState()
                this.updateSpeed()
                basic.pause(5)
            }
        }

        private inRadioMessageId = 0

        private startRadioReceiver() {
            // handle radio package messages
            //radio.onReceivedBuffer(buf => {
            //    const msg = robots.decodeRobotCommand(buf)
            //    this.dispatch(msg)
            //})
            radio.onReceivedNumber(code => {
                const msg = robots.decodeRobotCompactCommand(code)
                this.dispatch(msg)
            })
        }

        private updateSpeed() {
            // transition from one mode to the other, robot should stop
            if (this.currentMotorMode !== this.targetMotorMode) {
                const alpha = MODE_TRANSITION_ALPHA
                this.currentSpeed = this.currentSpeed * alpha
                if (Math.abs(this.currentSpeed) < MODE_SWITCH_THRESHOLD) {
                    this.currentSpeed = 0
                    this.currentMotorMode = this.targetMotorMode
                }
            } else {
                const alpha = SPEED_TRANSITION_ALPHA
                this.currentSpeed =
                    this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (Math.abs(this.currentSpeed - this.targetSpeed) < TARGET_SPEED_THRESHOLD) {
                    this.currentSpeed = this.targetSpeed
                }
            }

            const lines = this.currentLineState
            if (this.currentMotorMode === RobotMotorMode.Run || this.turnRatio === 0) {
                let s =
                    Math.abs(this.currentSpeed) < RUN_STOP_THRESHOLD
                        ? 0
                        : this.currentSpeed
                const d = Math.abs(s) > Math.abs(this.runDrift) ? this.runDrift / 2 : 0
                let left = s - d
                let right = s + d
                if (lines && s > 0) { // going forward
                    this.currentSpeed = s = Math.min(s, this.robot.maxLineRunSpeed)
                    if (this.lineAssist) {
                        if (lines === RobotLineState.Left) {
                            left = 0
                            right = s
                        }
                        else if (lines === RobotLineState.Right) {
                            right = 0
                            left = s
                        }
                    }
                }
                this.setMotorState(left, right)
            } else {
                console.log(`turnratio: ${this.turnRatio}`)
                let s = this.currentSpeed
                if (lines)
                    s = Math.sign(s) * Math.min(Math.abs(s), this.robot.maxLineTurnSpeed)
                const ns = Math.abs(s)

                let left: number
                let right: number
                // apply turn ratio
                if (this.turnRatio < 0) {
                    right = s
                    left = s * (1 + (this.turnRatio / 100))
                } else {
                    left = s
                    right = s * (1 - (this.turnRatio / 100))
                }

                // clamp
                left = Math.clamp(-ns, ns, Math.round(left))
                right = Math.clamp(-ns, ns, Math.round(right))
                console.log(`l: ${left}`)

                this.setMotorState(left, right)
            }
        }

        private setMotorState(left: number, right: number) {
            this.robot.motorRun(left, right)
            if (this.showConfiguration) return
            console.log(`left: ${left}`)
            console.log(`right: ${right}`)
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

        keepAlive() {
            this.lastCommandTime = control.millis()
        }

        private setHeadlingSpeedColor(speed: number) {
            if (speed === 0) this.robot.headlightsSetColor(0, 0, 0)
            else if (speed > 0) this.robot.headlightsSetColor(0, 0, 0xf0)
            else this.robot.headlightsSetColor(0xf0, 0, 0)
        }

        motorRun(speed: number) {
            this.start()
            this.keepAlive()
            speed =
                speed > 0
                    ? Math.min(this.robot.maxRunSpeed, speed)
                    : Math.max(-this.robot.maxBackSpeed, speed)
            if (this.targetMotorMode !== RobotMotorMode.Run || this.targetSpeed !== speed) {
                this.setHeadlingSpeedColor(speed)
                this.targetMotorMode = RobotMotorMode.Run
                this.targetSpeed = speed
            }
        }

        motorTurn(turnRatio: number, speed: number) {
            this.start()
            this.keepAlive()
            turnRatio = Math.clamp(-200, 200, turnRatio)
            if (turnRatio === 0) { // special case
                this.motorRun(speed)
                return
            }

            speed =
                speed > 0
                    ? Math.min(this.robot.maxTurnSpeed, speed)
                    : Math.max(-this.robot.maxTurnSpeed, speed)
            const newMode = this.targetMotorMode !== RobotMotorMode.Turn
            if (newMode || this.targetSpeed !== speed || this.turnRatio !== turnRatio) {
                this.setHeadlingSpeedColor(speed)
                this.targetMotorMode = RobotMotorMode.Turn
                this.targetSpeed = speed
                this.turnRatio = turnRatio
                if (newMode)
                    this.currentSpeed = 0
            }
        }

        motorStop() {
            this.motorRun(0)
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
            this.keepAlive()
            this.robot.headlightsSetColor(red, green, blue)
        }

        checkAlive() {
            if (!this.safe) return
            if (control.millis() - this.lastCommandTime > ROBOT_TIMEOUT)
                this.stop()
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
                this.keepAlive()
                return // duplicate
            }

            // decode message
            this.lastReceivedMessageId = messageId
            const cmd = msg.cmd
            const payload = msg.payload

            switch (cmd) {
                case robots.RobotCommand.MotorRun: {
                    const speed = Math.clamp(
                        -100,
                        100,
                        payload.getNumber(NumberFormat.Int16LE, 0)
                    )
                    this.motorRun(speed)
                    this.inRadioMessageId++
                    this.playTone(440, 50)
                    break
                }
                case robots.RobotCommand.MotorTurn: {
                    const turnRatio = Math.clamp(
                        -200,
                        200,
                        payload.getNumber(NumberFormat.Int16LE, 0)
                    )
                    const speed = Math.clamp(-100, 100, payload.getNumber(NumberFormat.Int16LE, 2))
                    this.motorTurn(turnRatio, speed)
                    this.inRadioMessageId++
                    this.playTone(932, 50)
                    break
                }
            }
        }
    }
}
