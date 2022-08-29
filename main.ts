// to compile with arcade.microsoft.com, the following two lines
// should be uncommented
type ImageG = Image
const onEvent = control.onEvent

// to compile with pxt-microbit (branch screen2), the above two
// lines should commented out and the following line uncommented
// const onEvent = control.onEvent2

setTimeout(() => { const app = new kojac.App(); }, 1);