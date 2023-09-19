const MESSAGE_MAGIC = 0xf498

let group = 1
radio.setGroup(group)

function showStatus() {
    basic.showNumber(group, 0)
}
// show status
basic.forever(() => {
    showStatus()
    basic.pause(1000)
})

// configure group using button A, cycle through groups 1-9
input.onButtonPressed(Button.A, () => {
    group = (group + 1) % 10
    if (group === 0) group = 1
    radio.setGroup(group)
    showStatus()
})

enum RobotCommand {
    SetRobotDriver = 0x0001,
    MotorRun = 0x0002,
    MotorStop = 0x0003,
}
enum RobotDrivers {
    MicroMaqqueen = 0x01
}

interface Robot {
    /*
    Set the power on motors
    */
    motorRun(left: number, right: number): void;
    /**
     * Stop and brake
     */
    motorStop(): void;
}

class DebugRobot implements Robot {
    motorRun(left: number, right: number): void {
        console.log(`motor run ${left}, ${right}`)
        basic.showString("M")
    }
    motorStop() {
        console.log(`motor stop`)
    }
}

class MicroMaqqueenRobot implements Robot {
    motorRun(left: number, right: number): void {
        if (left === right) {
            if (left === 0)
                maqueen.motorStop(maqueen.Motors.All)
            else {
                const dir = left < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW
                maqueen.motorRun(maqueen.Motors.All, dir, left)
            }
        } else {
            if (left === 0)
                maqueen.motorStop(maqueen.Motors.M1)
            else
                maqueen.motorRun(maqueen.Motors.M1, left < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW, left)
            if (right === 0)
                maqueen.motorStop(maqueen.Motors.M2)
            else
                maqueen.motorRun(maqueen.Motors.All, right < 0 ? maqueen.Dir.CCW : maqueen.Dir.CW, right)
        }
    }
    motorStop() {
        maqueen.motorStop(maqueen.Motors.All)
    }
}

let robot: Robot = new DebugRobot()

function setRobotDriver(type: RobotDrivers) {
    switch (type) {
        case RobotDrivers.MicroMaqqueen:
            robot = new MicroMaqqueenRobot()
            break
        default:
            // unknown ignore
            return
    }
    robot.motorRun(0, 0)
}


// handle radio package messages
radio.onReceivedBuffer(msg => {
    const magic = msg.getNumber(NumberFormat.UInt16LE, 0)
    if (magic !== MESSAGE_MAGIC) return; // ignore
    const cmd = msg.getNumber(NumberFormat.UInt16LE, 2)
    switch (cmd) {
        case RobotCommand.SetRobotDriver: {
            setRobotDriver(msg[4])
            break
        }
        case RobotCommand.MotorRun: {
            const left = msg[4]
            const right = msg[5]
            console.log(`run ${left} ${right}`)
            robot.motorRun(left, right)
            break
        }
        case RobotCommand.MotorStop: {
            robot.motorStop()
        }
    }
})

function createCommand(cmd: RobotCommand, payload: Buffer) {
    const buf = pins.createBuffer(4 + payload.length)
    buf.setNumber(NumberFormat.UInt16LE, 0, MESSAGE_MAGIC)
    buf.setNumber(NumberFormat.UInt16LE, 2, cmd)
    buf.write(4, payload)
    console.log(buf.toHex())
    return buf
}

// debug
input.onButtonPressed(Button.AB, () => {
    radio.sendBuffer(createCommand(RobotCommand.SetRobotDriver, Buffer.fromArray([RobotDrivers.MicroMaqqueen])))
    while (true) {
        const a = input.acceleration(Dimension.X)
        const b = input.acceleration(Dimension.Y)
        const payload = Buffer.create(2)
        payload.setNumber(NumberFormat.Int16LE, 0, a / 4)
        payload.setNumber(NumberFormat.Int16LE, 1, b / 4)
        radio.sendBuffer(createCommand(RobotCommand.MotorRun, payload))
        pause(100)
    }
})
