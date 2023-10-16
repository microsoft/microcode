namespace microcode {
    // https://github.com/YahboomTechnology/Tiny-bitLib/blob/master/main.ts
    const PWM_ADD = 0x01
    const MOTOR = 0x02
    const RGB = 0x01


    function setPwmRGB(red: number, green: number, blue: number): void {

        let buf = pins.createBuffer(4);
        buf[0] = RGB;
        buf[1] = red;
        buf[2] = green;
        buf[3] = blue;

        pins.i2cWriteBuffer(PWM_ADD, buf);
    }

    class YahboomTinybitRobot extends robots.Robot {
        constructor() {
            super()
            this.sonar = { trig: DigitalPin.P16, echo: DigitalPin.P15 }
            this.lineDetectors = {
                left: DigitalPin.P13,
                right: DigitalPin.P14,
                lineHigh: true
            }
            this.maxLineSpeed = 64
            this.speedTransitionAlpha = 0.5
            this.turnRatioTransitionAlpha = 0.5
        }

        private car_flag_old = 0; //0：两电机正转 1：两电机反转 2:左旋 3：右旋
        private car_flag_new = 0; //0：两电机正转 1：两电机反转 2:左旋 3：右旋
        private setPwmMotor(mode: number, speed1: number, speed2: number): void {
            if (mode < 0 || mode > 6)
                return;

            let buf = pins.createBuffer(5);
            buf[0] = MOTOR;
            switch (mode) {
                case 0: buf[1] = 0; buf[2] = 0; buf[3] = 0; buf[4] = 0; break;              //stop
                case 1: buf[1] = speed1; buf[2] = 0; buf[3] = speed2; buf[4] = 0; this.car_flag_new = 0; break;    //run
                case 2: buf[1] = 0; buf[2] = speed1; buf[3] = 0; buf[4] = speed2; this.car_flag_new = 1; break;    //back
                case 3: buf[1] = 0; buf[2] = 0; buf[3] = speed2; buf[4] = 0; this.car_flag_new = 0; break;    //left
                case 4: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = 0; this.car_flag_new = 0; break;    //right
                case 5: buf[1] = 0; buf[2] = speed1; buf[3] = speed2; buf[4] = 0; this.car_flag_new = 2; break;    //tleft
                case 6: buf[1] = speed1; buf[2] = 0; buf[3] = 0; buf[4] = speed2; this.car_flag_new = 3; break;    //tright
            }
            if (this.car_flag_new != this.car_flag_old) //上一次状态是正转，这次是反转
            {
                let bufff = pins.createBuffer(5);
                bufff[0] = MOTOR;
                bufff[1] = 0; bufff[2] = 0; bufff[3] = 0; bufff[4] = 0;
                pins.i2cWriteBuffer(PWM_ADD, buf);//停止100ms
                basic.pause(100);
                this.car_flag_old = this.car_flag_new;
            }
            pins.i2cWriteBuffer(PWM_ADD, buf);
        }

        private Car_run(speed1: number, speed2: number) {
            this.setPwmMotor(1, speed1, speed2);
        }

        private Car_back(speed1: number, speed2: number) {
            this.setPwmMotor(2, speed1, speed2);
        }

        private Car_left(speed1: number, speed2: number) {
            this.setPwmMotor(3, speed1, speed2);
        }

        private Car_right(speed1: number, speed2: number) {
            this.setPwmMotor(4, speed1, speed2);
        }

        private Car_stop() {
            this.setPwmMotor(0, 0, 0);
        }

        private Car_spinleft(speed1: number, speed2: number) {

            this.setPwmMotor(5, speed1, speed2);
        }

        private Car_spinright(speed1: number, speed2: number) {

            this.setPwmMotor(6, speed1, speed2);
        }

        motorRun(left: number, right: number): void {
            const speed = (left + right) >> 1
            const spin = Math.sign(left) != Math.sign(right)
            if (left === 0 && right === 0)
                this.Car_stop()
            else if (left >= 0 && right >= 0)
                this.Car_run(left, right)
            else if (left <= 0 && right <= 0)
                this.Car_back(-left, -right)
            else if (right > left) {
                if (spin)
                    this.Car_spinleft(Math.abs(left), right)
                else
                    this.Car_left(Math.abs(left), right)
            }
            else {
                if (spin)
                    this.Car_spinright(left, Math.abs(right))
                else
                    this.Car_right(left, Math.abs(right))
            }
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            setPwmRGB(red, green, blue)
        }
    }

    /**
     * Yahboom Tiny:bit
     */
    //% fixedInstance whenUsed block="yahboom tiny:bit" weight=99
    export const yahboomTinyBit = new RobotDriver(new YahboomTinybitRobot())
}