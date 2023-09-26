namespace microcode.robots {
    const MESSAGE_MAGIC = 0xf498

    /**
     * List of commands supported by the micro:bit robot program
     */
    export const enum RobotCommand {
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
        UltrasonicDistance = 0x10,
    }

    /**
     * Compact commands through radio numbers
     */
    export const enum RobotCompactCommand {
        MotorRunForward = 0xfffff001,
        MotorRunBackward = 0xfffff002,
        MotorTurnLeft = 0xfffff003,
        MotorTurnRight = 0xfffff004,
        MotorStop = 0xfffff005,

        Obstacle1 = 0xfffff11,
        Obstacle2 = 0xfffff12,
        Obstacle3 = 0xfffff13,
        Obstacle4 = 0xfffff14,
        Obstacle5 = 0xfffff15,
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
            payload: payload,
        }
    }

    /**
     * Decode compact radio message
     */
    export function decodeRobotCompactCommand(msg: number): RobotMessage {
        msg = msg >> 0
        const messageId = control.micros()
        let cmd: RobotCommand
        let payload: Buffer
        switch (msg) {
            case RobotCompactCommand.MotorRunForward:
            case RobotCompactCommand.MotorRunBackward:
            case RobotCompactCommand.MotorStop: {
                cmd = RobotCommand.MotorRun
                payload = Buffer.create(2)
                if (msg !== RobotCompactCommand.MotorStop)
                    payload.setNumber(
                        NumberFormat.Int16LE,
                        0,
                        msg === RobotCompactCommand.MotorRunForward ? 100 : -100
                    )
                break
            }
            case RobotCompactCommand.MotorTurnLeft:
            case RobotCompactCommand.MotorTurnRight: {
                cmd = RobotCommand.MotorTurn
                payload = Buffer.create(2)
                payload.setNumber(
                    NumberFormat.Int16LE,
                    0,
                    msg === RobotCompactCommand.MotorTurnRight ? 100 : -100
                )
                break
            }
            default:
                return undefined
        }

        return { messageId, cmd, payload }
    }
}
