enum RobotLineState {
    None = 0,
    Left = 0x01,
    Right = 0x02
}

namespace microcode.robots {

    export class Robot {
        musicVolume = 64
        maxRunSpeed = 80
        maxBackSpeed = 50
        maxTurnSpeed = 60
        maxLineTrackingSpeed = 40

        constructor() {

        }

        /*
        Makes the robot move at % `speed` ([-100, 100]). Negative goes backgward, 0 stops.
        */
        motorRun(left: number, right: number): void {

        }


        /**
         * Makes the robot turn at % `speed`. Positive turns clock-wize/right, negative turns counter-clockwize/left.
         */
        motorTurn(speed: number): void {

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

    export let robot: Robot

}