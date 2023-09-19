namespace microcode {
    let group = 1
    radio.setGroup(group)

    export function nextGroup() {
        group = (group + 1) % 99
        if (group === 0) group = 1
        radio.setGroup(group)
        showRadioStatus()
    }

    export function showRadioStatus() {
        led.stopAnimation()
        if (group < 10)
            basic.showNumber(group, 10)
        else
            whaleysans.showNumber(group)
    }

    export function sendCommand(cmd: RobotCommand, payload: Buffer) {
        const buf = createRobotCommand(cmd, payload)
        radio.sendBuffer(buf)
    }

    // handle radio package messages
    radio.onReceivedBuffer(buf => {
        const msg = readRobotCommand(buf)
        if (!msg) return
        const cmd = msg.cmd
        const payload = msg.payload
        switch (cmd) {
            case RobotCommand.MotorRun: {
                const left = payload.getNumber(NumberFormat.Int8LE, 0)
                const right = payload.getNumber(NumberFormat.Int8LE, 1)
                console.log(`motor run ${left} ${right}`)
                robot.motorRun(left, right)
                break
            }
            case RobotCommand.MotorStop: {
                console.log(`motor stop`)
                robot.motorStop()
                break
            }
        }
    })
}