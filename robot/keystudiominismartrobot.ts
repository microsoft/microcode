namespace microcode {
    export class KeyStudioMiniSmartRobot implements Robot {

        motorRun(speed: number) {
            if (speed === 0) {
                k_Bit.carStop()
                this.ledSetColor(0, 0, 0)
            }
            else {
                const dir = speed >= 0 ? DIR.RunForward : DIR.RunBack
                if (dir === DIR.RunBack)
                    this.ledSetColor(0xff, 0, 0)
                else
                    this.ledSetColor(0, 0, 0xff)
                k_Bit.run(dir, Math.abs(speed))
            }
        }

        ledSetColor(red: number, green: number, blue: number) {
            k_Bit.LED_brightness(0xff)
            k_Bit.SetLed(red, green, blue)
        }
    }

}