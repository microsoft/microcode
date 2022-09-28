console.debug(`loading custom sim support...`)
const MICROCODE_PRODUCT_IDENTIFIER = 0x3e92f825

const inIFrame = (() => {
    try {
        return typeof window !== "undefined" && window.self !== window.top
    } catch (e) {
        return typeof window !== "undefined"
    }
})()

let bus
let connectEl
let lastData
const refreshUI = () => {
    const supportsWebusb = !!navigator.usb
    if (bus.connected || !supportsWebusb) {
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

function simPostMessage(channel, data) {
    const frame = document.getElementById("simframe")
    if (frame) {
        const buf = stringToUint8Array(JSON.stringify(data))
        const msg = {
            type: "messagepacket",
            channel,
            data: buf,
        }
        frame.contentWindow.postMessage(msg, document.body.dataset.simUrl)
    }
}

const reportBus = () => {
    try {
        const state = {
            selfId: bus.selfDevice.deviceId,
            devices: bus
                .devices({ announced: true, ignoreInfrastructure: true })
                .map(dev => ({
                    name: dev.name,
                    id: dev.deviceId,
                    services: dev.services().map(srv => ({
                        name: srv.name,
                        serviceClass: srv.serviceClass,
                    })),
                })),
        }
        simPostMessage("jacdacState", state)
    } catch (e) {
        console.log(e)
    }
}

function showOutdatedFirmwareDialog() {
    const outdatedDlg = document.getElementById("outdatedDlg")
    outdatedDlg.showModal()
    bus.disconnect()
}

async function flashJacscriptServices(services, data) {
    for (const service of services) await flashJacscriptService(service, data)
}

async function flashJacscriptService(service, data) {
    if (!data) return

    const dev = service.device
    await dev.resolveProductIdentifier(3)
    const productIdentifier = dev.productIdentifier

    if (productIdentifier !== MICROCODE_PRODUCT_IDENTIFIER) {
        console.debug(
            `jacscript: invalid or unknown product identifier ${productIdentifier}`
        )
        showOutdatedFirmwareDialog()
        return
    }

    await dev.resolveFirmwareVersion(3)
    const firmwareVersion = dev.firmwareVersion
    console.debug(`firmware version: ${firmwareVersion}`)
    const webFirmwareVersion = document.body.dataset.version
    const semweb = parseSemver(webFirmwareVersion)
    const semcur = parseSemver(firmwareVersion)
    if (semweb[0] > semcur[0] || semweb[1] > semcur[1]) {
        console.debug(`outdated firmware: ${firmwareVersion}`)
        showOutdatedFirmwareDialog()
        return
    }

    if (service.nodeData["bytecode"]) {
        console.trace(
            `jacscript: deployment to ${service} in progress, skipping`
        )
        return
    }

    try {
        console.debug(`jacscript: deploying to ${service}`)
        service.nodeData["bytecode"] = data
        await jacdac.OutPipe.sendBytes(
            service,
            jacdac.JacscriptManagerCmd.DeployBytecode,
            data
        )
        console.debug(`jacscript: deployed to ${service}`)
    } finally {
        service.nodeData["bytecode"] = undefined
    }

    if (data !== lastData) {
        console.debug(
            `jacscript: restarting ${service} deployment with newer bytecode`
        )
        flashJacscriptService(service, lastData)
    }
}

// docs
document.addEventListener("DOMContentLoaded", () => {
    const docsbtn = document.getElementById("docsbtn")
    if (docsbtn)
        docsbtn.onclick = () => {
            docsbtn.disabled = true
            simPostMessage("docs", {})
        }
})

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
            const conDiv = document.createElement("div")
            conDiv.style.marginTop = "0.25rem"
            conDiv.innerText = "connect"
            connectEl.append(conDiv)
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
            bus.on(jacdac.ERROR, e => {
                const code = e.code
                switch (code) {
                    case jacdac.ERROR_MICROBIT_JACDAC_MISSING: {
                        console.debug(`jacdac not detected, ask for update`)
                        showOutdatedFirmwareDialog()
                        break
                    }
                    case jacdac.ERROR_MICROBIT_V1: {
                        console.debug(`micro:bit v1 detected`)
                        showOutdatedFirmwareDialog()
                        break
                    }
                    case jacdac.ERROR_TRANSPORT_HF2_NOT_SUPPORTED: {
                        console.debug(`HF2 not supported`)
                        showOutdatedFirmwareDialog()
                        break
                    }
                }
                refreshUI()
            })
            bus.on(jacdac.DEVICE_ANNOUNCE, dev => {
                if (!lastData) return
                console.debug(`jacdac: device announced ${dev}, flashing`)
                flashJacscriptServices(
                    dev.services({
                        serviceClass: jacdac.SRV_JACSCRIPT_MANAGER,
                    }),
                    lastData
                )
            })
            bus.on(jacdac.SELF_ANNOUNCE, reportBus)
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

// send jacscript bytecode to jacdac dashboard
addSimMessageHandler("jacscript", async data => {
    console.debug(`jacscript bytecode: ${data.length} bytes`)
    lastData = data

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
        flashJacscriptServices(services, data)
    }
})

// handle accessibility requests
function uint8ArrayToString(input) {
    let len = input.length
    let res = ""
    for (let i = 0; i < len; ++i) res += String.fromCharCode(input[i])
    return res
}
function stringToUint8Array(str) {
    const encoder = new TextEncoder()
    return encoder.encode(str)
}

let liveRegion
// keep in sync with en-US.json
const liveStrings = {
    hud: "head over display",
    insertion_point: "empty tile",

    when: "when empty tile",
    do: "do empty tile",

    delete_tile: "delete tile",

    S1: "always",
    S2: "press",
    S2B: "release",
    S3: "accelerometer",
    S4: "timer",
    S5: "light",
    S6: "temp",
    S7: "radio receive",
    S8: "microphone",

    F0: "touch pin 0",
    F1: "touch pin 1",
    F2: "touch pin 2",
    F3: "button A",
    F4: "button B",

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

    C0: "MicroCode open editor",
    C1: "browse samples",

    A1: "switch page",
    A2: "speaker",
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

    M6: "value 1",
    M7: "value 2",
    M8: "value 3",
    M9: "value 4",
    M10: "value 5",

    M11: "on",
    M12: "off",

    M15: "LED",
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

    M20A: "in variable A",
    M20B: "in variable B",
    M20C: "in variable C",

    M21: "radio value",
    M22: "dice",
    M23: "minus",

    A8: "LED",

    A9A: "set variable A",
    A9B: "set variable B",
    A9C: "set variable C",

    S9A: "variable A changed",
    S9B: "variable B changed",
    S9C: "variable C changed",

    S10: "magnet detector",

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

    A20_1: "red",
    A20_2: "green",
    A20_3: "blue",
    A20_4: "purple",
    A20_5: "yellow",
    A20_6: "black",
}

// load localized strings
async function loadTranslations() {
    const url = new URL(window.location.href)
    const lang = url.searchParams.get("lang") || navigator.language
    const neutral = lang.split("-", 1)[0]
    if (/^en/.test(lang)) return // default language

    let translations
    const resp = await fetch(`./locales/${lang}/strings.json`)
    if (resp.status === 200) {
        console.debug(`loading translations for ${lang}`)
        translations = await resp.json()
    } else if (lang != neutral) {
        const resp = await fetch(`./locales/${neutral}/strings.json`)
        if (resp.status === 200) {
            console.debug(`loaded neutral translations for ${lang}`)
            translations = await resp.json()
        }
    }

    // merge translations
    Object.entries(translations || {}).forEach(
        ([key, value]) => (liveStrings[key] = value)
    )
}
loadTranslations()

function mapAriaId(ariaId) {
    return (liveStrings[ariaId] || ariaId).split(/_/g).join(" ")
}

function parseSemver(v) {
    const ver = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(v)
    if (ver) return [parseInt(ver[1]), parseInt(ver[2]), parseInt(ver[3])]
    else return [0, 0, 0]
}

addSimMessageHandler("accessibility", data => {
    // render message
    const msg = JSON.parse(uint8ArrayToString(data))
    let value
    if (msg.type === "tile" || msg.type === "text") {
        value = mapAriaId(msg.value)
    } else if (msg.type == "rule") {
        value = "rule"
        const whens = msg.whens
        if (whens && whens.length > 0)
            value += ` when ${whens.map(mapAriaId).join(" ")}`
        else value += ` when starting`
        const dos = msg.dos
        if (dos && dos.length > 0)
            value += ` do ${dos.map(mapAriaId).join(" ")}`
        else value += ` do nothing`
    }

    // apply to browser
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
    console.debug(`aria-live: ${value}`)
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
            if (c > 0) {
                ctx.fillStyle = palette[c]
                ctx.fillRect(x, y, 1, 1)
            } else {
                ctx.clearRect(x, y, 1, 1)
            }
        }
    }
    const png = canvas.toDataURL("image/png")
    return png
}

const norm = s => s.replace(/,/g, "_").replace(/\/s/g, "_").replace(/_+/g, "_")

addSimMessageHandler("docs", async data => {
    const msg = uint8ArrayToString(data)
    const jsg = JSON.parse(msg)

    const container = document.createElement("dialog")
    container.classList.add("art")

    const button = document.createElement("button")
    button.innerText = "save all"
    button.onclick = async () => {
        const dir = await window.showDirectoryPicker()
        if (!dir) return
        await Promise.all(
            jsg.map(async ({ type, name, pixels }) => {
                const png = imgToPng(pixels)
                const blob = await (await fetch(png)).blob()
                const fn = norm(`${type}_${name}.png`)
                const file = await dir.getFileHandle(fn, { create: true })
                const writable = await file.createWritable({
                    keepExistingData: false,
                })
                await writable.write(blob)
                await writable.close()
            })
        )
        // markdown docs
        const md = `## Tiles
${jsg
    .filter(({ type }) => type === "icon")
    .sort(({ name }) => name)
    .map(
        ({ type, name }) => `
### ![${mapAriaId(name)}](./images/generated/${norm(
            `${type}_${name}`
        )}.png){:class="icon"} ${mapAriaId(name)} {#${norm(`${type}_${name}`)}}

- ${type}

`
    )
    .join("")}`
        console.log(md)
        const file = await dir.getFileHandle("reference.md", { create: true })
        const writable = await file.createWritable({
            keepExistingData: false,
        })
        await writable.write(md)
        await writable.close()
        alert(`rendering done`)
    }
    container.append(button)

    jsg.forEach(({ type, name, pixels }) => {
        const fn = norm(`${type}_${name}`)
        if (!pixels) {
            console.error(`${fn} missing pixels`)
            return
        }
        const png = imgToPng(pixels)
        const img = document.createElement("img")
        img.src = png
        img.alt = fn
        const a = document.createElement("a")
        a.setAttribute("href", png)
        a.setAttribute("download", `${fn}.png`)
        a.append(img)

        container.append(a)
    })

    document.body.append(container)
    container.showModal()
})
