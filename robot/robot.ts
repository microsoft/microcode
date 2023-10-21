namespace microcode.robots {
    export interface RobotLEDs {
        pin: DigitalPin
        count: number
    }

    export interface Sonar {
        echo: DigitalPin
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
        left: DigitalPin
        right: DigitalPin
        lineHigh: boolean
    }

    export class Robot {
        /**
         * Default volume used by the robot;
         */
        musicVolume = 64
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
        ultrasonicMinReading = 1
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
