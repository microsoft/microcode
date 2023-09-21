namespace microcode {
    class DFRobotMicroMaqqueenRobot extends robots.Robot {
        constructor() {
            super()
        }

        motorRun(left: number, right: number): void {
            if (left === 0 && right === 0)
                maqueen.motorStop(maqueen.Motors.All)
            else if (left === right) {
                const speed = left
                const dir = speed < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW
                maqueen.motorRun(maqueen.Motors.All, dir, Math.abs(speed))
            } else {
                maqueen.motorRun(maqueen.Motors.M1, left < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW, Math.abs(left))
                maqueen.motorRun(maqueen.Motors.M2, right < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW, Math.abs(right))
            }
        }

        motorTurn(speed: number): void {
            if (speed === 0)
                maqueen.motorStop(maqueen.Motors.All)
            else {
                // TODO
            }
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            // TODO
        }

        ultrasonicDistance(): number {
            return maqueen.Ultrasonic(PingUnit.Centimeters, 100)
        }

        lineState(): RobotLineState {
            const left = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
            const right = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
            return (left << 0) | (right << 1)
        }
    }

    /**
     * DFRobot micro maqueen
     */
    //% fixedInstance whenUsed block="dfrobot micro maqueen"
    export const dfRobotMicroMaqueen = new RobotDriver(new DFRobotMicroMaqqueenRobot())
}