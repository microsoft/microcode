namespace microcode {
    // https://github.com/elecfreaks/pxt-Cutebot-Pro/blob/master/main.ts
    const i2cAddr: number = 0x10;

    const enum CutebotProOrientation {
        //%block="forward"
        Advance = 1,
        //%block="reverse"
        Retreat = 0
    }

    const enum CutebotProRGBLight {
        //%block="left RGB"
        RGBL = 2,
        //%block="right RGB"
        RGBR = 1,
        //%block="all RGB lights"
        RGBA = 3
    }

    const enum CutebotProWheel {
        //%block="left wheel"
        LeftWheel = 1,
        //%block="right wheel"
        RightWheel = 2,
        //%block="all wheel"
        AllWheel = 3
    }


    function pwmCruiseControl(speedL: number, speedR: number): void {
        console.log(`left: ${speedL}`)
        console.log(`right: ${speedR}`)

        let i2cBuffer = pins.createBuffer(7)

        if (speedL == 0)
            speedL = 200
        else if (speedL > 0)
            Math.map(speedL, 0, 100, 20, 100);
        else
            Math.map(speedL, -100, 0, -100, -20);

        if (speedR == 0)
            speedR = 200
        else if (speedR > 0)
            Math.map(speedR, 0, 100, 20, 100);
        else
            Math.map(speedR, -100, 0, -100, -20);

        if (speedL > 0) {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.LeftWheel;
            i2cBuffer[3] = 0x01;
            i2cBuffer[4] = speedL;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        else {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.LeftWheel;
            i2cBuffer[3] = 0x00;
            i2cBuffer[4] = -speedL;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        //basic.pause
        if (speedR > 0) {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.RightWheel;
            i2cBuffer[3] = 0x01;
            i2cBuffer[4] = speedR;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        else {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.RightWheel;
            i2cBuffer[3] = 0x00;
            i2cBuffer[4] = -speedR;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
    }

    function ultrasonic(maxCmDistance = 500): number {
        // send pulse
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P8, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P8, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P8, 0);
        // read pulse
        const d = pins.pulseIn(DigitalPin.P12, PulseValue.High, maxCmDistance * 50);
        return Math.floor(d * 34 / 2 / 1000);
    }

    function singleHeadlights(light: CutebotProRGBLight, r: number, g: number, b: number): void {
        let buf = pins.createBuffer(7);
        if (light == 3) {
            buf[0] = 0x99;
            buf[1] = 0x0F;
            buf[2] = 0x03;
            buf[3] = r;
            buf[4] = g;
            buf[5] = b;
            buf[6] = 0x88;
            pins.i2cWriteBuffer(i2cAddr, buf);
        }
        else {
            if (light == 1) {
                buf[2] = 0x01;
            }
            if (light == 2) {
                buf[2] = 0x02;
            }
            buf[0] = 0x99;
            buf[1] = 0x0F;
            buf[3] = r;
            buf[4] = g;
            buf[5] = b;
            buf[6] = 0x88;
            pins.i2cWriteBuffer(i2cAddr, buf);
        }

    }

    function trackbitStateValue() {
        let i2cBuffer = pins.createBuffer(7);
        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x12;
        i2cBuffer[2] = 0x00;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        return pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        //basic.pause(5);
    }

    const enum TrackbitStateType {
        //% block="◌ ◌ ◌ ◌" 
        Tracking_State_0 = 0,
        //% block="◌ ● ● ◌" 
        Tracking_State_1 = 6,
        //% block="◌ ◌ ● ◌" 
        Tracking_State_2 = 4,
        //% block="◌ ● ◌ ◌" 
        Tracking_State_3 = 2,


        //% block="● ◌ ◌ ●" 
        Tracking_State_4 = 9,
        //% block="● ● ● ●" 
        Tracking_State_5 = 15,
        //% block="● ◌ ● ●" 
        Tracking_State_6 = 13,
        //% block="● ● ◌ ●" 
        Tracking_State_7 = 11,

        //% block="● ◌ ◌ ◌" 
        Tracking_State_8 = 1,
        //% block="● ● ● ◌" 
        Tracking_State_9 = 7,
        //% block="● ◌ ● ◌" 
        Tracking_State_10 = 5,
        //% block="● ● ◌ ◌" 
        Tracking_State_11 = 3,

        //% block="◌ ◌ ◌ ●" 
        Tracking_State_12 = 8,
        //% block="◌ ● ● ●" 
        Tracking_State_13 = 14,
        //% block="◌ ◌ ● ●" 
        Tracking_State_14 = 12,
        //% block="◌ ● ◌ ●" 
        Tracking_State_15 = 10
    }

    function readVersions(): string {
        let cutebotProVersionsInteger: number = 0;
        let cutebotProVersionsDecimal: number = 0;

        let i2cBuffer = pins.createBuffer(7);
        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x15;
        i2cBuffer[2] = 0x00;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        cutebotProVersionsDecimal = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)

        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x15;
        i2cBuffer[2] = 0x01;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        cutebotProVersionsInteger = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        if (cutebotProVersionsDecimal / 10 > 1)
            return ("V" + convertToText(cutebotProVersionsInteger) + "." + convertToText(cutebotProVersionsDecimal / 10) + "." + convertToText(cutebotProVersionsDecimal % 10))
        else
            return ("V" + convertToText(cutebotProVersionsInteger) + "." + convertToText(0) + "." + convertToText(cutebotProVersionsDecimal % 10))
    }

    class ElecfreaksCutebotProRobot extends robots.Robot {
        constructor() {
            super()
            this.musicVolume = 168
            this.maxRunSpeed = 80
            this.maxBackSpeed = 80
            this.maxTurnSpeed = 70
            this.maxLineRunSpeed = 50
            this.maxLineTurnSpeed = 50

            const v = readVersions()
            console.log(`cutebot pro version: ${v}`)
        }

        motorRun(left: number, right: number) {
            pwmCruiseControl(left, right)
        }

        motorTurn(speed: number) {
            console.log(`speed: ${speed}`)
            const op = Math.abs(speed) >> 1
            if (speed > 0) pwmCruiseControl(speed, Math.constrain(this.maxTurnSpeed - speed, 0, op))
            else pwmCruiseControl(Math.constrain(this.maxTurnSpeed + speed, 0, op), -speed)
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            singleHeadlights(CutebotProRGBLight.RGBA, red, green, blue)
        }

        ultrasonicDistance(): number {
            return ultrasonic()
        }

        lineState(): microcode.robots.RobotLineState {
            const state = trackbitStateValue()
            const left = (state & (0x01 | 0x02)) ? 1 : 0
            const right = (state & (0x04 | 0x08)) ? 1 : 0

            return (left << 0) | (right << 1)
        }
    }

    /**
     * Cute:bot PRO from Elecfreaks
     */
    //% fixedInstance whenUsed block="elecfreaks cutebot"
    export const elecfreaksCuteBotPro = new RobotDriver(
        new ElecfreaksCutebotProRobot()
    )
}