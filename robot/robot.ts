namespace microcode.robots {

    export class Robot {
        musicVolume = 64
        maxLineRunSpeed = 40
        maxLineTurnSpeed = 50

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