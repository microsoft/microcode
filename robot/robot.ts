namespace microcode {
    export interface Robot {
        /*
        Set the power on motors where `speed` is a [-100, 100]
        */
        motorRun(speed: number): void;
    }

    export let robot: Robot

}