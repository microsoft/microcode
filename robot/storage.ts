namespace microcode {
    //% shim=microcode::__writeCalibration
    export function __writeCalibration(runDrift: number): void {
        console.log("run drift: " + runDrift)
    }

    //% shim=microcode::__readCalibration
    export function __readCalibration(): number {
        // read run drift
        return 0
    }
}
