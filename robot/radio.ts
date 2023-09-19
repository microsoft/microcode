namespace microcode {
    const MAX_GROUPS = 100
    let group = 1
    radio.setGroup(group)

    export function previousGroup() {
        setGroup(group === 1 ? MAX_GROUPS - 1 : group - 1)
    }

    export function nextGroup() {
        setGroup(group === MAX_GROUPS - 1 ? 1 : group + 1)
    }

    export function setGroup(newGroup: number) {
        if (newGroup < 0)
            newGroup += MAX_GROUPS
        group = newGroup % MAX_GROUPS
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
                const left = Math.clamp(-255, 255, payload.getNumber(NumberFormat.Int16LE, 0))
                const right = Math.clamp(-255, 255, payload.getNumber(NumberFormat.Int16LE, 2))
                console.log(`motor run ${left} ${right}`)
                robot.motorRun(left, right)
                break
            }
        }
    })
}