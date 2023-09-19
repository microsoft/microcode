namespace microcode {
    export interface Robot {
        /*
        Set the power on motors where `left` and `right` are in [-255,255]
        Set left and right to 0 to stop.
        */
        motorRun(left: number, right: number): void;
    }

    export let robot: Robot

}