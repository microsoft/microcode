namespace microcode {
    export class KeyStudioMiniSmartRobot implements Robot {
        motorRun(left: number, right: number) {
            if (left === 0 && right === 0)
                k_Bit.carStop()
            else if (left === right) {
                const dir = left >= 0 ? DIR.RunForward : DIR.RunBack
                const speed = Math.map(Math.abs(left), 0, 255, 0, 100)
                k_Bit.run(DIR.RunForward, speed)
            } else {
                k_Bit.Motor(MotorObs.LeftSide, left >= 0 ? MotorDir.Forward : MotorDir.Back, Math.map(left, 0, 255, 0, 100))                
                k_Bit.Motor(MotorObs.RightSide, right >= 0 ? MotorDir.Forward : MotorDir.Back, Math.map(right, 0, 255, 0, 100))
            }
        }
    }

}