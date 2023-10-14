namespace microcode.robots {

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

        constructor() {

        }

        /*
        Makes the robot move at % `speed` ([-100, 100]). Negative goes backgward, 0 stops.
        */
        motorRun(left: number, right: number): void {

        }

        /**
         * Open robotic arm if present, in %
         */
        armOpen(aperture: number) {

        }

        /**
         * Optional: sets the color on the LED array as a 24bit RGB color
         */
        headlightsSetColor(red: number, green: number, blue: number): void {

        }

        /**
         * Optional: reads the sonar, in cm
         */
        ultrasonicDistance(): number {
            return undefined
        }

        lineState(): RobotLineState {
            return RobotLineState.None
        }
    }
}