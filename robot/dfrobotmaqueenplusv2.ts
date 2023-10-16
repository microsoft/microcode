namespace microcode {
    const I2CADDR = 0x10;
    const LEFT_LED_REGISTER = 0X0B;
    const RIGHT_LED_REGISTER = 0X0C;
    const LEFT_MOTOR_REGISTER = 0X00;
    const RIGHT_MOTOR_REGISTER = 0X02;
    const LINE_STATE_REGISTER = 0X1D;
    const FORWARD = 0
    const BACKWARD = 1
    function run(index: number, speed: number): void {
        const buf = pins.createBuffer(3);
        const direction = speed > 0 ? FORWARD : BACKWARD
        const s = Math.round(Math.map(Math.abs(speed), 0, 100, 0, 255))
        buf[0] = index;
        buf[1] = direction;
        buf[2] = s
        pins.i2cWriteBuffer(I2CADDR, buf);
    }

    // https://github.com/DFRobot/pxt-DFRobot_MaqueenPlus_v20/blob/master/maqueenPlusV2.ts
    class DFRobotMaqueenPlusV2Robot extends robots.Robot {
        constructor() {
            super()
            this.leds = {
                pin: DigitalPin.P15,
                count: 4
            }
            this.sonar = {
                trig: DigitalPin.P13,
                echo: DigitalPin.P14
            }
        }

        motorRun(left: number, right: number): void {
            run(LEFT_MOTOR_REGISTER, left)
            run(RIGHT_MOTOR_REGISTER, right)
        }

        headlightsSetColor(red: number, green: number, blue: number): void {
            const on = (red > 0xf) || (green > 0xf) || (blue > 0xf) ? 1 : 0
            const buf = pins.createBuffer(3);
            buf[0] = LEFT_LED_REGISTER;
            buf[1] = on;
            buf[2] = on;
            pins.i2cWriteBuffer(I2CADDR, buf);
        }

        lineState() {
            pins.i2cWriteNumber(I2CADDR, LINE_STATE_REGISTER, NumberFormat.Int8LE);
            const data = pins.i2cReadNumber(I2CADDR, NumberFormat.Int8LE)
            const left = (data & 0x08) == 0x08 ? 1 : 0
            const right = (data & 0x02) == 0x02 ? 1 : 0
            return (left << 0) | (right << 1)
        }
    }

    /**
     * DFRobot Maqueen
     */
    //% fixedInstance block="dfrobot maqueen plus v2" whenUsed weight=80
    export const dfRobotMaqueenPlusV2 = new RobotDriver(new DFRobotMaqueenPlusV2Robot())
}