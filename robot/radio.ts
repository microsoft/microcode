namespace microcode.robots {
    const MAX_GROUPS = 10
    let group = (control.deviceSerialNumber() % 9) + 1
    radio.setGroup(group)

    export function previousGroup() {
        setGroup(group === 1 ? MAX_GROUPS - 1 : group - 1)
    }

    export function nextGroup() {
        setGroup(group === MAX_GROUPS - 1 ? 1 : group + 1)
    }

    export function setGroup(newGroup: number) {
        if (newGroup < 0) newGroup += MAX_GROUPS
        group = newGroup % MAX_GROUPS
        radio.setGroup(group)
    }

    export function showRadioStatus() {
        led.stopAnimation()
        basic.showNumber(group, 10)
    }

    let nextMessageId = 0
    export function sendCommand(cmd: RobotCommand, payload: Buffer) {
        nextMessageId = (nextMessageId + 1) % 0xff
        const buf = encodeRobotMessage({
            messageId: nextMessageId,
            cmd,
            payload,
        })
        radio.sendBuffer(buf)
    }

    export function sendCompactCommand(cmd: RobotCompactCommand) {
        radio.sendNumber(cmd)
    }
}
