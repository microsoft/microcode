namespace microcode.robots {
    const MAX_GROUPS = 32
    export let radioGroup = (control.deviceSerialNumber() % 9) + 1
    radio.setGroup(radioGroup)

    export function previousGroup() {
        setGroup(radioGroup === 1 ? MAX_GROUPS - 1 : radioGroup - 1)
    }

    export function nextGroup() {
        setGroup(radioGroup === MAX_GROUPS - 1 ? 1 : radioGroup + 1)
    }

    export function setGroup(newGroup: number) {
        if (newGroup < 0) newGroup += MAX_GROUPS
        radioGroup = newGroup % MAX_GROUPS
        radio.setGroup(radioGroup)
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
