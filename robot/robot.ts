namespace microcode.robots {
    /**
     * A ws2812b LED strip
     */
    export interface RobotLEDs {
        /**
         * LED data pin
         */
        pin: DigitalPin
        /**
         * Number of  LEDs
         */
        count: number
    }

    export interface Sonar {
        /**
         * Echo pin
         */
        echo: DigitalPin
        /**
         * Trigger pin
         */
        trig: DigitalPin
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

    export interface ServoArm {
        /**
         * 0 angle
         */
        minAngle: number
        /**
         * 100% angle
         */
        maxAngle: number
        /**
         * Driving pin
         */
        pin: AnalogPin
        /**
         * Set the pulse width to the servo in microseconds
         */
        pulseUs?: number
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
        leds?: RobotLEDs
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
