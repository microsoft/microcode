namespace microcode {
    export interface Robot {
        /*
        Set the power on motors where `speed` is a [-100, 100]
        */
        motorRun(speed: number): void;


        /**
         * Optional: sets the color on the LED array as a 24bit RGB color
         */
        ledSetColor(red: number, green: number, blue: number): void;
    }

    export let robot: Robot

}