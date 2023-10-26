namespace microcode.robots {
    /**
     * A ws2812b LED strip
     */
    export interface LEDStrip {
        start(): void
        setColor(red: number, green: number, blue: number): void
    }

    export class WS2812bLEDStrip implements LEDStrip {
        private ledsBuffer: Buffer

        constructor(
            public readonly pin: DigitalPin,
            public readonly count: number
        ) {}

        start() {
            this.ledsBuffer = Buffer.create(this.count * 3)
        }

        setColor(red: number, green: number, blue: number) {
            const b = this.ledsBuffer
            for (let i = 0; i + 2 < b.length; i += 3) {
                b[i] = green
                b[i + 1] = red
                b[i + 2] = blue
            }
            ws2812b.sendBuffer(this.ledsBuffer, this.pin)
        }
    }

    export interface Sonar {
        start(): void
        distance(maxCmDistance: number): number
    }

    export class SR04Sonar implements Sonar {
        /**
         * Microseconds to keep the trigger pin low. Default is 4.
         */
        pulseLowUs?: number
        /**
         * Microseconds to keep the trigger pin high. Default is 10.
         */
        pulseHighUs?: number
        /**
         * Microseconds per cm. Defaults to 58.
         */
        usPerCm?: number
        constructor(
            public readonly echo: DigitalPin,
            public readonly trig: DigitalPin
        ) {}

        start() {
            pins.setPull(this.trig, PinPullMode.PullNone)
        }

        distance(maxCmDistance: number): number {
            const trig = this.trig
            const echo = this.echo
            const lowUs = this.pulseLowUs || 4
            const highUs = this.pulseHighUs || 10
            const usToCm = this.usPerCm || 58

            // send pulse
            pins.digitalWritePin(trig, 0)
            control.waitMicros(lowUs)
            pins.digitalWritePin(trig, 1)
            control.waitMicros(highUs)
            pins.digitalWritePin(trig, 0)

            // read pulse
            const d = pins.pulseIn(
                echo,
                PulseValue.High,
                maxCmDistance * usToCm
            )
            if (d <= 0) return maxCmDistance
            return d / usToCm
        }
    }

    export interface LineDetectors {
        start(): void
        lineState(): RobotLineState
    }

    export class PinLineDetectors implements LineDetectors {
        /**
         * Left line detector
         */
        constructor(
            public readonly left: DigitalPin,
            public readonly right: DigitalPin,
            public readonly lineHigh: boolean
        ) {}

        start() {
            pins.setPull(this.left, PinPullMode.PullNone)
            pins.setPull(this.right, PinPullMode.PullNone)
        }

        lineState() {
            const left =
                pins.digitalReadPin(this.left) > 0 === this.lineHigh ? 1 : 0
            const right =
                pins.digitalReadPin(this.right) > 0 === this.lineHigh ? 1 : 0
            return (left << 0) | (right << 1)
        }
    }

    export interface Arm {
        start(): void
        open(aperture: number): void
    }

    export class ServoArm implements Arm {
        pulseUs?: number
        constructor(
            public minAngle: number,
            public maxAngle: number,
            public readonly pin: AnalogPin
        ) {}
        start() {
            if (this.pulseUs) pins.servoSetPulse(this.pin, this.pulseUs)
        }
        open(aperture: number): void {
            const angle = Math.round(
                Math.map(aperture, 0, 100, this.minAngle, this.maxAngle)
            )
            pins.servoWritePin(this.pin, angle)
        }
    }

    export class Robot {
        /**
         * Maximum speed while following a line with line assist
         */
        maxLineSpeed = 40
        /**
         * Threshold to saturate a speed to 0. Avoids small speed jitter near stop state.
         */
        stopThreshold = 2
        /**
         * Threshold to converge to the target speed, and avoid exponential convergence.
         */
        targetSpeedThreshold = 4
        /**
         * Exponential moving average factor for speed transitions, accelerating
         */
        speedTransitionAlpha = 0.97
        /**
         * Exponential moving average factor for speed transitions, braking
         */
        speedBrakeTransitionAlpha = 0.8
        /**
         * Threshold to converge the turn ratio, and avoid exponential convergence.
         */
        targetTurnRatioThreshold = 20
        /**
         * Exponential moving average factor for turn ratio transitions
         */
        turnRatioTransitionAlpha = 0.2
        /**
         * Minimum reading from ultrasonic sensor to be considered valid
         */
        sonarMinReading = 2
        /**
         * Number of iteration before the line is considered lost and line assist
         * disengages
         */
        lineLostThreshold = 72
        /**
         * LED configuration
         */
        leds?: LEDStrip
        /**
         * Distance sensor configuration, if SR04
         */
        sonar?: Sonar
        /**
         * Line detector configuration
         */
        lineDetectors?: LineDetectors
        /**
         * Robotic arm configuration
         */
        arm?: ServoArm
        /**
         * A map from microcode command to speed, turn ratio values
         */
        readonly commands: {
            [index: number]: { speed?: number; turnRatio?: number }
        } = {}

        constructor() {
            this.commands[
                microcode.robots.RobotCompactCommand.MotorRunForward
            ] = {
                speed: 70,
            }
            this.commands[
                microcode.robots.RobotCompactCommand.MotorRunForwardFast
            ] = {
                speed: 100,
            }
            this.commands[
                microcode.robots.RobotCompactCommand.MotorRunBackward
            ] = {
                speed: -60,
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorTurnLeft] =
                {
                    turnRatio: -50,
                    speed: 70,
                }
            this.commands[microcode.robots.RobotCompactCommand.MotorTurnRight] =
                {
                    turnRatio: 50,
                    speed: 70,
                }
            this.commands[microcode.robots.RobotCompactCommand.MotorSpinLeft] =
                {
                    turnRatio: -200,
                    speed: 60,
                }
            this.commands[microcode.robots.RobotCompactCommand.MotorSpinRight] =
                {
                    turnRatio: 200,
                    speed: 60,
                }
        }

        /*
        Makes the robot move at % `speed` ([-100, 100]). Negative goes backgward, 0 stops.
        */
        motorRun(left: number, right: number): void {}

        /**
         * Optional: Open robotic arm if present, in %
         */
        armOpen(aperture: number) {}

        /**
         * Optional: sets the color on the LED array as a 24bit RGB color
         */
        headlightsSetColor(red: number, green: number, blue: number): void {}

        /**
         * Optional: reads the sonar, in cm.
         * @returns distance in cm; negative number if unsupported
         */
        ultrasonicDistance(maxCmDistance: number): number {
            return -1
        }

        /**
         * Optional: Reads the line detection line
         * @returns state of both line detectors
         */
        lineState(): RobotLineState {
            return RobotLineState.None
        }
    }
}
