namespace microcode {
    const STM8_ADDRESSS = 0x10

    //https://github.com/elecfreaks/pxt-cutebot/blob/master/cutebot.ts
    function motors(lspeed: number, rspeed: number): void {
        const buf = pins.createBuffer(4)
        /*
        if (lspeed > 100) {
            lspeed = 100;
        } else if (lspeed < -100) {
            lspeed = -100;
        }
        if (rspeed > 100) {
            rspeed = 100;
        } else if (rspeed < -100) {
            rspeed = -100;
        }*/
        if (lspeed > 0) {
            buf[0] = 0x01 //左右轮 0x01左轮  0x02右轮
            buf[1] = 0x02 //正反转0x02前进  0x01后退
            buf[2] = lspeed //速度
            buf[3] = 0 //补位
        } else {
            buf[0] = 0x01
            buf[1] = 0x01
            buf[2] = -lspeed
            buf[3] = 0 //补位
        }
        pins.i2cWriteBuffer(STM8_ADDRESSS, buf) //写入左轮
        if (rspeed > 0) {
            buf[0] = 0x02
            buf[1] = 0x02
            buf[2] = rspeed
            buf[3] = 0 //补位
        } else {
            buf[0] = 0x02
            buf[1] = 0x01
            buf[2] = -rspeed
            buf[3] = 0 //补位
        }
        pins.i2cWriteBuffer(STM8_ADDRESSS, buf) //写入左轮
    }

    function singleheadlights(r: number, g: number, b: number): void {
        const buf = pins.createBuffer(4)
        buf[0] = 0x04
        buf[1] = r
        buf[2] = g
        buf[3] = b
        pins.i2cWriteBuffer(STM8_ADDRESSS, buf)
        buf[0] = 0x08
        pins.i2cWriteBuffer(STM8_ADDRESSS, buf)
    }

    class ElecfreaksCutebotRobot extends robots.Robot {
        constructor() {
            super({
                leds: {
                    pin: DigitalPin.P15,
                    count: 2
                },
                sonar: {
                    trig: DigitalPin.P8,
                    echo: DigitalPin.P12
                },
                lineDetectors: {
                    left: DigitalPin.P13,
                    right: DigitalPin.P14,
                    lineHigh: false
                }
            })
            this.musicVolume = 156
            this.maxLineSpeed = 28

        }

        motorRun(left: number, right: number) {
            motors(left, right)
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            singleheadlights(red, green, blue)
        }
    }

    /**
     * Cute:bot from Elecfreaks
     */
    //% fixedInstance whenUsed block="elecfreaks cutebot" weight=100
    export const elecfreaksCuteBot = new RobotDriver(
        new ElecfreaksCutebotRobot()
    )
}
