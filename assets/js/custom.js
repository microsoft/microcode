console.debug(`loading custom sim support...`)

const inIFrame = (() => {
    try {
        return typeof window !== "undefined" && window.self !== window.top
    } catch (e) {
        return typeof window !== "undefined"
    }
})()

let bus
let connectEl
const refreshUI = () => {
    connectEl.innerText = bus.connected
        ? "micro:bit connected 🎉"
        : bus.disconnected
        ? "micro:bit connect"
        : "micro:bit connecting 👀"
    console.log(connectEl.innerText)
}

// to support downloading directly to device
if (!inIFrame)
    document.addEventListener("DOMContentLoaded", () => {
        const script = document.createElement("script")
        script.setAttribute("type", "text/javascript")
        script.setAttribute("src", "https://unpkg.com/jacdac-ts/dist/jacdac.js")
        script.onload = () => {
            console.log(`jacdac: init...`)
            connectEl = document.createElement("button")
            connectEl.id = "connectbtn"
            // create WebUSB bus
            bus = jacdac.createWebBus()
            // track connection state and update button
            bus.on(jacdac.CONNECTION_STATE, refreshUI)
            bus.on(jacdac.ERROR, e => console.error(e))
            // connect must be triggered by a user interaction
            connectEl.onclick = async () =>
                bus.connected ? bus.disconnect() : bus.connect()
            document.body.append(connectEl)
            refreshUI()
            bus.autoConnect = true
        }
        document.body.append(script)
    })

// send jacscript bytecode to jacdac dashboard
let deployDebouncer = false
addSimMessageHandler("jacscript", async data => {
    console.debug(`jacscript bytecode: ${data.length} bytes`)

    // lock deploy
    if (deployDebouncer) {
        console.debug(`jacscript deploy cancelled, dup deploy`)
        return
    }
    deployDebouncer = true

    if (inIFrame)
        window.parent.postMessage(
            {
                broadcast: true,
                source: "jacscript",
                data,
            },
            "*"
        )
    if (bus) {
        const services = bus.services({
            serviceClass: jacdac.SRV_JACSCRIPT_MANAGER,
        })
        console.log({ services })
        for (const service of services) {
            console.debug(`jacscript: deploying to ${service}`)
            try {
                connectEl.innerText = "micro:bit downloading..."
                await jacdac.OutPipe.sendBytes(
                    service,
                    jacdac.JacscriptManagerCmd.DeployBytecode,
                    data
                )
                refreshUI()
            } catch {
                connectEl.innerText = "micro:bit download failed :("
            }
        }
    }

    // release lock
    setTimeout(() => { deployDebouncer = false }, 500)
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
    A2: "speaker",
    A3: "microphone",
    A4: "music",
    A5: "paint",
    A6: "radio send",

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

    M15: "icon editor",
    M16: "red",
    M17: "dark purple",
    M18: "music editor",

    M19giggle: "emoji giggle",
    M19happy: "emoji happy",
    M19hello: "emoji hello",
    M19mysterious: "emoji mysterious",
    M19sad: "emoji sad",
    M19slide: "emoji slide",
    M19soaring: "emoji soaring",
    M19spring: "emoji spring",
    M19twinkle: "emoji twinkle",
    M19yawn: "emoji yawn",
}

addSimMessageHandler("accessibility", data => {
    if (!data) {
        return
    }
    
    const serializedAccessabilityMessage = uint8ArrayToString(data)

    console.log(serializedAccessabilityMessage)

    var accessabilityMessage = JSON.parse(serializedAccessabilityMessage);

    var value;
    if (accessabilityMessage.name === "tile" || accessabilityMessage.name === "text") {

        console.log("in tile or text")

        valueId = accessabilityMessage.details[0];

        if (valueId) {
            valueId = valueId[0].tileIds[0]

            if (valueId) {

                value = (liveStrings[valueId] || valueId).split(/_/g).join(" ")
        
                console.log(`live region: ${valueId} -> ${value}`)
            } else {
                console.log(`could not parse valueid 1`)
            }                    
        } else {
            console.log(`could not parse valueid 0`)
        }
    } else if (accessabilityMessage.name == "rule") {
        value = "rule "

        console.log(`test: ${accessabilityMessage}`)

        var whens = accessabilityMessage.details[0]

        if (whens) {
            value += " when "
            
            whens.values.forEach(tileId => {
                value += " "
                value +=  (liveStrings[tileId] || tileId).split(/_/g).join(" ")
            });
        }

        var dos = accessabilityMessage.details[1]

        if (dos) {
            value += " do "
            
            dos.values.forEach(tileId => {
                value += " "
                value +=  (liveStrings[tileId] || tileId).split(/_/g).join(" ")
            });
        }

        console.log(`live region: ${value}`)
    } else {
        return;
        //console.log("Error, " + accessabilityMessage + " is not supported")
    }

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
        liveRegion.setAttribute("aria-live", "assertive")
        liveRegion.setAttribute("aria-hidden", "false")
        liveRegion.setAttribute("style", style)
        document.body.appendChild(liveRegion)
    }
    if (liveRegion.textContent === value) liveRegion.textContent = ""
    liveRegion.textContent = value
})
