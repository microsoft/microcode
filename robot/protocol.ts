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
        MotorRun = 0x01,
        /**
         * Turn the robot left and right. Right is positive values.
         *     speed: i16 %
         */
        MotorTurn = 0x02,
        /**
         * Report ultrasonic distance in cm
         *     distance: f32
         */
        UltrasonicDistance = 0x10
    }

    export interface RobotMessage {
        /**
         * message identifier to drop repeated messages; u8
         */
        messageId: number
        /**
         * Robot command
         */
        cmd: RobotCommand
        /**
         * Command payload
         */
        payload: Buffer
    }

    /**
     * Encodes the command and payload into a buffer that can be sent via radio
     * 
     *   0 magic, u16
     *   2 message id, u8
     *   3 cmd, u8
     *   4 payload, u8[]
     */
    export function encodeRobotMessage(msg: RobotMessage) {
        const payload = msg.payload
        const messageid = msg.messageId
        const cmd = msg.cmd

        const buf = pins.createBuffer(6 + payload.length)
        buf.setNumber(NumberFormat.UInt16LE, 0, MESSAGE_MAGIC)
        buf.setNumber(NumberFormat.UInt8LE, 2, messageid)
        buf.setNumber(NumberFormat.UInt8LE, 3, cmd)
        buf.write(4, payload)
        return buf
    }

    /**
     * Decodes message buffer
     */
    export function decodeRobotCommand(msg: Buffer): RobotMessage {
        if (!msg || msg.length < 4) return undefined

        const magic = msg.getNumber(NumberFormat.UInt16LE, 0)
        if (magic !== MESSAGE_MAGIC) return undefined
  
        const messageId = msg.getNumber(NumberFormat.UInt8LE, 2)
        const cmd = msg.getNumber(NumberFormat.UInt8LE, 3)
        const payload = msg.slice(4)
        return <RobotMessage>{
            messageId: messageId,
            cmd: cmd,
            payload: payload
        }
    }
}