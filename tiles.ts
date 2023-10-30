namespace microcode {
    export function diskSlots() {
        return ["disk1", "disk2", "disk3"]
    }

    export class IconFieldEditor extends FieldEditor {
        init() {
            return img`
        . . . . .
        . 1 . 1 .
        . . . . . 
        1 . . . 1
        . 1 1 1 .
        `
        }
        clone(img: Image) {
            return img.clone()
        }
        editor(
            field: any,
            picker: Picker,
            onHide: () => void,
            onDelete?: () => void
        ) {
            iconEditor(field, picker, onHide, onDelete)
        }
        toImage(field: any) {
            return icondb.renderMicrobitLEDs(field)
        }
        toBuffer(img: Image) {
            const ret = Buffer.create(4)
            for (let index = 0; index < 25; index++) {
                let byte = index >> 3
                let bit = index & 7
                let col = index % 5
                let row = Math.idiv(index, 5)
                ret[byte] |= img.getPixel(col, row) << bit
            }
            return ret
        }
        fromBuffer(br: BufferReader) {
            const buf = br.readBuffer(4)
            const img = image.create(5, 5)
            for (let index = 0; index < 25; index++) {
                let byte = index >> 3
                let bit = index & 7
                let col = index % 5
                let row = Math.idiv(index, 5)
                img.setPixel(col, row, (buf[byte] >> bit) & 1)
            }
            return img
        }
    }

    export class ModifierEditor {
        constructor(public tid: number) {}
        fieldEditor: FieldEditor
        getField(): any {
            return null
        }
        getIcon(): string | Image {
            return null
        }
        getNewInstance(field: any = null): ModifierEditor {
            return null
        }
        serviceCommandArg(): Buffer {
            return null
        }
    }

    export class IconEditor extends ModifierEditor {
        field: Image
        firstInstance: boolean
        constructor(field: Image = null) {
            super(Tid.TID_MODIFIER_ICON_EDITOR)
            this.firstInstance = false
            this.fieldEditor = new IconFieldEditor()
            this.field = this.fieldEditor.clone(
                field ? field : this.fieldEditor.init()
            )
        }

        getField() {
            return this.field
        }

        getIcon(): string | Image {
            return this.firstInstance
                ? getIcon(Tid.TID_MODIFIER_ICON_EDITOR)
                : this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: any = null) {
            return new IconEditor(field ? field : this.field.clone())
        }

        serviceCommandArg() {
            const buf = Buffer.create(5)
            for (let col = 0; col < 5; ++col) {
                let v = 0
                for (let row = 0; row < 5; ++row) {
                    if (this.field.getPixel(col, row)) v |= 1 << row
                }
                buf[col] = v
            }
            return buf
        }
    }

    export interface Melody {
        notes: string
        tempo: number
    }

    export const MELODY_LENGTH = 4
    export const NUM_NOTES = 5

    //export const noteNames = ["C", "D", "E", "F", "G", "A", "B", "C", "D"]

    export function setNote(buf: Buffer, offset: number, note: string) {
        const noteToFreq: { [note: string]: number } = {
            "0": 261.63, // C4
            "1": 293.66, // D4
            "2": 329.63, // E4
            "3": 349.23, // F4
            "4": 392.0, // G4
            "5": 440.0, // A4
            "6": 493.88, // B4
            "7": 523.25, // C5
            "8": 587.33, // D5
        }

        const period = 1000000 / (note !== "." ? noteToFreq[note] : 1000)
        const duty = note === "." ? 0 : (period * 0.5) / 2
        const duration = 250
        buf.setNumber(NumberFormat.UInt16LE, offset + 0, period)
        buf.setNumber(NumberFormat.UInt16LE, offset + 2, duty)
        buf.setNumber(NumberFormat.UInt16LE, offset + 4, duration)
    }

    export class MelodyFieldEditor extends FieldEditor {
        init() {
            return { notes: `0240`, tempo: 120 }
        }
        clone(melody: Melody) {
            return { notes: melody.notes.slice(0), tempo: melody.tempo }
        }
        editor(
            field: any,
            picker: Picker,
            onHide: () => void,
            onDelete?: () => void
        ) {
            melodyEditor(field, picker, onHide, onDelete)
        }
        toImage(field: any) {
            return icondb.melodyToImage(field)
        }
        toBuffer(melody: Melody) {
            const buf = Buffer.create(3)
            buf.setUint8(0, melody.tempo)
            // convert the melody notes into list of integers
            const notes = melody.notes.split("")
            // fill the buffer with the notes, 4 bits for each note
            for (let i = 0; i < MELODY_LENGTH; i++) {
                const byte = i >> 1
                const bit = (i & 1) << 2
                if (notes[i] != ".") {
                    const note = (parseInt(notes[i]) || 0) + 1
                    buf.setUint8(
                        byte + 1,
                        buf.getUint8(byte + 1) | (note << bit)
                    )
                }
            }
            return buf
        }
        fromBuffer(br: BufferReader) {
            const buf = br.readBuffer(3)
            const tempo = buf[0]
            let notes = ""
            // read the notes from the buffer
            for (let i = 0; i < MELODY_LENGTH; i++) {
                const byte = i >> 1
                const bit = (i & 1) << 2
                const note = (buf[byte + 1] >> bit) & 0xf
                notes += note == 0 ? "." : (note - 1).toString()
            }
            return { tempo, notes }
        }
    }

    export class MelodyEditor extends ModifierEditor {
        field: Melody
        firstInstance: boolean
        constructor(field: Melody = null) {
            super(Tid.TID_MODIFIER_MELODY_EDITOR)
            this.firstInstance = false
            this.fieldEditor = new MelodyFieldEditor()
            this.field = this.fieldEditor.clone(
                field ? field : this.fieldEditor.init()
            )
        }

        getField() {
            return this.field
        }

        getIcon(): string | Image {
            return this.firstInstance
                ? getIcon(Tid.TID_MODIFIER_MELODY_EDITOR)
                : this.fieldEditor.toImage(this.field)
        }

        getNewInstance(field: any = null) {
            return new MelodyEditor(
                field ? field : this.fieldEditor.clone(this.field)
            )
        }

        serviceCommandArg() {
            const buf = Buffer.create(6 * 8)
            for (let i = 0; i < MELODY_LENGTH; i++) {
                setNote(buf, i * 6, this.field.notes[i])
            }
            return buf
        }
    }

    export function getEditor(tid: Tid, first = true) {
        if (tid == Tid.TID_MODIFIER_ICON_EDITOR) {
            const iconEditorTile = new IconEditor()
            iconEditorTile.firstInstance = first
            return iconEditorTile
        } else if (tid == Tid.TID_MODIFIER_MELODY_EDITOR) {
            const melodyEditorTile = new MelodyEditor()
            melodyEditorTile.firstInstance = first
            return melodyEditorTile
        }
        return undefined
    }

    export function getNewInstance(tile: Tile) {
        if (tile instanceof ModifierEditor) {
            return tile.getNewInstance()
        }
        return undefined
    }
}
