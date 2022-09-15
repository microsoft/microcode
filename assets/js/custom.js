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
let liveStrings = {
    hud: "head over display",
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
