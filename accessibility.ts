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

    export function ariaToTooltip(ariaId: string) {
        const tooltip = microcode.tooltips[ariaId] as string
        const s = (tooltip || "").replaceAll("_", " ")
        return s.toUpperCase()
    }
}
