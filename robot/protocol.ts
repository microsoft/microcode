namespace microcode {
    const MESSAGE_MAGIC = 0xf498

    export enum RobotCommand {
        SetRobotDriver = 0x0001,
        MotorRun = 0x0002,
        MotorStop = 0x0003,
    }
    export enum RobotDrivers {
        MicroMaqqueen = 0x01
    }

    export function createRobotCommand(cmd: RobotCommand, payload: Buffer) {
        const buf = pins.createBuffer(4 + payload.length)
        buf.setNumber(NumberFormat.UInt16LE, 0, MESSAGE_MAGIC)
        buf.setNumber(NumberFormat.UInt16LE, 2, cmd)
        buf.write(4, payload)
        console.log(buf.toHex())
        return buf
    }

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