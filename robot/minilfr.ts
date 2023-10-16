namespace microcode { 
    // https://github.com/KittenBot/pxt-minilfr/blob/master/main.ts

    enum MiniLFRMode { 
        IDLE,
        LINE_FOLLOW,
        OBSTACLE_AVOIDANCE,
    }

    function writeCmd(cmd: string) { 
        serial.writeLine(cmd)
    }

    
    class KittenbotMiniLFRRobot extends robots.Robot { 

        private speedLeft: number = 0
        private speedRight: number = 0

        private mode: MiniLFRMode = MiniLFRMode.IDLE
        private sensorUpdated: number = 0
        private ultrasonicUpdated: number = 0

        private ultrasonicValue: number = 0
        private sensorValue: number[] = [0, 0, 0, 0, 0];
        private batteryValue: number = 0;

        constructor() { 
            super() 

            serial.redirect(SerialPin.P0, SerialPin.P1, 115200)
            serial.writeString("\n\n")
            serial.setRxBufferSize(64)
            
            serial.onDataReceived('\n', () => { 
                let s = serial.readString()
                let tmp = s.split(" ")

                if (tmp[0] === 'M7') {
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
                    this.mode = MiniLFRMode.IDLE
                }
            })

            basic.forever(() => { 
                // read line sensor
                if (control.millis() - this.sensorUpdated > 100) {
                    writeCmd('M10')
                }
                basic.pause(50)
                if (control.millis() - this.ultrasonicUpdated > 100) { 
                    writeCmd('M7')
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
            if (left === this.speedLeft && right === this.speedRight) {
                return
            }
            this.speedLeft = left
            this.speedRight = right

            // map to [-255, 255]
            left = Math.clamp(-255, 255, left*2.55)
            right = Math.clamp(-255, 255, right*2.55)
            writeCmd(`M200 ${left} ${right}`)

        }

        playTone(frequency: number, duration: number) {
            writeCmd(`M18 ${frequency} ${duration}`)
        }

        headlightsSetColor(red: number, green: number, blue: number) {
            writeCmd(`M16 0 ${red} ${green} ${blue}`)
        }

        ultrasonicDistance(): number { 
            return this.ultrasonicValue;
        }

        lineState(): RobotLineState {
            let left = this.sensorValue[0] > 100 ? 1 : 0
            let right = this.sensorValue[4] > 100 ? 1 : 0
            return (left << 0) | (right << 1)
        }

    }


    /**
     * Kittenbot MiniLFR
     */
    //% fixedInstances whenUsed block="Kittenbot minilfr"
    export const kittenbotMiniLFR = new RobotDriver(
        new KittenbotMiniLFRRobot()
    )

}