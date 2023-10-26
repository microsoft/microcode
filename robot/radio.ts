namespace microcode {
    function decodeRobotCompactCommand(driver: RobotDriver, msg: number) {
        if (
            msg >= microcode.robots.RobotCompactCommand.Command &&
            msg <= microcode.robots.RobotCompactCommand.CommandLast
        ) {
            driver.playTone(440, 40)
        }
        switch (msg) {
            case microcode.robots.RobotCompactCommand.MotorStop:
            case microcode.robots.RobotCompactCommand.MotorTurnLeft:
            case microcode.robots.RobotCompactCommand.MotorTurnRight:
            case microcode.robots.RobotCompactCommand.MotorSpinLeft:
            case microcode.robots.RobotCompactCommand.MotorSpinRight:
            case microcode.robots.RobotCompactCommand.MotorRunForwardFast:
            case microcode.robots.RobotCompactCommand.MotorRunForward:
            case microcode.robots.RobotCompactCommand.MotorRunBackward: {
                const command = driver.robot.commands[msg] || {}
                const turnRatio = command.turnRatio || 0
                const speed = command.speed || 0
                driver.lineAssist =
                    msg !==
                    microcode.robots.RobotCompactCommand.MotorRunForwardFast
                driver.motorRun(turnRatio, speed)
                break
            }
            case microcode.robots.RobotCompactCommand.LEDRed:
                driver.setColor(0xff0000)
                break
            case microcode.robots.RobotCompactCommand.LEDGreen:
                driver.setColor(0x00ff00)
                break
            case microcode.robots.RobotCompactCommand.LEDBlue:
                driver.setColor(0x0000ff)
                break
            case microcode.robots.RobotCompactCommand.LEDOff:
                driver.setColor(0x00000)
                break
            case microcode.robots.RobotCompactCommand.ArmOpen:
                driver.armOpen(100)
                break
            case microcode.robots.RobotCompactCommand.ArmClose:
                driver.armOpen(0)
                break
        }
    }

    /**
     * Starts the reception and transmission of robot command messages
     */
    export function startCompactRadio() {
        const driver = microcode.robot
        radio.setGroup(driver.radioGroup)
        radio.setTransmitSerialNumber(true)
        radio.onReceivedNumber(code => decodeRobotCompactCommand(driver, code))
    }
}
