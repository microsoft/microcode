namespace accessibility {
    /**
     * Notifies web application about the current content.
     */
    //% shim=TD_ID
    export function setLiveContent(text: string) {
        control.simmessages.send("accessibility", Buffer.fromUTF8(text || ""))
    }
}