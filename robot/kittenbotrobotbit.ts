namespace microcode {
    // https://github.com/KittenBot/pxt-robotbit/blob/master/main.ts
    const PCA9685_ADDRESS = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04
    const PRESCALE = 0xfe
    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09
    const ALL_LED_ON_L = 0xfa
    const ALL_LED_ON_H = 0xfb
    const ALL_LED_OFF_L = 0xfc
    const ALL_LED_OFF_H = 0xfd

    const STP_CHA_L = 2047
    const STP_CHA_H = 4095

    const STP_CHB_L = 1
    const STP_CHB_H = 2047

    const STP_CHC_L = 1023
    const STP_CHC_H = 3071

    const STP_CHD_L = 3071
    const STP_CHD_H = 1023

    enum Servos {
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04,
        S5 = 0x05,
        S6 = 0x06,
        S7 = 0x07,
        S8 = 0x08,
    }

    enum Motors {
        M1A = 0x1,
        M1B = 0x2,
        M2A = 0x3,
        M2B = 0x4,
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE)
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE)
        return val
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000
        prescaleval /= 4096
        prescaleval /= freq
        prescaleval -= 1
        let prescale = prescaleval //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADDRESS, MODE1)
        let newmode = (oldmode & 0x7f) | 0x10 // sleep
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode) // go to sleep
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescale) // set the prescaler
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode)
        control.waitMicros(5000)
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1)
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50)
        for (let idx = 0; idx < 16; idx++) {
            setPwm(idx, 0, 0)
        }
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15) return

        let buf = pins.createBuffer(5)
        buf[0] = LED0_ON_L + 4 * channel
        buf[1] = on & 0xff
        buf[2] = (on >> 8) & 0xff
        buf[3] = off & 0xff
        buf[4] = (off >> 8) & 0xff
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf)
    }

    function MotorRun(index: Motors, speed: number): void {
        speed = speed * 16 // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= -4096) {
            speed = -4095
        }
        if (index > 4 || index <= 0) return
        let pp = (index - 1) * 2
        let pn = (index - 1) * 2 + 1
        if (speed >= 0) {
            setPwm(pp, 0, speed)
            setPwm(pn, 0, 0)
        } else {
            setPwm(pp, 0, 0)
            setPwm(pn, 0, -speed)
        }
    }

    function Servo(index: Servos, degree: number): void {
        // 50hz: 20,000 us
        let v_us = (degree * 1800) / 180 + 600 // 0.6 ~ 2.4
        let value = (v_us * 4096) / 20000
        setPwm(index + 7, 0, value)
    }

    class KittenbotRobotbitRobot extends robots.Robot {
        constructor() {
            super()
            this.leds = {
                pin: DigitalPin.P16,
                count: 4,
            }
            // 3 Pin Ultrasonic
            this.sonar = {
                trig: DigitalPin.P15,
                echo: DigitalPin.P15,
            }
            this.lineDetectors = {
                left: DigitalPin.P1,
                right: DigitalPin.P2,
                lineHigh: false,
            }
            this.maxLineSpeed = 150

            initPCA9685()
        }

        motorRun(left: number, right: number): void {
            MotorRun(Motors.M1A, left)
            MotorRun(Motors.M1B, -right)
        }

        armOpen(aperture: number): void {
            Servo(Servos.S1, aperture)
        }
    }

    /**
     * Kittenbot robotbit
     */
    //% fixedInstance whenUsed block="Kittenbot robotbit"
    export const kittenbotRobotbit = new RobotDriver(
        new KittenbotRobotbitRobot()
    )
}
