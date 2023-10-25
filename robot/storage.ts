namespace microcode {
    //% shim=microcode::__writeCalibration
    export function __writeCalibration(data: Buffer): void {}

    //% shim=microcode::__readCalibration
    export function __readCalibration(): Buffer {
        // read run drift
        return undefined
    }
}
