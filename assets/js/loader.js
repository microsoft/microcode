var channelHandlers = {}

function addSimMessageHandler(
    channel /* string */,
    handler /* (msg: Uint8Array) => void */,
    init /* (props: { send: (msg: Uint8Array) => void }) => void */
) {
    channelHandlers[channel] = {
        channel: channel,
        init: init,
        handler: handler,
    }
}

function makeCodeRun(options) {
    var code = ""
    var isReady = false
    var simState = {}
    var simStateChanged = false
    var started = false
    var meta = undefined

    // hide scrollbar
    window.scrollTo(0, 1)
    // init runtime
    initSimState()
    fetchCode()

    // helpers
    function fetchCode() {
        sendReq(options.js, function (c, status) {
            if (status != 200) return
            code = c
            // find metadata
            code.replace(/^\/\/\s+meta=([^\n]+)\n/m, function (m, metasrc) {
                meta = JSON.parse(metasrc)
            })
            document.body.dataset.version = meta.version
            document.body.dataset.simUrl = meta.simUrl
            const vel = document.getElementById("version")
            if (meta.version && vel) {
                const ap = document.createElement("a")
                ap.download = `microcode.${meta.version}.hex`
                ap.href =
                    "https://microsoft.github.io/microcode/assets/firmware.hex"
                ap.innerText = meta.version
                vel.appendChild(ap)
            }
            // load simulator with correct version
            const simUrl = new URL(meta.simUrl)
            simUrl.searchParams.set("background-color", "3f3f3f")
            simUrl.searchParams.set("button-stroke", "212121")
            simUrl.searchParams.set("button-fill", "2d2d2d")
            simUrl.searchParams.set("text-color", "d9d9d9")
            simUrl.searchParams.set("pointer-events", "1")
            simUrl.searchParams.set("hideSimButtons", "1")
            document
                .getElementById("simframe")
                .setAttribute("src", simUrl.toString())
        })
    }

    function startSim() {
        if (!code || !isReady || started) return
        setState("run")
        started = true
        const runMsg = {
            type: "run",
            parts: [],
            code: code,
            partDefinitions: {},
            cdnUrl: meta.cdnUrl,
            version: meta.target,
            storedState: simState,
            frameCounter: 1,
            options: {
                theme: "green",
                player: "",
            },
            id: "green-" + Math.random(),
        }
        postMessage(runMsg)
    }

    function stopSim() {
        setState("stopped")
        postMessage({
            type: "stop",
        })
        started = false
    }

    window.addEventListener(
        "message",
        function (ev) {
            var d = ev.data
            if (d.type == "ready") {
                var loader = document.getElementById("loader")
                if (loader) loader.remove()
                isReady = true
                startSim()
            } else if (d.type == "simulator") {
                switch (d.command) {
                    case "restart":
                        stopSim()
                        startSim()
                        break
                    case "setstate":
                        if (d.stateValue === null) delete simState[d.stateKey]
                        else simState[d.stateKey] = d.stateValue
                        simStateChanged = true
                        break
                }
            } else if (d.type === "messagepacket" && d.channel) {
                const ch = channelHandlers[d.channel]
                if (ch) {
                    try {
                        const buf = d.data
                        ch.handler(buf)
                        // const str = uint8ArrayToString(buf);
                        // const data = JSON.parse(str)
                        // ch.handler(data);
                    } catch (e) {
                        console.log(`invalid simmessage`)
                        console.log(e)
                    }
                }
            }
        },
        false
    )

    // initialize simmessages
    Object.keys(channelHandlers)
        .map(k => channelHandlers[k])
        .filter(ch => !!ch.start)
        .forEach(ch => {
            const send = msg =>
                postMessage({
                    type: "messagepacket",
                    channel: ch.channel,
                    data: msg,
                })
            ch.start({ send })
        })

    // helpers
    function setState(st) {
        var r = document.getElementById("root")
        if (r) r.setAttribute("data-state", st)
    }

    function postMessage(msg) {
        const frame = document.getElementById("simframe")
        if (frame) frame.contentWindow.postMessage(msg, meta.simUrl)
    }

    function sendReq(url, cb) {
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                cb(xhttp.responseText, xhttp.status)
            }
        }
        xhttp.open("GET", url, true)
        xhttp.send()
    }

    function initSimState() {
        const saveSlotKey = "S/sa"
        try {
            simState = JSON.parse(localStorage["microcode-simstate"])
        } catch (e) {
            simState = {}
        }

        const importState = () => {
            const hash = window.location.hash.replace(/^#/, "")
            const currentProgram = simState[saveSlotKey] || ""
            if (hash && currentProgram !== hash) {
                console.debug(`importing program from hash`, { hash })
                simState[saveSlotKey] = hash
                simStateChanged = true
                saveState()
                window.location.hash = ''
                window.location.reload()
            }
        }

        const saveState = () => {
            if (simStateChanged) {
                localStorage["microcode-simstate"] = JSON.stringify(simState)
                const currentProgram = simState[saveSlotKey] || ""
                window.history.pushState(
                    simState,
                    undefined,
                    `#${currentProgram}`
                )
            }
            simStateChanged = false
        }

        window.addEventListener("hashchange", importState, false)
        importState()
        setInterval(saveState, 200)
    }
}
