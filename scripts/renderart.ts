// render cup icons
const labelX = img`
f . f
f . f
. f .
f . f
f . f
`
const labelY = img`
f . f
f . f
. f .
. f .
. f .
`
const labelZ = img`
f f f
. . f
. f .
f . .
f f f
`

const cup = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . c c c c c c c . . . . .
. . . c f f f f f f f c . . . .
. . c f f f 4 5 4 f f f c . . .
. . c c f 4 5 5 5 4 f c c . . .
. . c d c c c c c c c b c . . .
. . c d 1 d d d d d d b c . . .
. . c d 1 d d d d d d b c . . .
. . c d 1 d d d d d d b c . . .
. . c d 1 d d d d d d b c . . .
. . c d 1 d d d d d d b c . . .
. . . d 1 d d d d d d b . . . .
. . . . 1 d d d d d d . . . . .
`

const inFromLeft = img`
4 4 4 4 4 4 4 . . . . . . . . .
5 5 5 5 5 5 5 4 . . . . . . . .
4 4 4 4 4 4 4 5 4 . . . . . . .
. . . . . . 4 5 4 . . . . . . .
. . . . . . 4 5 4 . . . . . . .
. . . . 4 5 5 5 5 5 4 . . . . .
. . . . . 4 5 5 5 4 . . . . . .
. . . . . . 4 5 4 . . . . . . .
`

const inFromRight = img`
. . . . . . . . . 4 4 4 4 4 4 4
. . . . . . . . 4 5 5 5 5 5 5 5
. . . . . . . 4 5 4 4 4 4 4 4 4
. . . . . . . 4 5 4 . . . . . .
. . . . . . . 4 5 4 . . . . . .
. . . . . 4 5 5 5 5 5 4 . . . .
. . . . . . 4 5 5 5 4 . . . . .
. . . . . . . 4 5 4 . . . . . .
`

const disk = img`
. . . . . . . . . . . . . . . .
. . 8 d d d d 8 8 d d 8 . . . .
. . 8 d d d d 8 8 d d 8 8 . . .
. . 8 d d d d 8 8 d d 8 8 8 . .
. . 8 d d d d d d d d 8 8 8 . .
. . 8 8 8 8 8 8 8 8 8 8 8 8 . .
. . 8 8 3 3 3 3 3 3 3 3 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . 8 8 1 1 1 1 1 1 1 1 8 8 . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`

function makeLargeDisk() {
    const ret = image.create(32, 33)
    ret.fill(6)
    ret.drawTransparentImage(disk, 8, 8)
    ret.setPixel(0, 0, 0)
    ret.setPixel(0, 32, 0)
    ret.setPixel(31, 0, 0)
    ret.setPixel(31, 32, 0)
    ret.drawLine(1, 32, 30, 32, 11)
    ret.setPixel(0, 31, 11)
    ret.setPixel(31, 31, 11)
    return ret
}
const largeDisk = makeLargeDisk()

const cupXread = cup.clone()
cupXread.drawTransparentImage(labelX, 6, 10)
const cupYread = cup.clone()
cupYread.drawTransparentImage(labelY, 6, 10)
const cupZread = cup.clone()
cupZread.drawTransparentImage(labelZ, 6, 10)

const cupXassign = cupXread.clone()
cupXassign.drawTransparentImage(inFromRight, 0, 0)
const cupYassign = cupYread.clone()
cupYassign.drawTransparentImage(inFromRight, 0, 0)
const cupZassign = cupZread.clone()
cupZassign.drawTransparentImage(inFromRight, 0, 0)

const cupXwritten = cupXread.clone()
cupXwritten.drawTransparentImage(inFromLeft, 0, 0)
const cupYwritten = cupYread.clone()
cupYwritten.drawTransparentImage(inFromLeft, 0, 0)
const cupZwritten = cupZread.clone()
cupZwritten.drawTransparentImage(inFromLeft, 0, 0)

const h = [
    ".",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
]

let src: string[] = []
function render(i: Image, n: string) {
    src.push(`export const ${n} = img\``)
    for (let y = 0; y < i.height; ++y) {
        let l = ""
        for (let x = 0; x < i.width; ++x) {
            l += h[i.getPixel(x, y)]
            l += " "
        }
        src.push(l)
    }
    src.push("`")
}

render(cupXread, "cupXread")
render(cupYread, "cupYread")
render(cupZread, "cupZread")
render(cupXassign, "cupXassign")
render(cupYassign, "cupYassign")
render(cupZassign, "cupZassign")
render(cupXwritten, "cupXwritten")
render(cupYwritten, "cupYwritten")
render(cupZwritten, "cupZwritten")
render(largeDisk, "largeDisk")

console.log(src.join("\n"))
