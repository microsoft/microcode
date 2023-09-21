namespace microcode {
    export class DFRobotMicroMaqqueenRobot extends Robot {
        constructor() {
            super()
        }

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
}