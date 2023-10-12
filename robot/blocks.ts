namespace microcode {
    export let robotDriver: RobotDriver;

    function checkRobotDriver() {
        if (!robotDriver)
            throw "Add 'robot start' block"
    }

    /**
     * Sets both motors of the robot to the speed in percent.
    */
    //% block="robot run at %speed=speedPicker \\%"
    //% blockid="microcoderobotmotorrun"
    //% group="Motors"
    //% weight=100
    //% speed.defl=100
    //% speed.min=-100
    //% speed.max=100
    export function motorRun(speed: number) {
        checkRobotDriver()
        robotDriver.motorRun(speed)
    }

    /**
     * Turns the robot.
    */
    //% weight=98
    //% group="Motors"
    //% block="robot turn $turnRatio at $speed \\%"
    //% blockid="microcoderobotmotorturn"
    //% speed.defl=100
    //% speed.min=-100
    //% speed.max=100
    //% speed.shadow=speedPicker
    //% turnRatio.shadow=turnRatioPicker
    //% turnRatio.min=-200
    //% turnRatio.max=200
    //% turnRatio.defl=100
    export function motorTurn(turnRatio: number, speed: number) {
        checkRobotDriver()
        robotDriver.motorTurn(turnRatio, speed)
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
        robotDriver.motorStop()
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
        robotDriver.runDrift = Math.clamp(-10, 10, drift)
    }
}