console.debug(`loading jacscript sim support...`)
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
