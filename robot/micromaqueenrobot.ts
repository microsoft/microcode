namespace microcode {
    export class DFRobotMicroMaqqueenRobot implements Robot {
        motorRun(left: number, right: number): void {
            if (left === right) {
                if (left === 0)
                    maqueen.motorStop(maqueen.Motors.All)
                else {
                    const dir = left < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW
                    maqueen.motorRun(maqueen.Motors.All, dir, left)
                }
            } else {
                if (left === 0)
                    maqueen.motorStop(maqueen.Motors.M1)
                else
                    maqueen.motorRun(maqueen.Motors.M1, left < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW, left)
                if (right === 0)
                    maqueen.motorStop(maqueen.Motors.M2)
                else
                    maqueen.motorRun(maqueen.Motors.All, right < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW, right)
            }
        }
    }
}