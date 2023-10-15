namespace microcode {
    // https://github.com/mworkfun/pxt-k-bit/blob/master/main.ts
    const PCA9685_ADDRESS = 0x43;   //device address
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const SUBADR1 = 0x02;
    const SUBADR2 = 0x03;
    const SUBADR3 = 0x04;
    const PRESCALE = 0xFE;
    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;
    const ALL_LED_ON_L = 0xFA;
    const ALL_LED_ON_H = 0xFB;
    const ALL_LED_OFF_L = 0xFC;
    const ALL_LED_OFF_H = 0xFD;
    const TRIG_PIN = DigitalPin.P14;
    const ECHO_PIN = DigitalPin.P15;

    function i2cRead(reg: number) {
        pins.i2cWriteNumber(PCA9685_ADDRESS, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(PCA9685_ADDRESS, NumberFormat.UInt8BE);
        return val;
    }

    function i2cWrite(reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf)
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cRead(MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cWrite(MODE1, newmode); // go to sleep
        i2cWrite(PRESCALE, prescale); // set the prescaler
        i2cWrite(MODE1, oldmode);
        control.waitMicros(5000);
        i2cWrite(MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    const enum MotorObs {
        LeftSide = 0,
        RightSide = 1
    }
    const enum MotorDir {
        Forward = 0,
        Back = 1
    }

    function Motor(M: MotorObs, MD: MotorDir, speed: number) {
        const speed_value = Math.map(speed, 0, 100, 0, 4095);
        if (M == 0 && MD == 0) {
            setPwm(1, 0, speed_value);  //control speed : 0---4095
            setPwm(0, 0, 0);
        }
        if (M == 0 && MD == 1) {
            setPwm(1, 0, speed_value);  //control speed : 0---4095
            setPwm(0, 0, 4095);
        }

        if (M == 1 && MD == 0) {
            setPwm(3, 0, speed_value);  //control speed : 0---4095
            setPwm(2, 0, 0);
        }
        if (M == 1 && MD == 1) {
            setPwm(3, 0, speed_value);  //control speed : 0---4095
            setPwm(2, 0, 4095);
        }

    }

    class KeyStudioMiniSmartRobot extends robots.Robot {
        lastTime = 0;
        constructor() {
            super()
            this.init_PCA9685();
            pins.setPull(DigitalPin.P12, PinPullMode.PullNone);
            pins.setPull(DigitalPin.P13, PinPullMode.PullNone);
            pins.setPull(TRIG_PIN, PinPullMode.PullNone);
        }

        motorRun(left: number, right: number) {
            Motor(MotorObs.LeftSide, left > 0 ? MotorDir.Forward : MotorDir.Back, Math.abs(left))
            Motor(MotorObs.RightSide, right > 0 ? MotorDir.Forward : MotorDir.Back, Math.abs(right))
        }

        ultrasonicDistance(): number {
            //send trig pulse
            pins.digitalWritePin(TRIG_PIN, 0)
            control.waitMicros(2);
            pins.digitalWritePin(TRIG_PIN, 1)
            control.waitMicros(10);
            pins.digitalWritePin(TRIG_PIN, 0)

            // read echo pulse  max distance : 6m(35000us)
            //2020-7-6 
            // pins.pulseIn():This function has a bug and returns data with large errors.
            let t = pins.pulseIn(ECHO_PIN, PulseValue.High, 35000);
            let ret = t;

            //Eliminate the occasional bad data
            if (ret == 0 && this.lastTime != 0) {
                ret = this.lastTime;
            }
            this.lastTime = t;
            //2020-7-6
            //It would normally divide by 58, because the pins.pulseIn() function has an error, so it's divided by 58
            return Math.round(ret / 40);
        }

        lineState(): RobotLineState {
            const left = pins.digitalReadPin(DigitalPin.P13)
            const right = pins.digitalReadPin(DigitalPin.P12)
            return (left << 0) | (right << 1)
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            const L_brightness = 0;  //control the rgb-led brightness
            const R = Math.map(red, 0, 255, 4095, L_brightness);
            const G = Math.map(green, 0, 255, 4095, L_brightness);
            const B = Math.map(blue, 0, 255, 4095, L_brightness);

            setPwm(6, 0, R);
            setPwm(5, 0, G);
            setPwm(4, 0, B);
        }

        private init_PCA9685(): void {
            i2cWrite(MODE1, 0x00);  //initialize the mode register 1
            setFreq(50);   //20ms
            for (let idx = 0; idx < 16; idx++) {
                setPwm(idx, 0, 0);
            }
        }
    }

    /**
     * Mini Smart Robot from KeyStudio
     */
    //% fixedInstance whenUsed block="keystudio mini smart robot" weight=10
    export const keyStudioMiniSmartRobot = new RobotDriver(new KeyStudioMiniSmartRobot())
}