namespace microcode {
    // https://github.com/YahboomTechnology/Tiny-bitLib/blob/master/main.ts
    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01

    let car_flag_old = 0; //0：两电机正转 1：两电机反转 2:左旋 3：右旋
    let car_flag_new = 0; //0：两电机正转 1：两电机反转 2:左旋 3：右旋
    function setPwmMotor(mode: number, speed1: number, speed2: number): void {
        if (mode < 0 || mode > 6)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = MOTOR;
        switch (mode) {
            case 0: buf[1] = 0; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;              //stop
            case 1: buf[1] = speed1; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0; break;    //run
            case 2: buf[1] = 0; buf[2] = speed1; buf[3] = 0; buf[4] = speed2; car_flag_new = 1; break;    //back
            case 3: buf[1] = 0; buf[2] = 0; buf[3] = speed2; buf[4] = 0; car_flag_new = 0; break;    //left
            case 4: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = 0; car_flag_new = 0; break;    //right
            case 5: buf[1] = 0; buf[2] = speed1; buf[3] = speed2; buf[4] = 0; car_flag_new = 2; break;    //tleft
            case 6: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = speed2; car_flag_new = 3; break;    //tright
        }
        if (car_flag_new != car_flag_old) //上一次状态是正转，这次是反转
        {
            let bufff = pins.createBuffer(5);
            bufff[0] = MOTOR;
            bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
            pins.i2cWriteBuffer(PWM_ADD, buf);//停止100ms
            basic.pause(100);
            car_flag_old = car_flag_new;
        }
        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    function Car_run(speed1: number, speed2: number) {


        setPwmMotor(1, speed1, speed2);
    }

    function Car_back(speed1: number, speed2: number) {

        setPwmMotor(2, speed1, speed2);
    }

    function Car_left(speed1: number, speed2: number) {

        setPwmMotor(3, speed1, speed2);
    }

    function Car_right(speed1: number, speed2: number) {

        setPwmMotor(4, speed1, speed2);
    }

    function Car_stop() {

        setPwmMotor(0, 0, 0);
    }

    function Car_spinleft(speed1: number, speed2: number) {

        setPwmMotor(5, speed1, speed2);
    }

    function Car_spinright(speed1: number, speed2: number) {

        setPwmMotor(6, speed1, speed2);
    }

    function setPwmRGB(red: number, green: number, blue: number): void {

        let buf = pins.createBuffer(4);
        buf[0] = RGB;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;

        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    function Ultrasonic_Car(): number {

        let list: Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
            pins.digitalWritePin(DigitalPin.P16, 0);
            control.waitMicros(2);
            pins.digitalWritePin(DigitalPin.P16, 1);
            control.waitMicros(15);
            pins.digitalWritePin(DigitalPin.P16, 0);
            let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
            list[i] = Math.floor(d / 40);
        }
        list.sort();
        let length = (list[1] + list[2] + list[3]) / 3;
        return Math.floor(length);
    }

    function Ultrasonic_CarV2(): number {
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P16, 0);
        control.waitMicros(4);
        pins.digitalWritePin(DigitalPin.P16, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P16, 0);

        let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 500 * 58);
        return Math.floor(d / 58);

    }

    class YahboomTinybitRobot extends robots.Robot {
        constructor() {
            super()

            pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
            pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
            this.maxLineTrackingSpeed = 60
        }

        motorRun(left: number, right: number): void {
            const speed = (left + right) >> 1
            if (left === 0 && right === 0)
                Car_stop()
            else if (left >= 0 && right >= 0)
                Car_run(left, right)
            else if (left <= 0 && right <= 0)
                Car_back(-left, -right)
            else if (speed > 0)
                Car_run(speed, speed)
            else
                Car_back(-speed, -speed)
        }

        motorTurn(speed: number): void {
            if (speed === 0)
                Car_stop()
            else if (speed > 0)
                Car_spinright(speed, 0)
            else 
                Car_spinleft(0, -speed)
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            setPwmRGB(red, green, blue)
        }

        ultrasonicDistance(): number {
            return Ultrasonic_CarV2()
        }

        lineState(): microcode.robots.RobotLineState {
            const left = pins.digitalReadPin(DigitalPin.P13);
            const right = pins.digitalReadPin(DigitalPin.P14);

            return (left << 0) | (right << 1)
        }
    }

    /**
     * Yahboom Tiny:bit
     */
    //% fixedInstance whenUsed block="yahboom tiny:bit"
    export const yahboomTinyBit = new RobotDriver(new YahboomTinybitRobot())

}