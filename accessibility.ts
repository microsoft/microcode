namespace accessibility {
    /**
     * Notifies web application about the current content.
     */
    export function setLiveContent(text: string) {
        control.simmessages.send("accessibility", Buffer.fromUTF8(text || ""))
    }
}