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

        private mode: MiniLFRMode = MiniLFRMode.IDLE
        private isSenorUpdated: boolean = true
        private isUltrasonicUpdated: boolean = true

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
                    this.isUltrasonicUpdated = true
                } else if (tmp[0] === "M10") {
                    this.sensorValue[0] = parseInt(tmp[1])
                    this.sensorValue[1] = parseInt(tmp[2])
                    this.sensorValue[2] = parseInt(tmp[3])
                    this.sensorValue[3] = parseInt(tmp[4])
                    this.sensorValue[4] = parseInt(tmp[5])
                    this.isSenorUpdated = true
                    if (this.mode === MiniLFRMode.LINE_FOLLOW) {
                        this.updateSensorOnMatrix()
                    }
                } else if (tmp[0] === "M33") { 
                    this.mode = MiniLFRMode.IDLE
                }
            })

            basic.forever(() => { 
                // read line sensor
                if (this.isSenorUpdated) {
                    writeCmd('M10')
                    this.isSenorUpdated = false
                } else if (this.isUltrasonicUpdated) { 
                    writeCmd('M7')
                    this.isUltrasonicUpdated = false
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
            if (left != 0 || right != 0) {
                this.hoverColor(100, 0, 0)
            } else { 
                this.hoverColor(0, 0, 0)
            }
        }

        playTone(frequency: number, duration: number) {
            writeCmd(`M18 ${frequency} ${duration}`)
        }

        hoverColor(red: number, green: number, blue: number) {
            writeCmd(`M13 0 ${red} ${green} ${blue}`)
        }

        ultrasonicDistance(): number { 
            return this.ultrasonicValue;
        }

        lineState(): RobotLineState {
            
            return 0x1
        }


        updateSensorOnMatrix(): void {
            let img = images.createImage(`
                . . . . .
                . . . . .
                . . . . .
                . . . . .
                . . . . .
            `)
    
            for (let i = 0; i < 5; i++) {
                let v = Math.floor(this.sensorValue[i] / 20)
    
                for (let j = 0; j < 5; j++) {
                    if (v > j) {
                        img.setPixel(4 - i, 4 - j, true)
                    }
                }
            }
    
            img.showImage(0)
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