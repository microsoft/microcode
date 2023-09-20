namespace microcode {
    export class DFRobotMicroMaqqueenRobot implements Robot {
        motorRun(speed: number): void {
            if (speed === 0)
                maqueen.motorStop(maqueen.Motors.All)
            else {
                const dir = speed < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW
                maqueen.motorRun(maqueen.Motors.All, dir, Math.abs(speed))
            }
        }

        motorTurn(speed: number): void {
            if (speed === 0)
                maqueen.motorStop(maqueen.Motors.All)
            else {
                // TODO
            }
        }

        ledSetColor(red: number, green: number, blue: number) {
            // TODO
        }
    }
}