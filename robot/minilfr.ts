namespace microcode { 
    // https://github.com/KittenBot/pxt-minilfr/blob/master/main.ts

    class KittenbotMiniLFRRobot extends robots.Robot { 
        lastSensorUpdate: number = 0
        constructor() { 
            super() 

            serial.redirect(SerialPin.P0, SerialPin.P1, 115200)
            serial.writeString("\n\n")
            serial.setRxBufferSize(64)
            this.lastSensorUpdate = input.runningTimeMicros()
        }

        
    }


    /**
     * Kittenbot MiniLFR
     */
    //% fixedInstances whenUsed block="Kittenbot minilfr"
    export const kittenbotMiniLFR = new RobotDriver(new KittenbotMiniLFRRobot());

}