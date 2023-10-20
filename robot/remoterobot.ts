namespace microcode {
    class RemoteRobot extends robots.Robot {
        constructor() {
            super()
        }

        onStarted(driver: RobotDriver) {
            // radio is needed
            driver.startRadioController()
        }

        motorRun(left: number, right: number): void {
            const msg = control.createBuffer(8)
            msg.setNumber(NumberFormat.Int16LE, 0, robots.MAGIC)
            msg.setNumber(
                NumberFormat.Int16LE,
                2,
                robots.RobotCompactCommand.MotorRunForward
            )
            msg.setNumber(NumberFormat.Int16LE, 4, left)
            msg.setNumber(NumberFormat.Int16LE, 6, right)
            radio.sendBuffer(msg)
        }
    }

    /**
     * Remote controller for a microcode robot. The micro:bit will send and receive radio
     * message to another micro:bit running the robot.
     */
    //% fixedInstance whenUsed block="remote controller" weight=1
    export const remoteController = new RobotDriver(new RemoteRobot())
}
