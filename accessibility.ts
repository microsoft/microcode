namespace accessibility {
    export interface AccessibilityMessage {
        type: "text" | "tile" | "rule"
        force?: boolean
    }

    export interface TextAccessibilityMessage extends AccessibilityMessage {
        type: "text"
        value: string
    }

    export interface TileAccessibilityMessage extends AccessibilityMessage {
        type: "tile"
        value: string
        tooltip: string
    }

    export interface RuleAccessibilityMessage extends AccessibilityMessage {
        type: "rule"
        dos: string[]
        whens: string[]
    }

    /**
     * Notifies web application about the current content.
     */
    //% shim=TD_ID
    export function setLiveContent(msg: AccessibilityMessage) {
        const data = Buffer.fromUTF8(JSON.stringify(msg))
        control.simmessages.send("accessibility", data)
    }

    //% shim=TD_NOOP
    export function init() {
        control.simmessages.onReceived("loc", data => {
            console.log(`received locs`)
            const strings = JSON.parse(data.toString())
            console.log(strings)
            Object.keys(strings).forEach(
                k => (microcode.tooltips[k] = strings[k])
            )
        })
        control.simmessages.send("loc", Buffer.fromUTF8("{}"))
    }

    export function resolveTooltip(id: string) {
        const tooltip = microcode.tooltips[id] as string
        const s = tooltip || ""
        return s
    }

    export function ariaToTooltip(ariaId: string) {
        return resolveTooltip(ariaId).replaceAll("_", " ").toUpperCase()
    }
}
