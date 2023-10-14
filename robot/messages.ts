namespace microcode.robots {
    const MESSAGE_MAGIC = 0xf498

    /**
     * List of commands supported by the micro:bit robot program
     */
    export const enum RobotCommand {
        /**
         * Turn the robot left and right. Right is positive values.
         *     turnRatio: i16 [-200,200]
         *     speed: i16 %
         *     lineAssist: bool (u8)
         */
        MotorTurn = 0x02,

        /**
         * Controls the opening angle of the arm
         */
        MotorArm = 0x03,

        /**
         * Report ultrasonic distance in cm
         *     distance: f32
         */
        UltrasonicDistance = 0x10,

        /**
         * The line sensor state changed
         *      state: RobotLineState
         */
        LineState = 0x11,
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
        const messageId = control.micros()
        let cmd: RobotCommand
        let payload: Buffer
        switch (msg) {
            case RobotCompactCommand.MotorRunForwardFast:
            case RobotCompactCommand.MotorRunForward:
            case RobotCompactCommand.MotorRunBackward:
            case RobotCompactCommand.MotorStop: {
                cmd = RobotCommand.MotorTurn
                payload = Buffer.create(5)
                if (msg !== RobotCompactCommand.MotorStop) {
                    let speed = 0
                    switch (msg) {
                        case RobotCompactCommand.MotorRunForward: speed = 40; break;
                        case RobotCompactCommand.MotorRunForwardFast: speed = 100; break;
                        case RobotCompactCommand.MotorRunBackward: speed = -100; break;
                    }
                    payload.setNumber(
                        NumberFormat.Int16LE,
                        2,
                        speed
                    )
                    if (msg !== RobotCompactCommand.MotorRunForwardFast)
                        payload[4] = 1
                }
                break
            }
            case RobotCompactCommand.MotorSpinLeft:
            case RobotCompactCommand.MotorSpinRight:
            case RobotCompactCommand.MotorTurnLeft:
            case RobotCompactCommand.MotorTurnRight: {
                cmd = RobotCommand.MotorTurn
                payload = Buffer.create(5)
                let turnRatio = 0
                let speed = 100
                switch (msg) {
                    case RobotCompactCommand.MotorTurnLeft: turnRatio = -50; speed = 100; break;
                    case RobotCompactCommand.MotorTurnRight: turnRatio = 50; speed = 100; break;
                    case RobotCompactCommand.MotorSpinLeft: turnRatio = -200; speed = 70; break;
                    case RobotCompactCommand.MotorSpinRight: turnRatio = 200; speed = 70; break;
                }
                payload.setNumber(
                    NumberFormat.Int16LE,
                    0,
                    turnRatio
                )
                payload.setNumber(
                    NumberFormat.Int16LE,
                    2,
                    speed
                )
                payload[4] = 1
                break
            }
            case RobotCompactCommand.MotorArmClose:
            case RobotCompactCommand.MotorArmOpen: {
                cmd = RobotCommand.MotorArm
                payload = Buffer.create(2)
                payload.setNumber(NumberFormat.UInt16LE, 0, msg === RobotCompactCommand.MotorArmClose ? 0 : 100)
                break
            }
            default:
                return undefined
        }

        return { messageId, cmd, payload }
    }
}
