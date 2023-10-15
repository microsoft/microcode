namespace microcode {
    const I2C_ADRESS = 0x10
    const enum Motors {
        //% blockId="left motor" block="left"
        M1 = 0,
        //% blockId="right motor" block="right"
        M2 = 0x02,
    }
    const enum Dir {
        //% blockId="CW" block="Forward"
        CW = 0x0,
        //% blockId="CCW" block="Backward"
        CCW = 0x1
    }
    function run(index: Motors, speed: number): void {
        const buf = pins.createBuffer(3);
        const direction = speed > 0 ? Dir.CW : Dir.CCW
        speed = Math.abs(speed)
        buf[0] = index;
        buf[1] = direction;
        buf[2] = speed;
        pins.i2cWriteBuffer(I2C_ADRESS, buf);
    }

    // https://github.com/DFRobot/pxt-maqueen/blob/master/maqueen.ts
    class DFRobotMaqueenRobot extends robots.Robot {
        constructor() {
            super()
        }

        motorRun(left: number, right: number): void {
            run(Motors.M1, left)
            run(Motors.M1, right)
        }

        headlightsSetColor(red: number, green: number, blue: number): void {
            // monochrome leds
            const on = (red > 0xf) || (green > 0xf) || (blue > 0xf) ? 1 : 0
            pins.digitalWritePin(DigitalPin.P8, on)
            pins.digitalWritePin(DigitalPin.P12, on)
        }

        lineDetectors() {
            return {
                left: DigitalPin.P13,
                right: DigitalPin.P14,
                lineHigh: true
            }
        }

        leds(): robots.RobotLEDs {
            return {
                pin: DigitalPin.P15,
                count: 4
            }
        }

        sonar() {
            return { trig: DigitalPin.P1, echo: DigitalPin.P2 }
        }
    }

    /**
     * DFRobot Maqueen
     */
    //% fixedInstance block="dfrobot maqueen" whenUsed weight=80
    export const dfRobotMaqueen = new RobotDriver(new DFRobotMaqueenRobot())
}