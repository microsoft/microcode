namespace microcode {
    export class KeyStudioMiniSmartRobot extends Robot {
        constructor() {
            super()
        }

        motorRun(speed: number) {
            if (speed === 0) {
                this.motorStop()
            }
            else {
                const dir = speed >= 0 ? DIR.RunForward : DIR.RunBack
                k_Bit.run(dir, Math.abs(speed))
            }
        }

        motorStop() {
            k_Bit.carStop()
        }

        motorTurn(speed: number) {
            if (speed === 0) {
                this.motorStop()
            } else {
                const dir = speed >= 0 ? DIR.TurnRight : DIR.TurnLeft
                k_Bit.run(dir, Math.abs(speed))
            }
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            k_Bit.LED_brightness(0xff)
            k_Bit.SetLed(red, green, blue)
        }

        ultrasonicDistance(): number {
            return k_Bit.ultra()
        }

        lineState(): RobotLineState {
            return k_Bit.LineTracking()
        }
    }

}