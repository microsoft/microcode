namespace microcode {
    // https://github.com/KittenBot/pxt-minilfr/blob/master/main.ts

    function writeCmd(cmd: string) {
        serial.writeLine(cmd)
    }

    class KittenbotMiniLFRRobot extends robots.Robot {
        //private mode: MiniLFRMode = MiniLFRMode.IDLE
        private sensorUpdated: number = 0
        private ultrasonicUpdated: number = 0

        private ultrasonicValue: number = 0
        private sensorValue: number[] = [0, 0, 0, 0, 0]

        constructor() {
            super()

            this.speed0 = 20
            this.speed100 = 255
            this.commands[microcode.robots.RobotCompactCommand.MotorTurnLeft] =
                {
                    turnRatio: -50,
                    speed: 40,
                }

            this.commands[microcode.robots.RobotCompactCommand.MotorTurnRight] =
                {
                    turnRatio: 50,
                    speed: 40,
                }

            serial.redirect(SerialPin.P0, SerialPin.P1, 115200)
            serial.writeString("\n\n")
            serial.setRxBufferSize(64)

            serial.onDataReceived("\n", () => {
                let s = serial.readString()
                let tmp = s.split(" ")

                if (tmp[0] === "M7") {
                    this.ultrasonicValue = parseInt(tmp[1])
                    this.ultrasonicUpdated = control.millis()
                } else if (tmp[0] === "M10") {
                    this.sensorValue[0] = parseInt(tmp[1])
                    this.sensorValue[1] = parseInt(tmp[2])
                    this.sensorValue[2] = parseInt(tmp[3])
                    this.sensorValue[3] = parseInt(tmp[4])
                    this.sensorValue[4] = parseInt(tmp[5])
                    this.sensorUpdated = control.millis()
                } else if (tmp[0] === "M33") {
                    //this.mode = MiniLFRMode.IDLE
                }
            })

            basic.forever(() => {
                // read line sensor
                if (control.millis() - this.sensorUpdated > 100) {
                    writeCmd("M10")
                }
                basic.pause(50)
                if (control.millis() - this.ultrasonicUpdated > 100) {
                    writeCmd("M7")
                }
                basic.pause(50)
            })

            writeCmd("M23 14")
            basic.pause(500)
            writeCmd("M6 1 1")
            basic.pause(500)
            writeCmd("M6 0 0")
        }

        motorRun(left: number, right: number): void {
            writeCmd(`M200 ${left} ${right}`)
        }

        playTone(frequency: number, duration: number) {
            writeCmd(`M18 ${frequency} ${duration}`)
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            // set rgb to both ultrasonic and hover led
            writeCmd(
                `M16 0 ${red} ${green} ${blue}\nM13 0 ${red} ${green} ${blue}`
            )
        }

        ultrasonicDistance(): number {
            return this.ultrasonicValue
        }

        lineState(): RobotLineState {
            // sensor returns from 0 to 1023 on black to white, a normal white surface reflects 500
            if (this.sensorValue[0] < 200) return RobotLineState.LostLeft
            else if (this.sensorValue[4] < 200) return RobotLineState.LostRight
            else if (this.sensorValue[1] < 200) return RobotLineState.Left
            else if (this.sensorValue[3] < 200) return RobotLineState.Right
            else if (this.sensorValue[2] < 200) return RobotLineState.Both
            // center
            else return RobotLineState.None
        }
    }

    /**
     * Kittenbot MiniLFR
     */
    //% fixedInstance whenUsed block="kittenbot minilfr"
    export const kittenbotMiniLFR = new RobotDriver(new KittenbotMiniLFRRobot())
}
