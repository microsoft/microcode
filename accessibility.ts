namespace accessibility {
    /**
     * Notifies web application about the current content.
     */
    //% shim=TD_ID
    export function setLiveContent(accessibilityMessage: accessibilityMessage) {
        let serializedMessage = JSON.stringify({"type" : accessibilityMessage.type, "details" : accessibilityMessage.details})

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
        S2B: "release",
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
        // F6
        F7: "logo",
        F8: "1",
        F9: "2",
        F10: "3",
        F11: "4",
        F12: "5",
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
        A5: "paint",
        A6: "radio send",
        A7: "random number",

        M1: "page 1",
        M2: "page 2",
        M3: "page 3",
        M4: "page 4",
        M5: "page 5",

        M6: "1",
        M7: "2",
        M8: "3",
        M9: "4",
        M10: "5",

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
        const s = (liveStrings[ariaId] || "").replace("_", " ")
        return s.toUpperCase()
    }

    export interface accessibilityMessageDetals {
        name: string
        values: string[]
    }

    export interface accessibilityMessage {
        type: string
        details: accessibilityMessageDetals[]
    }

    export class textAccessibilityMessage implements accessibilityMessage {
        private value: string        
        type: "text"
        details: accessibilityMessageDetals[]

        constructor(text: string) {
            this.value = text
            this.type = "text"
            this.details = [{ name: "message", values: [this.value]}]
        }
    }
    
    export class tileAccessibilityMessage implements accessibilityMessage {
        private tileId: string        
        type: "tile"
        details: accessibilityMessageDetals[]

        constructor(tileId: string) {
            this.tileId = tileId
            this.type = "tile"
            this.details = [{ name: "tileId", values: [this.tileId]}]
        }
    }

    export class ruleAccessibilityMessage implements accessibilityMessage {
        private dos: string[]
        private whens: string[]        
        type: "rule"
        details: accessibilityMessageDetals[]

        constructor(dos: string[], whens: string[]) {
            this.dos = dos
            this.whens = whens
            this.type = "rule";
            this.details =
                [
                    { name: "whens", values: this.whens },
                    { name: "dos", values: this.dos }
                ]
        }
    }
}
