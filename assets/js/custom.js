console.debug(`loading custom sim support...`)

// send jacscript bytecode to jacdac dashboard
addSimMessageHandler("jacscript", data => {
    console.debug(`jacscript bytecode: ${data.length} bytes`)
    if (window.parent)
        window.parent.postMessage(
            {
                broadcast: true,
                source: "jacscript",
                data,
            },
            "*"
        )
})

// handle accessibility requests
function uint8ArrayToString(input) {
    let len = input.length
    let res = ""
    for (let i = 0; i < len; ++i) res += String.fromCharCode(input[i])
    return res
}
let liveRegion
const liveStrings = {
    hud: "head over display",
    insertion_point: "empty tile",

    when: "when empty tile",
    do: "do empty tile",

    "S1": "always",
    "S2": "press",
    "S3": "accelerometer",
    "S4": "timer",
    "S5": "light",
    "S6": "temp",
    "S7": "radio receive",
    "S8": "microphone",

    // filters for TID_SENSOR_PRESS
    "F0": "pin 0",
    "F1": "pin 1",
    "F2": "pin 2",
    "F3": "button A",
    "F4": "button A",
    "F5": "button A + B",
    // F6
    "F7": "logo",
    "F8": "value 1",
    "F9": "value 2",
    "F10": "value 3",
    "F11": "value 4",
    "F12": "value 5",
    "F13": "timespan short",
    "F14": "timespan long",
    "F15": "loud",
    "F16": "quiet",
    "F17": "accelerometer",
    "F17_shake": "shake",
    "F17_freefall": "freefall",
    "F17_tilt_up": "tilt up",
    "F17_tilt_down": "tilt down",
    "F17_tilt_left": "tilt left",
    "F17_tilt_right": "tilt right",

    "A1": "switch page",
    "A2": "speaker",
    "A3": "microphone",
    "A4": "music",
    "A5": "paint",
    "A6": "radio send",

    "M1": "page 1",
    "M2": "page 2",
    "M3": "page 3",
    "M4": "page 4",
    "M5": "page 5",

    "M6": "value 1",
    "M7": "value 2",
    "M8": "value 3",
    "M9": "value 4",
    "M10": "value 5",

    "M11": "on",
    "M12": "off",

    "M15": "icon editor",
    "M16": "red",
    "M17": "darl purple",
    "M18": "music editor",

    "M19giggle": "emoji giggle",
    "M19happy": "emoji happy",
    "M19hello": "emoji hello",
    "M19mysterious": "emoji mysterious",
    "M19sad": "emoji sad",
    "M19slide": "emoji slide",
    "M19soaring": "emoji soaring",
    "M19spring": "emoji spring",
    "M19twinkle": "emoji twinkle",
    "M19yawn": "emoji yawn",
}

addSimMessageHandler("accessibility", data => {
    const valueId = uint8ArrayToString(data)
    const value = (liveStrings[valueId] || valueId).split(/_/g).join(" ")

    console.log(`live region: ${valueId} -> ${value}`)

    if (!liveRegion) {
        const style =
            "position: absolute !important;" +
            "display: block;" +
            "visibility: visible;" +
            "overflow: hidden;" +
            "width: 1px;" +
            "height: 1px;" +
            "margin: -1px;" +
            "border: 0;" +
            "padding: 0;" +
            "clip: rect(0 0 0 0);"
        liveRegion = document.createElement("div")
        liveRegion.setAttribute("role", "status")
        liveRegion.setAttribute("aria-live", "polite")
        liveRegion.setAttribute("aria-hidden", "false")
        liveRegion.setAttribute("style", style)
        document.body.appendChild(liveRegion)
    }
    if (liveRegion.textContent !== value) liveRegion.textContent = value
})
