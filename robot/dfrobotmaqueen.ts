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

        private state1 = 0;
        private Ultrasonic(): number {
            let data;
            let i = 0;
            data = this.readUlt();
            if (this.state1 == 1 && data != 0) {
                this.state1 = 0;
            }
            if (data != 0) {
            } else {
                if (this.state1 == 0) {
                    do {
                        data = this.readUlt();
                        i++;
                        if (i > 3) {
                            this.state1 = 1;
                            data = 100;
                            break;
                        }
                    } while (data == 0)
                }
            }
            if (data == 0)
                data = 500
            return data;

        }
        private readUlt(): number {
            let d
            pins.digitalWritePin(DigitalPin.P1, 1);
            basic.pause(1)
            pins.digitalWritePin(DigitalPin.P1, 0);
            if (pins.digitalReadPin(DigitalPin.P2) == 0) {
                pins.digitalWritePin(DigitalPin.P1, 0);
                pins.digitalWritePin(DigitalPin.P1, 1);
                basic.pause(20)
                pins.digitalWritePin(DigitalPin.P1, 0);
                d = pins.pulseIn(DigitalPin.P2, PulseValue.High, 500 * 58);//readPulseIn(1);
            } else {
                pins.digitalWritePin(DigitalPin.P1, 1);
                pins.digitalWritePin(DigitalPin.P1, 0);
                basic.pause(20)
                pins.digitalWritePin(DigitalPin.P1, 0);
                d = pins.pulseIn(DigitalPin.P2, PulseValue.Low, 500 * 58);//readPulseIn(0);
            }
            let x = d / 59;
            return Math.round(x);
        }

        ultrasonicDistance(): number {
            return this.Ultrasonic()
        }

        lineState(): RobotLineState {
            const left = pins.digitalReadPin(DigitalPin.P13) ? 1 : 0
            const right = pins.digitalReadPin(DigitalPin.P14) ? 1 : 0
            return (left >> 0) | (right >> 1)
        }

        leds(): robots.RobotLEDs {
            return {
                pin: DigitalPin.P15,
                count: 4
            }
        }
    }

    /**
     * DFRobot Maqueen
     */
    //% fixedInstance block="dfrobot maqueen" whenUsed weight=80
    export const dfRobotMaqueen = new RobotDriver(new DFRobotMaqueenRobot())
}