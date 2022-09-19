namespace accessibility {
    /**
     * Notifies web application about the current content.
     */
    //% shim=TD_ID
    export function setLiveContent(accessabilityMessage: AccessabilityMessage) {

        let serializesMessage = JSON.stringify(accessabilityMessage);

        control.simmessages.send("accessibility", Buffer.fromUTF8(serializesMessage || ""))
    }

    export interface AccessabilityMessageDetals
    {
        name: string;
        values: string[]
    }

    export interface AccessabilityMessage 
    {
        type: string;
        details: AccessabilityMessageDetals[];
    }
}