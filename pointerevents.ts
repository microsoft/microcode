namespace pointerevents {
    export interface PointerEventMessage {
        type: "pointerdown" | "pointerup" | "pointermove"
        x: number
        y: number
        buttons: number
    }

    export let onClick: (x: number, y: number) => void = (x, y) =>
        console.log(`click ${x}, ${y}`)

    //% shim=TD_NOOP
    export function setup() {
        control.simmessages.onReceived("pointer-events", data => {
            const msg: PointerEventMessage = JSON.parse(data.toString())
            console.log(`pointer: ${msg.type} buttons ${msg.buttons}`)
            // down event!
            if (msg.type === "pointerdown" && msg.buttons) {
                if (onClick) onClick(msg.x, msg.y)
            }
        })
    }
}
