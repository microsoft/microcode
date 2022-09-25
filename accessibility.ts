namespace accessibility {
    export interface AccessibilityMessage {
        type: "text" | "tile" | "rule"
    }

    export interface TextAccessibilityMessage {
        type: "text"
        value: string
    }

    export interface TileAccessibilityMessage {
        type: "tile"
        value: string
    }

    export interface RuleAccessibilityMessage {
        type: "rule"
        dos: string[]
        whens: string[]
    }

    /**
     * Notifies web application about the current content.
     */
    //% shim=TD_ID
    export function setLiveContent(msg: AccessibilityMessage) {
        const data = Buffer.fromUTF8(JSON.stringify(msg))
        control.simmessages.send("accessibility", data)
    }

    const liveStrings: { [id: string]: string } = {
        //hud: "head over display",
        //insertion_point: "empty tile",

        //when: "add tile",
        //do: "add tile",
        reset: "restart",

        S1: "always",
        S2: "press",
        S2B: "release",
        S3: "accelerometer",
        S4: "timer",
        S5: "light",
        S6: "temp",
        S7: "radio receive",
        S8: "microphone",
        "rule": "rule",
        "add_rule": "add rule",

        // filters for TID_SENSOR_PRESS
        F0: "touch pin 0",
        F1: "touch pin 1",
        F2: "touch pin 2",
        F3: "button A",
        F4: "button B",
        // F6
        F7: "logo",
        F13: "1/4 second",
        F14: "1 second",
        F18: "1 random second",
        F19: "5 seconds",
        F15: "loud",
        F16: "quiet",
        F17: "accelerometer",
        F17_shake: "shake",
        F17_freefall: "freefall",
        F17_tilt_up: "tilt up",
        F17_tilt_down: "tilt down",
        F17_tilt_left: "tilt left",
        F17_tilt_right: "tilt right",

        C0: "editor",
        C1: "samples",

        A1: "switch page",
        A2: "sound emoji",
        A3: "microphone",
        A4: "music",
        A5: "screen",
        A6: "radio send",
        A7: "random number",

        M1: "page 1",
        M2: "page 2",
        M3: "page 3",
        M4: "page 4",
        M5: "page 5",

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

        M20A: "in pipe A",
        M20B: "in pipe B",
        M20C: "in pipe C",

        S9A: "out pipe A",
        S9B: "out pipe B",
        S9C: "out pipe C",

        N0: "editor",
        N1: "new program",
        N2: "flashing heart",
        N3: "smiley buttons",
        N4: "pet hamster",
        N5: "chuck a duck",
        N6: "reaction time",
        N7: "hot potato",
        N8: "rock paper scissors",
        N9: "head or tail",
    }
    export function ariaToTooltip(ariaId: string) {
        const s = (liveStrings[ariaId] || "").replaceAll("_", " ")
        return s.toUpperCase()
    }
}
