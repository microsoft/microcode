namespace microcode.robots {

    export interface RobotLEDs {
        pin: DigitalPin; count: number;
    }

    export interface Sonar {
        echo: DigitalPin
        trig: DigitalPin
    }

    export interface LineDetectors {
        left: DigitalPin
        right: DigitalPin
        lineHigh: boolean
    }

    export class Robot {
        musicVolume = 64
        maxLineSpeed = 40
        runStopThreshold = 2
        targetSpeedThreshold = 4
        speedTransitionAlpha = 0.97
        speedBrakeTransitionAlpha = 0.8
        targetTurnRatioThreshold = 20
        turnRatioTransitionAlpha = 0.2
        ultrasonicMinReading = 1
        lineAssistLostThreshold = 72
        leds?: RobotLEDs
        sonar?: Sonar
        lineDetectors?: LineDetectors

        /**
         * A map from microcode command to speed, turnratio values
         */
        readonly commands: { [index: number]: { speed?: number; turnRatio?: number } } = {}

        constructor() {
            this.commands[microcode.robots.RobotCompactCommand.MotorRunForward] = {
                speed: 70
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorRunForwardFast] = {
                speed: 100
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorRunBackward] = {
                speed: -60
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorTurnLeft] = {
                turnRatio: -50,
                speed: 70,
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorTurnRight] = {
                turnRatio: 50,
                speed: 70
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorSpinLeft] = {
                turnRatio: -200,
                speed: 60
            }
            this.commands[microcode.robots.RobotCompactCommand.MotorSpinRight] = {
                turnRatio: 200,
                speed: 60
            }
        }

        /*
        Makes the robot move at % `speed` ([-100, 100]). Negative goes backgward, 0 stops.
        */
        motorRun(left: number, right: number): void {

        }

        /**
         * Optional: Open robotic arm if present, in %
         */
        armOpen(aperture: number) {

        }

        /**
         * Optional: sets the color on the LED array as a 24bit RGB color
         */
        headlightsSetColor(red: number, green: number, blue: number): void {

        }

        /**
         * Optional: reads the sonar, in cm.
         * @returns distance in cm; negative number if unsupported
         */
        ultrasonicDistance(): number {
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