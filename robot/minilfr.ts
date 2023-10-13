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
        private lastReceivedMessageId: number = undefined

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

        
        dispatch(msg: robots.RobotMessage) {
            if (!msg) return

            const messageId = msg.messageId
            if (this.lastReceivedMessageId === messageId) {
                return // duplicate
            }

            // decode message
            this.lastReceivedMessageId = messageId
            const cmd = msg.cmd
            const payload = msg.payload

            led.plot(cmd, 0)

        }

        start() { 
            radio.setGroup(1)
            radio.onReceivedNumber(code => {
                const msg = robots.decodeRobotCompactCommand(code)
                if (this.lastReceivedMessageId === msg.messageId) {
                    return // duplicate
                }
                this.lastReceivedMessageId = msg.messageId
                const payload = msg.payload.getNumber(NumberFormat.Int16LE, 0)
                console.log(`ra: ${msg.cmd} ${payload}`)

                if (msg.cmd === robots.RobotCommand.MotorRun) {
                    this.motorRun(payload, payload)
                    this.playTone(440, 50)
                } else if (msg.cmd === robots.RobotCommand.MotorTurn) {
                    this.motorRun(payload, -payload)
                    this.playTone(932, 50)
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

            input.onButtonPressed(Button.A, () => {
                // toggle radio group
                robots.nextGroup()
                basic.showNumber(microcode.robots.radioGroup, 100)
                basic.clearScreen()
            })

            input.onButtonPressed(Button.B, () => { 
                // linefollow mode
                if (this.mode === MiniLFRMode.IDLE) {
                    writeCmd('M31')
                    this.mode = MiniLFRMode.LINE_FOLLOW
                } else if (this.mode === MiniLFRMode.LINE_FOLLOW) {
                    writeCmd('M32')
                    this.mode = MiniLFRMode.OBSTACLE_AVOIDANCE
                } else if (this.mode === MiniLFRMode.OBSTACLE_AVOIDANCE) { 
                    writeCmd('M33')
                    this.mode = MiniLFRMode.IDLE
                }
            })

            input.onButtonPressed(Button.AB, function () {
                // calibrate sensor
                // 1. put the robot on a white surface with black line
                // 2. press A+B, then the robot will rotate in place to calibrate the sensor
                writeCmd('M310')
            })

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
    export const kittenbotMiniLFR = new KittenbotMiniLFRRobot()

}