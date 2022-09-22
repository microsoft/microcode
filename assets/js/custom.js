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
    } else connectEl.style.display = "inherit"
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
            connectEl.onclick = () =>
                document.getElementById("connectDlg").showModal()

            document.getElementById("webusbBtn").onclick = async () =>
                bus.connect()
            document.getElementById("webusbBtn2").onclick = async () =>
                bus.connect()
            document.body.append(connectEl)
            refreshUI()
            bus.autoConnect = true
        }
        document.body.append(script)
    })

const naggedDevices = {}
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
        for (const service of services) {
            const dev = service.device
            const MICROCODE_PID = "3e92f825"
            const productIdentifier = dev.productIdentifier
                ? dev.productIdentifier.toString(16)
                : ""
            const firmwareVersion = dev.firmwareVersion
            const currentFirmwareVersion = document.body.dataset.version
            console.debug(
                `jacscript: deploying to ${service} (pid: ${productIdentifier}, cpid: ${MICROCODE_PID}, fw: ${firmwareVersion}, cfw: ${currentFirmwareVersion})`
            )

            if (
                !naggedDevices[dev.deviceId] &&
                (productIdentifier !== MICROCODE_PID ||
                    (currentFirmwareVersion &&
                        currentFirmwareVersion !== firmwareVersion))
            ) {
                console.debug(`outdated firmware`)
                naggedDevices[dev.deviceId] = true
                const outdatedDlg = document.getElementById("outdatedDlg")
                if (outdatedDlg) outdatedDlg.showModal()
            }

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
    F13: "quater of a second",
    F14: "one second",
    F15: "loud",
    F16: "quiet",
    F17: "accelerometer",
    F18: "1 random second",
    F19: "5 seconds",
    F17_shake: "shake",
    F17_freefall: "freefall",
    F17_tilt_up: "tilt up",
    F17_tilt_down: "tilt down",
    F17_tilt_left: "tilt left",
    F17_tilt_right: "tilt right",

    C0: "open editor",
    C1: "browse samples",

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

addSimMessageHandler("accessibility", data => {
    const serializedAccessibilityMessage = uint8ArrayToString(data)

    let accessibilityMessage = JSON.parse(serializedAccessibilityMessage)

    let value
    if (
        accessibilityMessage.type === "tile" ||
        accessibilityMessage.type === "text"
    ) {
        //console.log(serializedAccessibilityMessage)

        let valueId = accessibilityMessage.details[0]

        if (valueId) {
            valueId = valueId.values[0]

            if (valueId) {
                value = (liveStrings[valueId] || valueId).split(/_/g).join(" ")
            }
        }
    } else if (accessibilityMessage.type == "rule") {
        value = "rule"

        let whens = accessibilityMessage.details[0]

        if (whens && whens.values.length > 0) {
            value += " when"

            whens.values.forEach(tileId => {
                value += " "
                value += (liveStrings[tileId] || tileId).split(/_/g).join(" ")
            })
        }

        let dos = accessibilityMessage.details[1]

        if (dos && dos.values.length > 0) {
            value += " do"

            dos.values.forEach(tileId => {
                value += " "
                value += (liveStrings[tileId] || tileId).split(/_/g).join(" ")
            })
        }
    } else {
        console.log(
            "Error, " + serializedAccessibilityMessage + " is not supported"
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

function hexToUint8Array(hex) {
    const bytes = new Uint8Array(Math.ceil(hex.length / 2))
    for (let i = 0; i < bytes.length; i++)
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
    return bytes
}

async function delay(ms = 100) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const palette = [
    "#000000",
    "#ffffff",
    "#ff2121",
    "#ff93c4",
    "#ff8135",
    "#fff609",
    "#249ca3",
    "#78dc52",
    "#003fad",
    "#87f2ff",
    "#8e2ec4",
    "#a4839f",
    "#5c406c",
    "#e5cdc4",
    "#91463d",
    "#000000",
]
function imgToPng(hex) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const pixels = hexToUint8Array(hex)
    const w = pixels[0]
    const h = (pixels.length - 1) / w
    canvas.width = w
    canvas.height = h
    let j = 1
    for (let x = 0; x < w; ++x) {
        for (let y = 0; y < h; ++y) {
            const c = pixels[j++]
            ctx.fillStyle = palette[c]
            ctx.fillRect(x, y, 1, 1)
        }
    }
    const png = canvas.toDataURL("image/png")
    return png
}

addSimMessageHandler("docs", async data => {
    const msg = uint8ArrayToString(data)
    const jsg = JSON.parse(msg)

    switch (jsg.type) {
        case "image": {
            const name = jsg.name
            const png = imgToPng(jsg.pixels)
            const a = document.createElement("a")
            a.setAttribute("href", png)
            a.setAttribute("download", `${name}.png`)
            document.body.append(a)
            a.click()

            await delay()
        }
    }
})
