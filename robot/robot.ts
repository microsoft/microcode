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

    // handle radio package messages
    radio.onReceivedBuffer(msg => {
        const magic = msg.getNumber(NumberFormat.UInt16LE, 0)
        if (magic !== MESSAGE_MAGIC) return; // ignore
        const cmd = msg.getNumber(NumberFormat.UInt16LE, 2)
        switch (cmd) {
            case RobotCommand.MotorRun: {
                const left = msg.getNumber(NumberFormat.Int8LE, 4)
                const right = msg.getNumber(NumberFormat.Int8LE, 5)
                console.log(`motor run ${left} ${right}`)
                robot.motorRun(left, right)
                break
            }
            case RobotCommand.MotorStop: {
                console.log(`motor stop`)
                robot.motorStop()
                break
            }
        }
    })
}