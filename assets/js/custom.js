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
    connectEl.setAttribute("aria-label", statusText)
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

function showConnectDialog() {
    document.getElementById("connectDlg").showModal()
}

function showWebUSBNotSupportedDialog() {
    document.getElementById("notsupportedDlg").showModal()
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
        window.appInsights?.trackEvent({
            name: "firmware.wrongpid",
        })
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
        window.appInsights?.trackEvent({
            name: "firmware.outdated",
            firmwareVersion,
        })
        showOutdatedFirmwareDialog()
        return
    }

    if (service.nodeData["bytecode"]) {
        console.trace(
            `jacscript: deployment to ${service} in progress, skipping`
        )
        window.appInsights?.trackEvent({ name: "jacscript.deploy.concurrent" })
        return
    }

    try {
        console.debug(`jacscript: deploying to ${service}`)
        window.appInsights?.trackEvent({
            name: "firmware.deploy",
            firmwareVersion,
            bytes: data.length,
        })
        service.nodeData["bytecode"] = data
        await jacdac.OutPipe.sendBytes(
            service,
            jacdac.JacscriptManagerCmd.DeployBytecode,
            data
        )
        console.debug(`jacscript: deployed to ${service}`)
        window.appInsights?.trackEvent({
            name: "firmware.deploy.success",
        })
    } catch (e) {
        window.appInsights?.trackEvent({
            name: "firmware.deploy.fail",
        })
        window.appInsights?.trackException({
            exception: e,
        })
        throw e
    } finally {
        service.nodeData["bytecode"] = undefined
    }

    if (data !== lastData) {
        console.debug(
            `jacscript: restarting ${service} deployment with newer bytecode`
        )
        window.appInsights?.trackEvent({
            name: "firmware.deploy.redo",
        })
        flashJacscriptService(service, lastData)
    }
}

// docs
document.addEventListener("DOMContentLoaded", () => {
    const docsbtn = document.getElementById("docsbtn")
    if (docsbtn)
        docsbtn.onclick = () => {
            docsbtn.disabled = true
            simPostMessage("docs", { type: "art" })
        }
    const screenshotbtn = document.getElementById("screenshotbtn")
    if (screenshotbtn)
        screenshotbtn.onclick = () => {
            simPostMessage("docs", { type: "screenshot" })
        }

    const voicebtn = document.getElementById("voicebtn")
    if (voicebtn) {
        if (!window.speechSynthesis) voicebtn.remove()
        else
            voicebtn.onclick = () => {
                speakTooltips = !speakTooltips
                speak(liveRegion.dataset["text"] || "")
            }
    }

    if (supportedLanguages.indexOf(editorLang) > -1) {
        const fws = document.getElementsByClassName("firmware-download")
        for (let i = 0; i < fws.length; ++i)
            fws[i].setAttribute(
                "href",
                `/microcode/assets/hex/microcode-${editorLang.toLowerCase()}.hex`
            )
    }
})

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
        conDiv.setAttribute("aria-hidden", "true")
        connectEl.append(conDiv)
        const mbitEl = document.createElement("img")
        mbitEl.setAttribute("alt", "micro:bit logo")
        mbitEl.setAttribute("aria-hidden", "true")
        mbitEl.setAttribute(
            "src",
            "https://cdn.sanity.io/images/ajwvhvgo/production/6aada623aed7540f77754cbd49b36f05d0fd6b86-150x89.svg?w=435&q=80&fit=max&auto=format"
        )
        connectEl.append(mbitEl)
        // create WebUSB bus
        bus = jacdac.createWebBus({
            usbOptions: /usb=0/i.test(window.location.href) ? null : undefined,
            bluetoothOptions: null,
            serialOptions: null,
        })
        // track connection state and update button
        bus.on(jacdac.CONNECTION_STATE, refreshUI)
        bus.on(jacdac.ERROR, e => {
            window.appInsights?.trackException({ exception: e })

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
        connectEl.onclick = showConnectDialog

        document.getElementById("webusbBtn").onclick = async () => bus.connect()
        document.getElementById("webusbBtn2").onclick = async () =>
            bus.connect()
        if (!inIFrame) {
            document.getElementById("simframe").parentElement.append(connectEl)
        }
        refreshUI()
        bus.autoConnect = true

        setTimeout(() => {
            const supportsWebusb = !!navigator.usb
            if (!supportsWebusb) showWebUSBNotSupportedDialog()
            else if (!bus.connected) showConnectDialog()
        }, 2000)
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

addSimMessageHandler("usb", async data => {
    const msg = JSON.parse(uint8ArrayToString(data))
    if (msg.type === "connect") {
        console.debug(`jacdac: usb connect`)
        bus.connect()
    }
})

let liveRegion
let tooltipStrings = {}

const supportedLanguages = [
    "en",
    "ca",
    "hr",
    "fr",
    "fr-CA",
    "de",
    "it",
    "ja",
    "pl",
    "pt-BR",
    "es-ES",
    "es-MX",
    "tr",
]
const url = new URL(window.location.href)
const editorLang = (window.editor = (() => {
    let lang = url.searchParams.get("lang") || navigator.language || "en"
    if (supportedLanguages.indexOf(lang) < 0) lang = lang.split("-", 1)[0] || ""
    if (supportedLanguages.indexOf(lang) < 0) lang = "en"
    return lang
})())

async function fetchJSON(url) {
    const resp = await fetch(url)
    if (!resp.ok) return undefined
    return await resp.json()
}

// load localized strings
async function loadTranslations() {
    console.debug(`loading translations for ${editorLang}`)
    const build = document.body.dataset["build"] || "local"
    tooltipStrings =
        (await fetchJSON(
            `./assets/strings/${editorLang}/tooltips.json?v=${build}`
        )) || {}
}
let loadTranslationsPromise

window.addEventListener("DOMContentLoaded", () => {
    loadTranslationsPromise = loadTranslations()
})

function mapAriaId(ariaId) {
    return tooltipStrings[ariaId] || ""
}

function parseSemver(v) {
    const ver = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(v)
    if (ver) return [parseInt(ver[1]), parseInt(ver[2]), parseInt(ver[3])]
    else return [0, 0, 0]
}

let speakTooltips = false
let voice
function speak(text) {
    if (!text || !speakTooltips) return

    console.debug(`speak ${text}`)
    const synth = window.speechSynthesis
    synth.cancel()
    if (!voice) {
        let voices = synth.getVoices().filter(v => v.lang === editorLang)
        if (!voices.length)
            voices = synth
                .getVoices()
                .filter(v => v.lang.indexOf(editorLang) === 0)
        if (!voices.length) voices = synth.getVoices()
        voice = voices[0]
        console.debug(`voice found`, { voice })
    }
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = editorLang
    utterance.voice = voice
    utterance.rate = 1.25
    synth.speak(utterance)
    synth.resume()
}

addSimMessageHandler("accessibility", data => {
    // render message
    const msg = JSON.parse(uint8ArrayToString(data))
    let value
    const force = msg.force
    if (msg.type === "tile" || msg.type === "text") {
        value = mapAriaId(msg.value)
        speak(value)
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
    setLiveRegion(value, force)
})
const clickSound =
    typeof Howl !== "undefined"
        ? new Howl({
              src: ["./assets/sounds/click.wav", "./sounds/click.wav"],
          })
        : undefined
async function playClick() {
    if (speakTooltips || !clickSound) return
    try {
        clickSound.stop()
        clickSound.play()
    } catch (e) {
        console.debug(e)
    }
}

function setLiveRegion(value, force) {
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
    if (force && liveRegion.textContent === value) liveRegion.textContent = ""
    console.debug(`aria-live: ${value}`)
    liveRegion.dataset["text"] = value
    liveRegion.textContent = value
    playClick()
}

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
    const f = 2
    canvas.width = w * 2
    canvas.height = h * 2
    let j = 1
    for (let x = 0; x < w; ++x) {
        for (let y = 0; y < h; ++y) {
            const c = pixels[j++]
            if (c > 0) {
                ctx.fillStyle = palette[c]
                ctx.fillRect(x * f, y * f, f, f)
            } else {
                ctx.clearRect(x * f, y * f, f, f)
            }
        }
    }
    const png = canvas.toDataURL("image/png")
    return png
}

const norm = s => s.replace(/,/g, "_").replace(/\/s+/g, "_").replace(/_+/g, "_")

addSimMessageHandler("docs", async data => {
    const msg = JSON.parse(uint8ArrayToString(data))

    if (msg.type === "art") showArt(msg.images, msg.samples)
})

function showArt(jsg, samples) {
    const container = document.createElement("dialog")
    container.classList.add("art")
    const form = document.createElement("form")
    form.setAttribute("method", "dialog")
    container.append(form)
    const buttons = document.createElement("div")
    form.append(buttons)

    const button = document.createElement("button")
    button.innerText = "save"
    button.onclick = async () => {
        const dir = await window.showDirectoryPicker()
        if (!dir) return
        await Promise.all(
            jsg.map(async ({ type, name, pixels }) => {
                const png = imgToPng(pixels)
                // render image as datauri
                if (type === "image") {
                    const fn = norm(`${type}_${name}.datauri.txt`)
                    const file = await dir.getFileHandle(fn, { create: true })
                    const writable = await file.createWritable({
                        keepExistingData: false,
                    })
                    await writable.write(png)
                    await writable.close()
                }
                // render native format
                {
                    const blob = await (await fetch(png)).blob()
                    const fn = norm(`${type}_${name}.png`)
                    const file = await dir.getFileHandle(fn, { create: true })
                    const writable = await file.createWritable({
                        keepExistingData: false,
                    })
                    await writable.write(blob)
                    await writable.close()
                }
            })
        )
        // markdown samples
        const mds = `# Samples
${samples.map(
    ({ label, b64, icon }) => `
## ${label}

-  ${
        icon
            ? `![${label} icon](./images/generated/icon_sample_${norm(
                  label
              )}.png){:class="icon-sample"}`
            : "no icon"
    }
-  [Open in MicroCode](/microcode/#${compressProgram(b64)})

`
)}
`
        await writeText(dir, "samples.md", mds)
        // markdown docs
        const md = `## Tiles
${jsg
    .filter(({ type }) => type === "icon")
    .sort(({ name }) => name)
    .map(
        ({ type, name }) => `
### ![${mapAriaId(name)}](./images/generated/${norm(
            `${type}_${name}`
        )}.png){:class="icon"} \`${mapAriaId(name)}\` {#${norm(
            `${type}_${name}`
        )}}

- ${type}

`
    )
    .join("")}`
        await writeText(dir, "reference.md", md)
        window.location.reload()
    }
    buttons.append(button)

    const close = document.createElement("button")
    close.innerText = "close"
    close.onclick = () => container.close()
    buttons.append(close)

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

        form.append(a)
    })

    document.body.append(container)
    container.showModal()

    async function writeText(dir, fn, content) {
        const file = await dir.getFileHandle(fn, { create: true })
        const writable = await file.createWritable({
            keepExistingData: false,
        })
        await writable.write(content)
        await writable.close()
    }
}

addSimMessageHandler("analytics", buf => {
    const msg = JSON.parse(uint8ArrayToString(buf))
    const appInsights = window.appInsights
    if (!appInsights) return

    const properties = msg.data || {}
    properties["version"] = document.body.dataset.version
    properties["lang"] = editorLang
    if (msg.type === "event") {
        //console.debug(msg.msg, { properties })
        appInsights.trackEvent({
            name: msg.msg,
            properties,
        })
    }
})
