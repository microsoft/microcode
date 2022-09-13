const fs = require("fs")

const notes = {
    "C4": 261.63,
    "C4#": 277.18,
    "D4": 293.66,
    "E4b": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "F4#": 369.99,
    "G4": 392.00,
    "A4b": 415.30,
    "A4": 440.00,
    "B4b": 466.16,
    "B4": 493.88,
    "C5": 523.25,
    "C5#": 554.37,
    "D5": 587.33,
    "D5#": 622.25,
    "E5": 659.25,
    "F5": 698.46,
    "F5#": 739.99,
    "G5": 783.99,
    "G5#": 830.61,
    "A5": 880.00,
    "A5#": 932.33,
    "B5": 987.77,
    "C6": 1046.50,
}


function gen() {
    let buf = Buffer.alloc(100)
    let p = 0
    for (const n of Object.keys(notes)) {
        if (n.endsWith("#") || n.endsWith("b"))
            continue
        buf.writeUInt16LE(Math.round(1000000 / notes[n]), p)
        p += 2
    }
    buf = buf.slice(0, p)
    console.log(buf.toString("hex"))
}

gen()