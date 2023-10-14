namespace microcode {
    export let robot: RobotDriver;

    function checkRobotDriver() {
        if (!robot)
            throw "Add 'robot start' block"
    }

    /**
     * Turns the robot.
    */
    //% weight=98
    //% group="Motors"
    //% block="robot run with turn $turnRatio at speed $speed \\%"
    //% blockid="microcoderobotmotorturn"
    //% speed.defl=100
    //% speed.min=-100
    //% speed.max=100
    //% speed.shadow=speedPicker
    //% turnRatio.shadow=turnRatioPicker
    //% turnRatio.min=-200
    //% turnRatio.max=200
    export function motorRun(turnRatio: number, speed: number) {
        checkRobotDriver()
        robot.motorRun(turnRatio, speed)
    }

    /**
     * Stops the robot.
    */
    //% weight=50
    //% group="Motors"
    //% block="robot stop"
    //% blockid="microcoderobotmotorstop"
    export function motorStop() {
        checkRobotDriver()
        robot.motorStop()
    }

    /**
    * A value that corrects the ratio of power between the left and the right motor to account for hardware differences.
    */
    //% block="robot set motor drift to %drift"
    //% blockId="microcoderobotsetmotordrift"
    //% group="Motors"
    //% weight=10
    //% drift.min=-10
    //% drift.max=20
    export function setMotorDrift(drift: number) {
        checkRobotDriver()
        robot.runDrift = Math.clamp(-10, 10, drift)
    }

    /**
     * Checks the state of lines
     */
    //% block="robot detect lines $state"
    //% blockId=microcoderobotdetectlines
    //% group="Sensors"
    export function detectLines(state: RobotLineState): boolean {
        checkRobotDriver()
        return robot.lineState() === state
    }
}