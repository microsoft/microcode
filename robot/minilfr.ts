namespace microcode { 
    // https://github.com/KittenBot/pxt-minilfr/blob/master/main.ts

    function writeCmd(cmd: string) { 
        serial.writeLine(cmd)
    }

    class KittenbotMiniLFRRobot extends robots.Robot { 

        
        private lastSensorUpdate: number = 0
        private ultrasonicValue: number = 0
        private sensorValue: number[] = [0, 0, 0, 0, 0];
        private batteryValue: number = 0;
        private lastReceivedMessageId: number = undefined

        constructor() { 
            super() 

            serial.redirect(SerialPin.P0, SerialPin.P1, 115200)
            serial.writeString("\n\n")
            serial.setRxBufferSize(64)
            this.lastSensorUpdate = input.runningTimeMicros()
            
            serial.onDataReceived('\n', () => { 
                let s = serial.readString()
                let tmp = s.split(" ")

                if (tmp[0] == 'M7') {
                    this.ultrasonicValue = parseInt(tmp[1])
                } else if (tmp[0] == "M10"){
                    this.sensorValue[0] = parseInt(tmp[1])
                    this.sensorValue[1] = parseInt(tmp[2])
                    this.sensorValue[2] = parseInt(tmp[3])
                    this.sensorValue[3] = parseInt(tmp[4])
                    this.sensorValue[4] = parseInt(tmp[5])
                    
                }
            })

            basic.pause(500)
            serial.writeLine("M6 1 1")
            basic.pause(500)
            serial.writeLine("M6 0 0")
            
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
            // writeCmd('M7');
            basic.pause(15);
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
        }


    }


    /**
     * Kittenbot MiniLFR
     */
    //% fixedInstances whenUsed block="Kittenbot minilfr"
    export const kittenbotMiniLFR = new KittenbotMiniLFRRobot()

}