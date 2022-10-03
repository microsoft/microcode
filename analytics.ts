namespace microcode {
    export interface AnalyticsEvent {
        type: "event"
        msg: string
        data?: { [name: string]: string | number }
    }

    /**
     * Sends an event to analytics.
     */
    //% shim=TD_ID
    export function reportEvent(
        event: string,
        data?: { [name: string]: string | number }
    ) {
        const msg: AnalyticsEvent = {
            type: "event",
            msg: event,
        }
        if (data) msg.data = data
        const buf = Buffer.fromUTF8(JSON.stringify(msg))
        control.simmessages.send("analytics", buf)
    }
}
