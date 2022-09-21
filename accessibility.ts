namespace accessibility {
    /**
     * Notifies web application about the current content.
     */
    //% shim=TD_ID
    export function setLiveContent(accessabilityMessage: AccessabilityMessage) {
        let serializedMessage = JSON.stringify(accessabilityMessage)

        control.simmessages.send(
            "accessibility",
            Buffer.fromUTF8(serializedMessage || "")
        )
    }

    const liveStrings: { [id: string]: string } = {
        //hud: "head over display",
        //insertion_point: "empty tile",

        //when: "add tile",
        //do: "add tile",

        S1: "always",
        S2: "press",
        S3: "accelerometer",
        S4: "timer",
        S5: "light",
        S6: "temp",
        S7: "radio receive",
        S8: "microphone",

        // filters for TID_SENSOR_PRESS
        F0: "touch pin 0",
        F1: "touch pin 1",
        F2: "touch pin 2",
        F3: "button A",
        F4: "button B",
        F5: "button A + B",
        // F6
        F7: "logo",
        F8: "value 1",
        F9: "value 2",
        F10: "value 3",
        F11: "value 4",
        F12: "value 5",
        F13: "timespan short",
        F14: "timespan long",
        F15: "loud",
        F16: "quiet",
        F17: "accelerometer",
        F17_shake: "shake",
        F17_freefall: "freefall",
        F17_tilt_up: "tilt up",
        F17_tilt_down: "tilt down",
        F17_tilt_left: "tilt left",
        F17_tilt_right: "tilt right",

        A1: "switch page",
        A2: "sound emoji",
        A3: "microphone",
        A4: "music",
        A5: "paint",
        A6: "radio send",
        A7: "random number",

        M1: "page 1",
        M2: "page 2",
        M3: "page 3",
        M4: "page 4",
        M5: "page 5",

        M6: "value 1",
        M7: "value 2",
        M8: "value 3",
        M9: "value 4",
        M10: "value 5",

        M11: "on",
        M12: "off",

        M15: "LEDs",
        M18: "music",

        M19giggle: "giggle",
        M19happy: "happy",
        M19hello: "hello",
        M19mysterious: "mysterious",
        M19sad: "sad",
        M19slide: "slide",
        M19soaring: "soaring",
        M19spring: "spring",
        M19twinkle: "twinkle",
        M19yawn: "yawn",
    }
    export function ariaToTooltip(ariaId: string) {
        const s = (liveStrings[ariaId] || "").replace("_", " ")
        return s.toUpperCase()
    }

    export interface AccessabilityMessageDetals {
        name: string
        values: string[]
    }

    export interface AccessabilityMessage {
        type: string
        details: AccessabilityMessageDetals[]
    }
}
