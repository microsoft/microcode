namespace pointerevents {
    export interface PointerEventMessage {
        type: "pointerdown" | "pointerup" | "pointermove"
        x: number
        y: number
        buttons: number
    }

    const contexts: ((x: number, y: number) => void)[] = []
    //% shim=TD_NOOP
    export function pushContext(click: (x: number, y: number) => void) {
        contexts.push(click)
        setup()
    }

    //% shim=TD_NOOP
    export function popContext() {
        contexts.pop()
    }

    //% shim=TD_NOOP
    function setup() {
        control.simmessages.onReceived("pointer-events", data => {
            const msg: PointerEventMessage = JSON.parse(data.toString())
            // down event!
            if (msg.type === "pointerdown" && msg.buttons) {
                const handler = contexts[contexts.length - 1]
                if (handler) handler(msg.x, msg.y)
            }
        })
    }
}
