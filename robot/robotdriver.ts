/**
 * Microcode Robot
 */
//% color="#ff6800" icon="\uf1b9" weight=15
namespace microcode {
    const ROBOT_TIMEOUT = 1000
    const SHOW_RADIO_COUNT = 20

    const RUN_STOP_THRESHOLD = 8
    const TURN_STOP_THRESHOLD = 8
    const MODE_SWITCH_THRESHOLD = 2
    const TARGET_SPEED_THRESHOLD = 8
    const MODE_TRANSITION_ALPHA = 0.6
    const SPEED_TRANSITION_ALPHA = 0.9
    const ULTRASONIC_MIN_READING = 1
    const LINE_TURN_ALPHA = 0.7

    enum RobotSpeedMode {
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
        private currentUltrasonicDistance: number = 100
        private showRadio: number
        private currentSpeed: number = 0
        private currentSpeedMode = RobotSpeedMode.Run
        private targetSpeed: number = 0
        private targetSpeedMode = RobotSpeedMode.Run

        debug = true
        safe = false
        runDrift = 0
        lineDrift = 10

        private log(name: string, value: number) {
            serial.writeValue(name, value)
        }

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
            basic.forever(() => this.showLineState())
            basic.forever(() => this.showSonar())
            control.inBackground(() => this.backgroundWork())
        }

        private backgroundWork() {
            while (this.running) {
                this.checkAlive()
                if (this.showRadio > 0) {
                    this.showRadio--
                    microcode.robots.showRadioStatus()
                }
                this.updateSpeed()
                basic.pause(5)
            }
        }

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
            if (this.currentSpeedMode !== this.targetSpeedMode) {
                const alpha = MODE_TRANSITION_ALPHA
                this.currentSpeed = this.currentSpeed * alpha
                if (Math.abs(this.currentSpeed) < MODE_SWITCH_THRESHOLD) {
                    this.currentSpeed = 0
                    this.currentSpeedMode = this.targetSpeedMode
                }
            } else {
                const alpha = SPEED_TRANSITION_ALPHA
                this.currentSpeed =
                    this.currentSpeed * alpha + this.targetSpeed * (1 - alpha)
                if (Math.abs(this.currentSpeed - this.targetSpeed) < TARGET_SPEED_THRESHOLD)
                    this.currentSpeed = this.targetSpeed
            }

            if (this.currentSpeedMode === RobotSpeedMode.Run) {
                let s =
                    Math.abs(this.currentSpeed) < RUN_STOP_THRESHOLD
                        ? 0
                        : this.currentSpeed
                let d = Math.abs(s) > Math.abs(this.runDrift) ? this.runDrift / 2 : 0
                if (s > 0) {
                    const lines = this.lineState()
                    if (lines) {
                        s = Math.min(s, this.robot.maxLineTrackingSpeed)
                        this.currentSpeed = Math.min(this.currentSpeed, s)
                        if (lines === RobotLineState.Left) d += s * LINE_TURN_ALPHA
                        else if (lines === RobotLineState.Right)
                            d -= s * LINE_TURN_ALPHA
                    }
                }
                const left = s - d
                const right = s + d
                this.log(`motor left`, left)
                this.log(`motor right`, right)
                this.robot.motorRun(left, right)
                this.showMotorState(left, right)
            } else {
                let s =
                    Math.abs(this.currentSpeed) < TURN_STOP_THRESHOLD
                        ? 0
                        : this.currentSpeed
                this.log(`motor turn`, s)
                this.robot.motorTurn(s)
                this.showMotorState(
                    s > 0 ? s : 0,
                    s <= 0 ? 0 : -s
                )
            }
        }

        private showMotorState(left: number, right: number) {
            if (this.showRadio > 0) return
            this.showSingleMotorState(3, left)
            this.showSingleMotorState(1, right)
        }

        private showSingleMotorState(x: number, speed: number) {
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

        private showLineState() {
            if (this.showRadio > 0) return

            const lineState = this.lineState()
            // render left/right lines
            const left =
                (lineState & RobotLineState.Left) === RobotLineState.Left
            this.log(`line left`, left ? 1 : 0)
            const right =
                (lineState & RobotLineState.Right) === RobotLineState.Right
            this.log(`line right`, right ? 1 : 0)
            for (let i = 0; i < 5; ++i) {
                if (left) led.plot(4, i)
                else led.unplot(4, i)
                if (right) led.plot(0, i)
                else led.unplot(0, i)
            }
        }

        private showSonar() {
            if (this.showRadio > 0) return

            const dist = this.ultrasonicDistance()
            this.log(`sonar dist`, dist)
            // render sonar
            if (dist > ULTRASONIC_MIN_READING) {
                for (let y = 0; y < 5; y++)
                    if (dist > 0 && dist < 5 + y * 5) led.plot(2, y)
                    else led.unplot(2, y)

                const d = Math.min(1, Math.max(5, Math.round(dist / 5)))
                const msg = microcode.robots.RobotCompactCommand.Obstacle0 | d
                microcode.robots.sendCompactCommand(msg)
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
            speed =
                speed > 0
                    ? Math.min(this.robot.maxRunSpeed, speed)
                    : Math.max(-this.robot.maxBackSpeed, speed)
            this.setHeadlingSpeedColor(speed)
            this.targetSpeedMode = RobotSpeedMode.Run
            this.targetSpeed = speed
        }

        motorTurn(speed: number) {
            this.start()
            this.keepAlive()
            speed =
                speed > 0
                    ? Math.min(this.robot.maxTurnSpeed, speed)
                    : Math.max(-this.robot.maxTurnSpeed, speed)
            this.setHeadlingSpeedColor(speed)
            this.targetSpeedMode = RobotSpeedMode.Turn
            this.targetSpeed = speed
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
            return this.robot.lineState()
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

        playMelody(melody: Melodies) {
            if (this.robot.musicVolume <= 0) return
            music.setVolume(this.robot.musicVolume)
            music.play(
                music.builtInPlayableMelody(melody),
                music.PlaybackMode.InBackground
            )
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
                    const speed = Math.clamp(
                        -100,
                        100,
                        payload.getNumber(NumberFormat.Int16LE, 0)
                    )
                    this.motorRun(speed)
                    break
                }
                case robots.RobotCommand.MotorTurn: {
                    const speed = Math.clamp(
                        -100,
                        100,
                        payload.getNumber(NumberFormat.Int16LE, 0)
                    )
                    this.motorTurn(speed)
                    break
                }
            }
        }
    }
}
