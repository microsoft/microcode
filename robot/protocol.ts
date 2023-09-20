namespace microcode {
    const MESSAGE_MAGIC = 0xf498

    /**
     * List of commands supported by the micro:bit robot program
     */
    export enum RobotCommand {
        /**
         * Runs the robot forward and backward.
         *     speed: i16 %
         */
        MotorRun = 0x0001,
        /**
         * Turn the robot left and right. Right is positive values.
         *     speed: i16 %
         */
        MotorTurn = 0x0002,
        LedSetColor = 0x0010,
    }

    /**
     * Encodes the command and payload into a buffer that can be sent via radio
     */
    export function createRobotCommand(cmd: RobotCommand, payload: Buffer) {
        const buf = pins.createBuffer(4 + payload.length)
        buf.setNumber(NumberFormat.UInt16LE, 0, MESSAGE_MAGIC)
        buf.setNumber(NumberFormat.UInt16LE, 2, cmd)
        buf.write(4, payload)
        console.log(buf.toHex())
        return buf
    }

    /**
     * Decodes message buffer
     */
    export function readRobotCommand(msg: Buffer): { cmd: RobotCommand, payload: Buffer } {
        const magic = msg.getNumber(NumberFormat.UInt16LE, 0)
        if (magic !== MESSAGE_MAGIC) return undefined; // ignore
        const cmd = msg.getNumber(NumberFormat.UInt16LE, 2)
        const payload = msg.slice(4)
        return {
            cmd: cmd,
            payload: payload
        }
    }
}