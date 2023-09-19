namespace microcode {
    export class KeyStudioMiniSmartRobot implements Robot {
        motorRun(speed: number) {
            if (speed === 0)
                k_Bit.carStop()
            else {
                const dir = speed >= 0 ? DIR.RunForward : DIR.RunBack
                k_Bit.run(dir, Math.abs(speed))
            }
        }
    }

}