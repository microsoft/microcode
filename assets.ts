namespace microcode {
    export class icons {
        static reg: { [name: string]: ImageG } = {}

        public static get(name: string, nullIfMissing = false): ImageG {
            let icon = this.reg[name]
            if (!icon && !nullIfMissing) {
                icon = this.reg["MISSING"]
            }
            return icon
        }

        public static init() {
            this.reg["cursor"] = icondb.cursor
            this.reg["stylus"] = icondb.stylus
            this.reg["button_white"] = icondb.btn_bknd_white
            this.reg["button_white_bordered"] = icondb.btn_bknd_white_bordered
            this.reg["button_beige"] = icondb.btn_bknd_beige
            this.reg["button_beige_bordered"] = icondb.btn_bknd_beige_bordered
            this.reg["button_clear"] = icondb.btn_bknd_clear
            this.reg["button_danger"] = icondb.btn_bknd_danger
            this.reg["edit"] = icondb.btn_edit
            this.reg["delete"] = icondb.btn_delete
            this.reg["cancel"] = icondb.btn_cancel
            this.reg["ok"] = icondb.btn_ok
            this.reg["plus"] = icondb.btn_plus
            this.reg["new_file"] = icondb.btn_new_file
            this.reg["log"] = icondb.btn_log
            this.reg["plot"] = icondb.btn_plot
            this.reg["dpad_left"] = icondb.btn_dpad_left
            this.reg["when"] = icondb.ui_when
            this.reg["do"] = icondb.ui_do
            this.reg["insertion_point"] = icondb.btn_insertion_point
            this.reg["next_page"] = icondb.btn_next_page
            this.reg["prev_page"] = icondb.btn_prev_page
            this.reg["MISSING"] = icondb.MISSING

            this.reg[TID_SENSOR_TIMER] = icondb.tile_timer
            this.reg[TID_SENSOR_RADIO_RECEIVE] = icondb.radio_receive
            this.reg[TID_SENSOR_PRESS] = icondb.finger_press
            this.reg[TID_SENSOR_MICROPHONE] = icondb.microphone
            this.reg[TID_SENSOR_ACCELEROMETER] = icondb.accelerometer

            this.reg[TID_FILTER_LOGO] = icondb.microbit_logo
            this.reg[TID_FILTER_PIN_0] = icondb.tile_pin_0
            this.reg[TID_FILTER_PIN_1] = icondb.tile_pin_1
            this.reg[TID_FILTER_PIN_2] = icondb.tile_pin_2
            this.reg[TID_FILTER_BUTTON_A] = icondb.tile_button_a
            this.reg[TID_FILTER_BUTTON_B] = icondb.tile_button_b
            this.reg[TID_FILTER_TIMESPAN_SHORT] = icondb.tile_timespan_short
            this.reg[TID_FILTER_TIMESPAN_LONG] = icondb.tile_timespan_long
            this.reg[TID_FILTER_VALUE_1] = icondb.tile_value_1
            this.reg[TID_FILTER_VALUE_2] = icondb.tile_value_2
            this.reg[TID_FILTER_VALUE_3] = icondb.tile_value_3
            this.reg[TID_FILTER_VALUE_4] = icondb.tile_value_4
            this.reg[TID_FILTER_VALUE_5] = icondb.tile_value_5

            this.reg[TID_FILTER_LOUD] = icondb.loud
            this.reg[TID_FILTER_QUIET] = icondb.quiet

            this.reg[TID_ACTUATOR_SWITCH_PAGE] = icondb.tile_switch_page
            this.reg[TID_ACTUATOR_PAINT] = icondb.paint
            this.reg[TID_ACTUATOR_RADIO_SEND] = icondb.radio_send
            this.reg[TID_ACTUATOR_MICROPHONE] = icondb.microphone
            this.reg[TID_ACTUATOR_SPEAKER] = icondb.speaker
            this.reg[TID_ACTUATOR_MUSIC] = icondb.music

            this.reg[TID_MODIFIER_PAGE_1] = icondb.tile_page_1
            this.reg[TID_MODIFIER_PAGE_2] = icondb.tile_page_2
            this.reg[TID_MODIFIER_PAGE_3] = icondb.tile_page_3
            this.reg[TID_MODIFIER_PAGE_4] = icondb.tile_page_4
            this.reg[TID_MODIFIER_PAGE_5] = icondb.tile_page_5

            this.reg[TID_MODIFIER_VALUE_1] = icondb.tile_value_1
            this.reg[TID_MODIFIER_VALUE_2] = icondb.tile_value_2
            this.reg[TID_MODIFIER_VALUE_3] = icondb.tile_value_3
            this.reg[TID_MODIFIER_VALUE_4] = icondb.tile_value_4
            this.reg[TID_MODIFIER_VALUE_5] = icondb.tile_value_5

            this.reg[TID_MODIFIER_ON] = icondb.tile_on
            this.reg[TID_MODIFIER_OFF] = icondb.tile_off

            this.reg[TID_MODIFIER_EMOJI_GIGGLE] = icondb.tile_page_1
            this.reg[TID_MODIFIER_EMOJI_HAPPY] = icondb.tile_page_2
            this.reg[TID_MODIFIER_EMOJI_HELLO] = icondb.tile_page_3
            this.reg[TID_MODIFIER_EMOJI_MYSTERIOUS] = icondb.tile_page_4
            this.reg[TID_MODIFIER_EMOJI_SAD] = icondb.tile_page_5
            this.reg[TID_MODIFIER_EMOJI_SLIDE] = icondb.tile_value_1
            this.reg[TID_MODIFIER_EMOJI_SOARING] = icondb.tile_value_2
            this.reg[TID_MODIFIER_EMOJI_SPRING] = icondb.tile_value_3
            this.reg[TID_MODIFIER_EMOJI_TWINKLE] = icondb.tile_value_4
            this.reg[TID_MODIFIER_EMOJI_YAWN] = icondb.tile_value_5

            this.reg[TID_FILTER_ACCEL_SHAKE] = icondb.tile_page_1
            this.reg[TID_FILTER_ACCEL_FREEFALL] = icondb.tile_page_2
            this.reg[TID_FILTER_ACCEL_TILT_UP] = icondb.tile_page_3
            this.reg[TID_FILTER_ACCEL_TILT_DOWN] = icondb.tile_page_4
            this.reg[TID_FILTER_ACCEL_TILT_LEFT] = icondb.tile_page_5
            this.reg[TID_FILTER_ACCEL_TILT_RIGHT] = icondb.tile_page_5

            // for icon editor
            this.reg[TID_MODIFIER_COLOR_RED] = icondb.tile_red
            this.reg[TID_MODIFIER_COLOR_DARKPURPLE] = icondb.tile_darkpurple

            this.reg["default"] = icondb.rc_default
        }
    }
}

// - upscale 5x5 image to 16 x 16
function scaleUp(led55: ImageG) {
    const ret = image.create(16, 16)
    ret.fill(15)
    ret.setPixel(0, 0, 0)
    ret.setPixel(15, 0, 0)
    ret.setPixel(0, 15, 0)
    ret.setPixel(15, 15, 0)
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const color = led55.getPixel(row, col) ? 2 : 15
            const nrow = 1 + row * 3,
                ncol = 1 + col * 3
            ret.setPixel(nrow, ncol, color)
            ret.setPixel(nrow + 1, ncol, color)
            ret.setPixel(nrow, ncol + 1, color)
            ret.setPixel(nrow + 1, ncol + 1, color)
        }
    }
    return ret
}

const happy5x5 = img`
        . . . . .
        . 1 . 1 .
        . . . . .
        1 . . . 1
        . 1 1 1 .
    `

const sad5x5 = img`
        . . . . .
        . 1 . 1 .
        . . . . .
        . 1 1 1 .
        1 . . . 1
    `

namespace icondb {
    export const happy = scaleUp(happy5x5)
    export const sad = scaleUp(sad5x5)

    export const MISSING = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 2 2 2 2 2 2 2 2 2 2 . . .
        . . . 2 2 . . . . . . 2 2 . . .
        . . . 2 . 2 . . . . 2 . 2 . . .
        . . . 2 . . 2 . . 2 . . 2 . . .
        . . . 2 . . . 2 2 . . . 2 . . .
        . . . 2 . . . 2 2 . . . 2 . . .
        . . . 2 . . 2 . . 2 . . 2 . . .
        . . . 2 . 2 . . . . 2 . 2 . . .
        . . . 2 2 . . . . . . 2 2 . . .
        . . . 2 2 2 2 2 2 2 2 2 2 . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const ui_when = img`
        . 7 7 7 7 7 7 7 .
        . 7 7 7 1 1 1 7 .
        . 7 7 7 1 c c 7 .
        . 7 7 1 1 1 1 7 .
        . 7 7 c c c c 7 .
        . 7 7 1 1 7 1 7 .
        . 7 1 c 1 7 1 7 .
        . 7 c 1 1 1 1 7 .
        . 7 7 c c c c 7 .
        . 7 7 7 1 1 1 7 .
        . 7 7 7 1 c c 7 .
        . 7 1 1 1 1 1 7 .
        . 7 c c c c c 7 .
        . 7 1 1 1 1 7 7 .
        . 7 c c c c 1 7 .
        . 7 7 1 1 1 1 7 .
        . 7 7 c c c 1 7 .
        . 7 1 1 1 1 c 7 .
        . 7 c c c c 7 7 .
        . 7 7 7 7 7 7 7 .
        . c c c c c c c .
    `
    export const ui_do = img`
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 1 1 8 8 .
        . 8 8 1 c c 1 8 .
        . 8 8 1 8 8 1 8 .
        . 8 8 c 1 1 c 8 .
        . 8 8 8 c c 8 8 .
        . 8 8 1 1 1 8 8 .
        . 8 1 c c c 1 8 .
        . 8 1 8 8 8 1 8 .
        . 8 1 1 1 1 1 8 .
        . 8 c c c c c 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . 8 8 8 8 8 8 8 .
        . c c c c c c c .
    `
    ///
    /// CURSOR
    ///
    export const cursor = img`
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        ..................
        .......ff.........
        .......f5ff.......
        .......f555ff.....
        ........f5555ff...
        ........f555555f..
        ........f55555f...
        .........f5555f...
        .........f5ff55f..
        ..........f..f5f..
        ..............f...
    `
    export const stylus = img`
        ...............ff..
        ..............faaf.
        .............fa33af
        ............f4533af
        ...........f4555af.
        ..........f45554f..
        .........f45554f...
        ........fe5554f....
        ........fee54f.....
        ........ffeef......
        ........ffff.......
        ...................
        ...................
        ...................
        ...................
        ...................
        ...................
        ...................
        ...................
    `
    ///
    /// BUTTON ICONS
    ///
    export const btn_play = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f . . . . . . . . .
        . . . . . f 7 f . . . . . . . .
        . . . . . f 7 7 f . . . . . . .
        . . . . . f 7 7 7 f . . . . . .
        . . . . . f 7 7 7 7 f . . . . .
        . . . . . f 7 7 7 7 7 f . . . .
        . . . . . f 7 7 7 7 f . . . . .
        . . . . . f 7 7 7 f . . . . . .
        . . . . . f 7 7 f . . . . . . .
        . . . . . f 7 f . . . . . . . .
        . . . . . f f . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_stop = img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . f f f f f f f f . . . . 
        . . . . f 2 2 2 2 2 2 f . . . . 
        . . . . f 2 2 2 2 2 2 f . . . . 
        . . . . f 2 2 2 2 2 2 f . . . . 
        . . . . f 2 2 2 2 2 2 f . . . . 
        . . . . f 2 2 2 2 2 2 f . . . . 
        . . . . f 2 2 2 2 2 2 f . . . . 
        . . . . f f f f f f f f . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
    `
    export const btn_edit = img`
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f . . . . .
        . . . . . f a 3 3 3 a f . . . .
        . . . . . f a 3 3 3 a f . . . .
        . . . . . f 4 5 5 5 4 f . . . .
        . . . . . f 4 5 5 5 4 f . . . .
        . . . . . f 4 5 5 5 4 f . . . .
        . . . . . f 4 5 5 5 4 f . . . .
        . . . . . f 4 5 5 5 4 f . . . .
        . . . . . f 4 5 5 5 4 f . . . .
        . . . . . f e e e e e f . . . .
        . . . . . . f e e e f . . . . .
        . . . . . . . f f f . . . . . .
        . . . . . . . . f . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_delete = img`
        . . . . . . . . . . . . . . . .
        . . . . . . f f f . . . . . . .
        . . . . . f . . . f . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 1 1 d d d b b f . . . .
        . . f f f f f f f f f f f . . .
        . . . f b c b c b c c f . . . .
        . . . f 1 c d c d c b f . . . .
        . . . f 1 c d c d c b f . . . .
        . . . f 1 c d c d c b f . . . .
        . . . f 1 c d c d c b f . . . .
        . . . f 1 1 d d d b b f . . . .
        . . . f 1 1 d d d b b f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const btn_cancel = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . c c . . . c c . . . .
        . . . . . c c c . c c c . . . .
        . . . . . b c c c c c b . . . .
        . . . . . . b c c c b . . . . .
        . . . . . . c c c c c . . . . .
        . . . . . c c c b c c c . . . .
        . . . . . c c b . b c c . . . .
        . . . . . b b . . . b b . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_ok = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . 7 7 . . . .
        . . . . . . . . . 7 7 7 . . . .
        . . . . . . . . 7 7 7 b . . . .
        . . . . 7 7 . 7 7 7 b . . . . .
        . . . . 7 7 7 7 7 b . . . . . .
        . . . . 7 7 7 7 b . . . . . . .
        . . . . b 7 7 b . . . . . . . .
        . . . . . b b . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_plus = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f . . . . . .
        . . . . . . f 5 5 f . . . . . .
        . . . . . . f 5 5 f . . . . . .
        . . . f f f f 5 5 f f f f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f f f f 5 5 f f f f . . .
        . . . . . . f 5 5 f . . . . . .
        . . . . . . f 5 5 f . . . . . .
        . . . . . . f f f f . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_new_file = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . . . . f f d d d f . . . .
        . . . . . f 5 f d d d f . . . .
        . . . . f 5 5 f d d d f . . . .
        . . . f f f f f d d d f . . . .
        . . . f d d d d d d d f . . . .
        . . . f d d d d d d d f . . . .
        . . . f d d d d d d d f . . . .
        . . . f d d d d d d d f . . . .
        . . . f d d d d d d d f . . . .
        . . . f f f f f f f f f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_insertion_point = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . 1 1 1 1 1 1 . . . . .
        . . . . . 1 1 1 1 1 1 . . . . .
        . . . . . c c 1 1 c c . . . . .
        . . . . . . . 1 1 . . . . . . .
        . . . . . . . c c . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_log = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f f . . .
        . . f f f f f f f f f f f f . .
        . . f f 1 1 f 1 1 1 1 1 f f . .
        . . f f f f f f f f f f f f . .
        . . f f 1 1 1 1 1 1 f 1 f f . .
        . . f f f f f f f f f f f f . .
        . . f f 1 1 1 1 f 1 1 1 f f . .
        . . f f f f f f f f f f f f . .
        . . f f 1 f 1 1 1 1 1 1 f f . .
        . . f f f f f f f f f f f f . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_plot = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f f . . .
        . . f 6 6 6 6 6 6 6 6 6 6 f . .
        . . f 6 6 6 6 6 6 6 6 5 5 f . .
        . . f 6 6 6 6 6 6 6 5 6 6 f . .
        . . f 6 6 6 6 6 6 5 6 6 6 f . .
        . . f 9 9 9 9 9 5 9 9 9 9 f . .
        . . f 6 6 6 6 5 6 6 6 6 6 f . .
        . . f 6 6 5 5 6 6 6 6 6 6 f . .
        . . f 5 5 6 6 6 6 6 6 6 6 f . .
        . . f 6 6 6 6 6 6 6 6 6 6 f . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_dpad_left = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f . . . . . .
        . . . . . . f 6 6 f . . . . . .
        . . . . . . f 6 6 f . . . . . .
        . . . f f f f 6 6 f f f f . . .
        . . . f 5 5 5 6 6 6 6 6 f . . .
        . . . f 5 5 5 6 6 6 6 6 f . . .
        . . . f f f f 6 6 f f f f . . .
        . . . . . . f 6 6 f . . . . . .
        . . . . . . f 6 6 f . . . . . .
        . . . . . . f f f f . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_next_page = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . c c . . . . . . . .
        . . . . . . c c c . . . . . . .
        . . . . . . b c c c . . . . . .
        . . . . . . . b c c c . . . . .
        . . . . . . . . b c c c . . . .
        . . . . . . . . c c c b . . . .
        . . . . . . . c c c b . . . . .
        . . . . . . c c c b . . . . . .
        . . . . . . c c b . . . . . . .
        . . . . . . b b . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_prev_page = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . c c . . . . . .
        . . . . . . . c c c . . . . . .
        . . . . . . c c c b . . . . . .
        . . . . . c c c b . . . . . . .
        . . . . c c c b . . . . . . . .
        . . . . b c c c . . . . . . . .
        . . . . . b c c c . . . . . . .
        . . . . . . b c c c . . . . . .
        . . . . . . . b c c . . . . . .
        . . . . . . . . b b . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const paint = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . e e . . . . .
        . . . . . . . . e 1 5 e . . . .
        . . . . . . . e 1 5 e 4 e . . .
        . . . . . . e 1 5 e 4 e e . . .
        . . . . . e 5 5 e 4 e e d . . .
        . . . . e 5 5 e 4 e e d . . . .
        . . . e d 5 e 4 e e d . . . . .
        . . . e d d 4 e e d . . . . . .
        . . . e e d d e d . . . . . . .
        . . . e e e e d . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    ///
    /// BUTTON BACKGROUNDS
    ///
    export const btn_bknd_white = img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        c 1 1 1 1 1 1 1 1 1 1 1 1 1 1 c
        . c c c c c c c c c c c c c c .
    `
    export const btn_bknd_white_bordered = img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        c 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 c
        . c c c c c c c c c c c c c c c c .
    `
    export const btn_bknd_beige = img`
        . d d d d d d d d d d d d d d .
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d
        c d d d d d d d d d d d d d d c
        . c c c c c c c c c c c c c c .
    `
    export const btn_bknd_beige_bordered = img`
        . d d d d d d d d d d d d d d d d .
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        d d d d d d d d d d d d d d d d d d
        c d d d d d d d d d d d d d d d d c
        . c c c c c c c c c c c c c c c c .
    `
    export const btn_bknd_clear = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const btn_bknd_danger = img`
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 .
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
        2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
    `

    ///
    /// GENERIC LANGUAGE TILES (NOT HARDWARE SPECIFIC)
    ///

    export const rc_default = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . c f f f f f f f c . . . .
        . . . . c c c c c c c . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const tile_switch_page = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f . . . . . . .
        . . . . f f 9 9 f . . . . . . .
        . . . f 9 f 9 9 f . f f f f . .
        . . f f f f 9 9 f f f 7 7 f . .
        . . f 9 9 9 9 9 f 7 f 7 7 f . .
        . . f 9 9 9 9 f f f f 7 7 f . .
        . . f 9 9 9 9 f 5 f 7 7 7 f . .
        . . f 9 f f f f 5 5 f 7 7 f . .
        . . f 9 f 5 5 5 5 5 5 f 7 f . .
        . . f f f f f f 5 5 f 7 7 f . .
        . . . . . . . f 5 f 7 7 7 f . .
        . . . . . . . f f f f f f f . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const tile_page_1 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f f f . . .
        . . . . . f f 9 9 9 9 9 f . . .
        . . . . f 9 f 9 9 9 9 9 f . . .
        . . . f f f f 9 9 9 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f 9 9 9 f f 9 9 9 f . . .
        . . . f 9 9 9 9 f 9 9 9 f . . .
        . . . f 9 9 9 9 f 9 9 9 f . . .
        . . . f 9 9 9 9 f 9 9 9 f . . .
        . . . f 9 9 9 f f f 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_page_2 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f f f . . .
        . . . . . f f 5 5 5 5 5 f . . .
        . . . . f 5 f 5 5 5 5 5 f . . .
        . . . f f f f 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 f f 5 5 5 f . . .
        . . . f 5 5 f 5 5 f 5 5 f . . .
        . . . f 5 5 5 5 f 5 5 5 f . . .
        . . . f 5 5 5 f 5 5 5 5 f . . .
        . . . f 5 5 f f f f 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_page_3 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f f f . . .
        . . . . . f f 4 4 4 4 4 f . . .
        . . . . f 4 f 4 4 4 4 4 f . . .
        . . . f f f f 4 4 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f 4 4 4 f f 4 4 4 f . . .
        . . . f 4 4 4 4 4 f 4 4 f . . .
        . . . f 4 4 4 4 f 4 4 4 f . . .
        . . . f 4 4 4 4 4 f 4 4 f . . .
        . . . f 4 4 4 f f 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_page_4 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f f f . . .
        . . . . . f f 3 3 3 3 3 f . . .
        . . . . f 3 f 3 3 3 3 3 f . . .
        . . . f f f f 3 3 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f 3 3 f 3 f 3 3 3 f . . .
        . . . f 3 3 f 3 f 3 3 3 f . . .
        . . . f 3 3 f f f f 3 3 f . . .
        . . . f 3 3 3 3 f 3 3 3 f . . .
        . . . f 3 3 3 3 f 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_page_5 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f f f . . .
        . . . . . f f 7 7 7 7 7 f . . .
        . . . . f 7 f 7 7 7 7 7 f . . .
        . . . f f f f 7 7 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f 7 7 f f f f 7 7 f . . .
        . . . f 7 7 f 7 7 7 7 7 f . . .
        . . . f 7 7 f f f 7 7 7 f . . .
        . . . f 7 7 7 7 7 f 7 7 f . . .
        . . . f 7 7 f f f 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_red = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 2 2 2 2 2 2 f . . . .
        . . . f 2 2 2 2 2 2 2 2 f . . .
        . . . f 2 2 2 2 2 2 2 2 f . . .
        . . . f 2 2 2 2 2 2 2 2 f . . .
        . . . f 2 2 2 2 2 2 2 2 f . . .
        . . . f 2 2 2 2 2 2 2 2 f . . .
        . . . f 2 2 2 2 2 2 2 2 f . . .
        . . . . f 2 2 2 2 2 2 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_darkpurple = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f c c c c c c f . . . .
        . . . f c c c c c c c c f . . .
        . . . f c c c c c c c c f . . .
        . . . f c c c c c c c c f . . .
        . . . f c c c c c c c c f . . .
        . . . f c c c c c c c c f . . .
        . . . f c c c c c c c c f . . .
        . . . . f c c c c c c f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    ///
    /// HARDWARE-SPECIFIC LANGUAGE TILES
    ///
    export const tile_button_a = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 6 6 6 6 6 6 6 . . . . .
        . . . 6 6 7 7 7 7 7 6 6 . . . .
        . . 6 6 7 7 1 1 1 7 7 6 6 . . .
        . . 6 7 7 1 7 7 7 1 7 7 6 d . .
        . . 6 7 7 1 7 7 7 1 7 7 6 d . .
        . . 6 7 7 1 1 1 1 1 7 7 6 d . .
        . . 6 6 7 1 7 7 7 1 7 6 6 d . .
        . . 8 6 6 1 7 7 7 1 6 6 8 d . .
        . . 8 6 6 7 6 6 6 7 6 6 8 d . .
        . . . 8 6 6 6 6 6 6 6 8 d . . .
        . . . . 8 8 8 8 8 8 8 d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_button_b = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 2 2 2 2 2 2 2 . . . . .
        . . . 2 2 4 4 4 4 4 2 2 . . . .
        . . 2 2 4 1 1 1 1 4 4 2 2 . . .
        . . 2 4 4 1 4 4 4 1 4 4 2 d . .
        . . 2 4 4 1 4 4 4 1 4 4 2 d . .
        . . 2 4 4 1 1 1 1 4 4 4 2 d . .
        . . 2 2 4 1 4 4 4 1 4 2 2 d . .
        . . e 2 2 1 4 4 4 1 2 2 e d . .
        . . e 2 2 1 1 1 1 2 2 2 e d . .
        . . . e 2 2 2 2 2 2 2 e d . . .
        . . . . e e e e e e e d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timer = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 1 1 1 1 1 1 1 f . . . .
        . . f 1 1 b 1 b 9 b 1 1 f . . .
        . f 1 1 1 1 1 b 9 9 9 1 1 f . .
        . f 1 b 1 1 1 9 9 9 9 b 1 f . .
        . f 1 1 1 1 1 9 9 9 9 9 1 f . .
        . f 1 b b 1 1 2 2 2 2 2 1 f . .
        . f 1 1 1 1 1 1 1 1 1 1 1 f . .
        . f 1 b 1 1 1 1 1 1 1 b 1 f . .
        . f 1 1 1 1 1 b 1 1 1 1 1 f . .
        . . f 1 1 b 1 b 1 b 1 1 f . . .
        . . . f 1 1 1 1 1 1 1 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timespan_short = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f . . . . . .
        . . . . f 1 1 9 9 9 f . . . . .
        . . . f 1 1 1 b 9 9 9 f . . . .
        . . f 1 1 b 1 b 9 2 1 1 f . . .
        . . f 1 1 1 1 9 2 1 1 1 f . . .
        . . f 1 b b 1 2 1 b b 1 f . . .
        . . f 1 1 1 1 1 1 1 1 1 f . . .
        . . f 1 1 b 1 b 1 b 1 1 f . . .
        . . . f 1 1 1 b 1 1 1 f . . . .
        . . . . f 1 1 1 1 1 f . . . . .
        . . . . . f f f f f . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timespan_long = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f . . . . . .
        . . . . f 1 1 9 9 9 f . . . . .
        . . . f 1 1 1 b 9 9 9 f . . . .
        . . f 1 1 b 1 b 9 b 9 9 f . . .
        . . f 1 1 1 1 9 9 9 9 9 f . . .
        . . f 1 b b 1 2 9 b b 9 f . . .
        . . f 1 1 1 2 9 9 9 9 9 f . . .
        . . f 1 1 2 9 b 9 b 9 9 f . . .
        . . . f 9 9 9 b 9 9 9 f . . . .
        . . . . f 9 9 9 9 9 f . . . . .
        . . . . . f f f f f . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_pin_0 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 f f 5 5 5 f 5 5 f . . .
        . . f 5 f 5 f 5 f 5 f 5 f . . .
        . . f 5 f f 5 5 f 5 f 5 f . . .
        . . f 5 f 5 5 5 f 5 f 5 f . . .
        . . f 5 f 5 5 5 5 f 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_pin_1 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 f f 5 5 5 f 5 5 f . . .
        . . f 5 f 5 f 5 f f 5 5 f . . .
        . . f 5 f f 5 5 5 f 5 5 f . . .
        . . f 5 f 5 5 5 5 f 5 5 f . . .
        . . f 5 f 5 5 5 f f f 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_pin_2 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 f f 5 5 f f 5 5 f . . .
        . . f 5 f 5 f 5 5 5 f 5 f . . .
        . . f 5 f f 5 5 5 f 5 5 f . . .
        . . f 5 f 5 5 5 f 5 5 5 f . . .
        . . f 5 f 5 5 5 f f f 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const tile_on = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f . . . f . . . . . .
        . . . f . . f . . f f f . . . .
        . . . f . . f . . f . . f . . .
        . . . f . . f . . f . . f . . .
        . . . . f f . . . f . . f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_off = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . f f . . f f . .
        . . . . . . . f . . . f . . . .
        . . . f f . . f . . . f . . . .
        . . f . . f . f f . . f f . . .
        . . f . . f . f . . . f . . . .
        . . f . . f . f . . . f . . . .
        . . . f f . . f . . . f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const radio_receive = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f f . . . .
        . . . f . . . . . . . . f . . .
        . . f . . f f f f f f . . f . .
        . f . . f . . . . . . f . . f .
        . . . f . . f f f f . . f . . .
        . . . . . f . . . . f . . . . .
        . . . 8 . . . f f . . . . . . .
        . . 8 . . . . . . . . . . . . .
        . . 8 . . . . . . . . . . . . .
        . . 8 . . . . 8 . . . f f f . .
        . . . 8 . . . 8 8 . f 5 5 5 f .
        . . . . 8 8 8 8 8 8 f 5 5 5 f .
        . . . . . . . 8 8 . f 5 5 5 f .
        . . . . . . . 8 . . . f f f . .
        . . . . . . . . . . . . . . . .
    `
    export const radio_send = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f f . . . .
        . . . f . . . . . . . . f . . .
        . . f . . f f f f f f . . f . .
        . f . . f . . . . . . f . . f .
        . . . f . . f f f f . . f . . .
        . . . . . f . . . . f . . . . .
        . . . 8 . . . f f . . . . . . .
        . . 8 8 8 . . . . . . . . . . .
        . 8 8 8 8 8 . . . . . . . . . .
        . . . 8 . . . . . . f f f . . .
        . . . 8 . . . . . f 5 5 5 f . .
        . . . . 8 8 8 8 8 f 5 5 5 f . .
        . . . . . . . . . f 5 5 5 f . .
        . . . . . . . . . . f f f . . .
        . . . . . . . . . . . . . . . .
    `

    export const microbit_logo = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . f f f f f f f f . . . .
    . . . f . . . . . . . . f . . .
    . . f . . . . . . . . . . f . .
    . . f . f f . . . . f f . f . .
    . . f . f f . . . . f f . f . .
    . . f . . . . . . . . . . f . .
    . . . f . . . . . . . . f . . .
    . . . . f f f f f f f f . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    `
    export const finger_press = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . f . f . f . . . . . .
        . . . . . . f f f . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 2 2 2 2 2 . . . . . .
        . . . . 2 2 2 2 2 2 2 . . . . .
        . . . . 2 2 2 2 2 2 2 . . . . .
        . . . e e e e e e e e e . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_1 = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . f 5 5 5 5 5 5 5 5 5 5 5 f . .
        . f 5 5 5 5 f f 5 5 5 5 5 f . .
        . f 5 5 5 5 5 f 5 5 5 5 5 f . .
        . f 5 5 5 5 5 f 5 5 5 5 5 f . .
        . f 5 5 5 5 5 f 5 5 5 5 5 f . .
        . f 5 5 5 5 f f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 5 5 5 f f . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_2 = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . f 5 5 5 5 5 5 5 5 5 5 5 f . .
        . f 5 5 5 5 f f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 f 5 5 5 f . .
        . f 5 5 5 5 5 5 f 5 5 5 5 f . .
        . f 5 5 5 5 5 f 5 5 5 5 5 f . .
        . f 5 5 5 5 f f f f 5 5 5 f . .
        . f 5 5 5 5 5 5 5 5 5 5 f f . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_3 = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . f 5 5 5 5 5 5 5 5 5 5 5 f . .
        . f 5 5 5 5 f f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 f 5 5 5 f . .
        . f 5 5 5 5 5 f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 f 5 5 5 f . .
        . f 5 5 5 5 f f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 5 5 5 f f . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_4 = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . f 5 5 5 5 5 5 5 5 5 5 5 f . .
        . f 5 5 5 5 f 5 f 5 5 5 5 f . .
        . f 5 5 5 5 f 5 f 5 5 5 5 f . .
        . f 5 5 5 5 f f f f 5 5 5 f . .
        . f 5 5 5 5 5 5 f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 5 5 5 f f . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_5 = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . f 5 5 5 5 5 5 5 5 5 5 5 f . .
        . f 5 5 5 5 f f f f 5 5 5 f . .
        . f 5 5 5 5 f 5 5 5 5 5 5 f . .
        . f 5 5 5 5 f f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 f 5 5 5 f . .
        . f 5 5 5 5 f f f 5 5 5 5 f . .
        . f 5 5 5 5 5 5 5 5 5 5 f f . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const microphone = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . f f . . . . . . .
. . . . . . f f f f . . . . . .
. . . . . . f f f f . . . . . .
. . . . . . f f f f . . . . . .
. . . . . . f f f f . . . . . .
. . . . f . f f f f . f . . . .
. . . . f . f f f f . f . . . .
. . . . f . . f f . . f . . . .
. . . . . f . . . . f . . . . .
. . . . . . f f f f . . . . . .
. . . . . . . f f . . . . . . .
. . . . . . . f f . . . . . . .
. . . . . f f f f f f . . . . .
. . . . . . . . . . . . . . . .
`

    export const speaker = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . f . . . . . . . . . .
. . . . f f . . . . . 8 . . . .
. . . f f f . . . 8 . . 8 . . .
. f f f f f . 8 . . 8 . 8 . . .
. f f f f f . . 8 . 8 . 8 . . .
. f f f f f . . 8 . 8 . 8 . . .
. f f f f f . 8 . . 8 . 8 . . .
. . . f f f . . . 8 . . 8 . . .
. . . . f f . . . . . 8 . . . .
. . . . . f . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`
    export const music = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . f f . . .
. . . . . . . . . f f f f . . .
. . . . . . . f f f . . f . . .
. . . . . f f f . . . . f . . .
. . . . . f . . . . . . f . . .
. . . . . f . . . . . . f . . .
. . . . . f . . . . . . f . . .
. . . . . f . . . . f f f . . .
. . . f f f . . . f f f f . . .
. . f f f f . . . f f f . . . .
. . f f f . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`

    export const staffEGB = img`
f f f f f f f f f f f f f f f f
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
f f f f f f f f f f f f f f f f
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
f f f f f f f f f f f f f f f f
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
f f f f f f f f f f f f f f f f
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
f f f f f f f f f f f f f f f f
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`

    export const noteStemUp = img`
. . . . 8
. . . . 8
. . . . 8
. . . . 8
. . . . 8
. . 8 8 8
. 8 8 8 8
. 8 8 8 .
`
    export const noteStemDown = img`
. . 8 8 8
. 8 8 8 8
. 8 8 8 .
. 8 . . .
. 8 . . .
. 8 . . .
. 8 . . .
. 8 . . .
`

    export const accelerometer = img`
. . . . . . . . . . . . . . . .
. . . . . . . . 8 . . . . . . .
. . . . . . . 8 8 8 . . . . . .
. . . . . . 8 8 8 8 8 . . . . .
. . . . . . 6 6 8 6 6 . . . . .
. . . . . . . . 8 . . . . . . .
. . 8 6 . . f f f f f . . . . .
. 8 8 6 . f . . . . . f . . . .
8 8 8 8 8 f . f . f . f . . . .
. 8 8 6 . f . . . . . f . . . .
. . 8 6 . . f f f f f 8 . . 6 .
. . . . . . . . . . . . 8 6 8 .
. . . . . . . . . . . . 6 8 8 .
. . . . . . . . . . . 6 8 8 8 .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`

    export const loud = img`
. . . . . . . . . . . . . . . .
. 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
. 2 f f 2 2 2 2 2 2 f f f 2 2 .
. 2 f f 2 2 2 2 2 f f 2 f f 2 .
. 2 f f 2 2 2 2 2 f 2 2 2 f 2 .
. 2 f f 2 2 2 2 2 f f 2 f f 2 .
. 2 f f f f 2 2 2 2 f f f 2 2 .
. 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
. 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
. 2 f f 2 2 f 2 2 f f f f 2 2 .
. 2 f f 2 2 f 2 2 f f 2 2 f 2 .
. 2 f f 2 2 f 2 2 f f 2 2 f 2 .
. 2 f f 2 2 f 2 2 f f 2 2 f 2 .
. 2 2 f f f 2 2 2 f f f f 2 2 .
. 2 2 2 2 2 2 2 2 2 2 2 2 2 2 .
. . . . . . . . . . . . . . . .
`

    export const quiet = img`
9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9
9 9 9 9 1 1 1 9 9 9 9 9 9 9 1 9
9 9 9 1 1 1 1 1 9 9 1 1 1 9 9 9
9 9 1 1 1 1 1 1 9 9 9 1 1 1 9 9
9 9 9 9 1 1 9 9 9 9 9 9 1 1 1 9
9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 1 1 1 1 9 9 9 9 9
9 9 9 9 9 9 9 9 1 1 1 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9
9 9 9 7 7 7 7 7 7 9 9 9 9 9 9 9
7 7 7 7 7 7 7 7 7 7 7 9 9 9 7 7
7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7
`

    /* maybe use these later
    export const rc_high = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 9 6 9 6 9 6 9 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . c f f f f f f f c . . . .
        . . . . c c c c c c c . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const rc_low = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 9 6 9 6 9 6 9 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 5 5 5 5 5 5 5 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . c f f f f f f f c . . . .
        . . . . c c c c c c c . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const rc_low_to_high = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 5 5 5 5 f . . . .
        . . . f 6 6 6 5 6 6 6 f . . . .
        . . . f 9 6 9 5 9 6 9 f . . . .
        . . . f 6 6 6 5 6 6 6 f . . . .
        . . . f 5 5 5 5 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . c f f f f f f f c . . . .
        . . . . c c c c c c c . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const rc_high_to_low = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . f 5 5 5 5 6 6 6 f . . . .
        . . . f 6 6 6 5 6 6 6 f . . . .
        . . . f 9 6 9 5 9 6 9 f . . . .
        . . . f 6 6 6 5 6 6 6 f . . . .
        . . . f 6 6 6 5 5 5 5 f . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . c f f f f f f f c . . . .
        . . . . c c c c c c c . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    */
}
