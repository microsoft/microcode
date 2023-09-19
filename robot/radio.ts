namespace microcode {
    let group = 1
    radio.setGroup(group)

    export function nextGroup() {
        group = (group + 1) % 10
        if (group === 0) group = 1
        radio.setGroup(group)
        showRadioStatus()
    }

    export function showRadioStatus() {
        basic.showNumber(group, 0)
    }

    export function sendCommand(cmd: RobotCommand, payload: Buffer) {
        const buf = createCommand(cmd, payload)
        radio.sendBuffer(buf)
    }
}