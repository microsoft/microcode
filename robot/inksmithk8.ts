namespace microcode {
    const IR_SENSOR_LEFT = DigitalPin.P0 //AnalogPin.P0
    const IR_SENSOR_MIDDLE = DigitalPin.P1 //AnalogPin.P1
    const SPEAKER = AnalogPin.P1
    const IR_SENSOR_RIGHT = DigitalPin.P2 // AnalogPin.P2
    const SERVO_2 = AnalogPin.P8
    const SONAR = DigitalPin.P8
    const SERVO_1 = AnalogPin.P12
    const M2_PWR: number = DigitalPin.P13
    const M2_DIR: number = DigitalPin.P14
    const M1_PWR: number = DigitalPin.P15
    const M1_DIR: number = DigitalPin.P16

    const enum Motor {
        LEFT = 0,
        RIGHT = 1,
    }

    const enum MotorDirection {
        FORWARD = 0,
        REVERSE = 1,
    }

    function remapSpeed(s: number): number {
        s = Math.abs(s) >> 0
        let returnSpeed: number
        if (s <= 0) {
            returnSpeed = 0
        } else if (s >= 100) {
            returnSpeed = 1023
        } else {
            returnSpeed = (23200 + s * 791) / 100
        }
        return returnSpeed
    }

    class InksmithK8Robot extends robots.Robot {
        constructor() {
            super()
            this.lineDetectors = new robots.PinLineDetectors(
                IR_SENSOR_LEFT,
                IR_SENSOR_RIGHT,
                true
            )
            const sonar = new robots.SR04Sonar(SONAR, SONAR)
            sonar.usPerCm = 39
            this.sonar = sonar
        }

        motorRun(left: number, right: number): void {
            pins.digitalWritePin(
                M1_DIR,
                left < 0 ? MotorDirection.REVERSE : MotorDirection.FORWARD
            )
            pins.analogSetPeriod(M1_PWR, 1024)
            pins.analogWritePin(M1_PWR, remapSpeed(left))

            pins.digitalWritePin(
                M2_DIR,
                right < 0 ? MotorDirection.REVERSE : MotorDirection.FORWARD
            )
            pins.analogSetPeriod(M2_PWR, 1024)
            pins.analogWritePin(M2_PWR, remapSpeed(right))
        }
    }

    /**
     * Inksmith K8
     */
    //% fixedInstance block="inksmith k8" whenUsed
    export const inksmithK8 = new RobotDriver(new InksmithK8Robot())
}
