namespace microcode {
    enum Motors {
        //% blockId="left motor" block="left"
        M1 = 0,
        //% blockId="right motor" block="right"
        M2 = 1,
        //% blockId="all motor" block="all"
        All = 2
    }
    enum Dir {
        //% blockId="CW" block="Forward"
        CW = 0x0,
        //% blockId="CCW" block="Backward"
        CCW = 0x1
    }

    function motorRun(index: Motors, direction: Dir, speed: number): void {
        let buf = pins.createBuffer(3);
        if (index == 0) {
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (index == 1) {
            buf[0] = 0x02;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (index == 2) {
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
        }
    }
    function motorStop(motors: Motors): void {
        let buf = pins.createBuffer(3);
        if (motors == 0) {
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (motors == 1) {
            buf[0] = 0x02;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
        }

        if (motors == 2) {
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
        }

    }

    class DFRobotMicroMaqqueenRobot extends robots.Robot {
        constructor() {
            super()
        }

        motorRun(left: number, right: number): void {
            if (left === 0 && right === 0)
                motorStop(Motors.All)
            else if (left === right) {
                const speed = left
                const dir = speed < 0 ? Dir.CCW : Dir.CW
                motorRun(Motors.All, dir, Math.abs(speed))
            } else {
                motorRun(Motors.M1, left < 0 ? Dir.CCW : Dir.CW, Math.abs(left))
                motorRun(Motors.M2, right < 0 ? Dir.CCW : Dir.CW, Math.abs(right))
            }
        }

        motorTurn(speed: number): void {
            if (speed === 0)
                motorStop(Motors.All)
            else {
                // TODO
            }
        }
    }

    /**
     * DFRobot micro maqueen
     */
    //% fixedInstance whenUsed block="dfrobot micro maqueen"
    export const dfRobotMicroMaqueen = new RobotDriver(new DFRobotMicroMaqqueenRobot())
}