namespace microcode {
    export class Robot {
        constructor() {

        }

        /*
        Makes the robot move at % `speed` ([-100, 100]). Negative goes backgward, 0 stops.
        */
        motorRun(speed: number): void {

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
    }

    export let robot: Robot

}