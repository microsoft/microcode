namespace microcode {
    export interface Robot {
        /*
        Set the power on motors
        */
        motorRun(left: number, right: number): void;
        /**
         * Stop and brake
         */
        motorStop(): void;
    }

    export let robot: Robot

}