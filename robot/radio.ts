namespace microcode.robots {
    const MAX_GROUPS = 100
    let group = control.deviceSerialNumber() % 99 + 1
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
    }

    export function showRadioStatus() {
        led.stopAnimation()
        if (group < 10)
            basic.showNumber(group, 10)
        else
            whaleysans.showNumber(group)
    }

    let nextMessageId = 0
    export function sendCommand(cmd: RobotCommand, payload: Buffer) {
        nextMessageId = (nextMessageId + 1) % 0xff
        const buf = encodeRobotMessage({ messageId: nextMessageId, cmd, payload })
        radio.sendBuffer(buf)
    }
}