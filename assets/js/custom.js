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
    if (bus.connected) {
        connectEl.style.display = "none"
        document.getElementById("connectDlg").close()
    }
    else connectEl.style.display = "inherit"
    const statusText = bus.connected
        ? "micro:bit connected"
        : bus.disconnected
        ? "micro:bit connect"
        : "micro:bit connecting"
    connectEl.setAttribute("title", statusText)
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
            connectEl.tabIndex = "0"
            const mbitEl = document.createElement("img")
            mbitEl.setAttribute("alt", "micro:bit logo")
            mbitEl.setAttribute(
                "src",
                "https://cdn.sanity.io/images/ajwvhvgo/production/6aada623aed7540f77754cbd49b36f05d0fd6b86-150x89.svg?w=435&q=80&fit=max&auto=format"
            )
            connectEl.append(mbitEl)
            // create WebUSB bus
            bus = jacdac.createWebBus({
                bluetoothOptions: null,
                serialOptions: null,
            })
            // track connection state and update button
            bus.on(jacdac.CONNECTION_STATE, refreshUI)
            bus.on(jacdac.ERROR, e => console.error(e))
            // connect must be triggered by a user interaction
            connectEl.onclick = () => document.getElementById("connectDlg").showModal()

            document.getElementById("webusbBtn").onclick = async () => bus.connect()
            document.body.append(connectEl)
            refreshUI()
            bus.autoConnect = true
        }
        document.body.append(script)
    })

// send jacscript bytecode to jacdac dashboard
addSimMessageHandler("jacscript", async data => {
    console.debug(`jacscript bytecode: ${data.length} bytes`)

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

    M15: "LED editor",
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
    const serializedAccessabilityMessage = uint8ArrayToString(data)

    let accessabilityMessage = JSON.parse(serializedAccessabilityMessage)

    let value
    if (
        accessabilityMessage.type === "tile" ||
        accessabilityMessage.type === "text"
    ) {
        //console.log(serializedAccessabilityMessage)

        let valueId = accessabilityMessage.details[0]

        if (valueId) {
            valueId = valueId.values[0]

            if (valueId) {
                value = (liveStrings[valueId] || valueId).split(/_/g).join(" ")
            }
        }
    } else if (accessabilityMessage.type == "rule") {
        value = "rule"

        let whens = accessabilityMessage.details[0]

        if (whens && whens.values.length > 0) {
            value += " when"

            whens.values.forEach(tileId => {
                value += " "
                value += (liveStrings[tileId] || tileId).split(/_/g).join(" ")
            })
        }

        let dos = accessabilityMessage.details[1]

        if (dos && dos.values.length > 0) {
            value += " do"

            dos.values.forEach(tileId => {
                value += " "
                value += (liveStrings[tileId] || tileId).split(/_/g).join(" ")
            })
        }
    } else {
        console.log(
            "Error, " + serializedAccessabilityMessage + " is not supported"
        )
        return
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
    value = value || ""
    if (liveRegion.textContent === value) liveRegion.textContent = ""
    console.log(`live region: ${value}`)
    liveRegion.textContent = value
})
