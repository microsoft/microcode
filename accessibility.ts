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
        sensors: "when",
        actuators: "do",

        S1: "start",
        S2: "press",
        S2B: "release",
        S3: "move",
        S4: "repeat timer",
        S5: "light",
        S6: "temperature",
        S7: "radio receive",
        S8: "hear",
        rule: "rule",
        add_rule: "add rule",

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

        M20A: "get variable A's value",
        M20B: "get variable B's value",
        M20C: "get variable C's value",

        A9A: "set variable A's value",
        A9B: "set variable B's value",
        A9C: "set variable C's value",

        S9A: "variable A changed",
        S9B: "variable B changed",
        S9C: "variable C changed",

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
        N10: "clap lights",

        A20_1: "red",
        A20_2: "green",
        A20_3: "blue",
        A20_4: "purple",
        A20_5: "yellow",
        A20_6: "black",        
    }
    export function ariaToTooltip(ariaId: string) {
        const s = (liveStrings[ariaId] || "").replaceAll("_", " ")
        return s.toUpperCase()
    }
}
