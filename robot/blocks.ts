namespace microcode {
    export let robotDriver: RobotDriver;

    /**
    * A value that corrects the ratio of power between the left and the right motor to account for hardware differences.
    */
    //% block="robot set motor drift to %drift"
    //% blockId="microcoderobotsetmotordrift"
    //% weight=10
    //% drift.min=-10
    //% drift.max=20
    export function setMotorDrift(drift: number) {
        if (isNaN(drift)) return
        if (!robotDriver)
            throw "You must start a robot first"
        robotDriver.runDrift = Math.clamp(-10, 10, drift)
    }
}