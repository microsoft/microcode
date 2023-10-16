namespace microcode {
    const I2C_ADRESS = 0x10
    const M1_INDEX = 0
    const M2_INDEX = 0x02
    const FORWARD = 0
    const BACKWARD = 1
    function run(index: number, speed: number): void {
        const buf = pins.createBuffer(3);
        const direction = speed > 0 ? FORWARD : BACKWARD
        const s = Math.round(Math.map(Math.abs(speed), 0, 100, 0, 255))
        buf[0] = index;
        buf[1] = direction;
        buf[2] = s
        pins.i2cWriteBuffer(I2C_ADRESS, buf);
    }

    // https://github.com/DFRobot/pxt-maqueen/blob/master/maqueen.ts
    class DFRobotMaqueenRobot extends robots.Robot {
        constructor() {
            super()
            this.lineDetectors = {
                left: DigitalPin.P13,
                right: DigitalPin.P14,
                lineHigh: false
            }
            this.leds = {
                pin: DigitalPin.P15,
                count: 4
            }
            this.sonar = {
                trig: DigitalPin.P1,
                echo: DigitalPin.P2
            }
        }

        motorRun(left: number, right: number): void {
            run(M1_INDEX, left)
            run(M2_INDEX, right)
        }

        headlightsSetColor(red: number, green: number, blue: number): void {
            // monochrome leds
            const on = (red > 0xf) || (green > 0xf) || (blue > 0xf) ? 1 : 0
            pins.digitalWritePin(DigitalPin.P8, on)
            pins.digitalWritePin(DigitalPin.P12, on)
        }
    }

    /**
     * DFRobot Maqueen
     */
    //% fixedInstance block="dfrobot maqueen" whenUsed weight=80
    export const dfRobotMaqueen = new RobotDriver(new DFRobotMaqueenRobot())
}