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
            this.reg["when_insertion_point"] = icondb.btn_when_insertion_point
            this.reg["do_insertion_point"] = icondb.btn_do_insertion_point
            this.reg["rule_arrow"] = icondb.rule_arrow
            this.reg["next_page"] = icondb.btn_next_page
            this.reg["prev_page"] = icondb.btn_prev_page
            this.reg["rule_handle"] = icondb.rule_handle
            this.reg["paint"] = icondb.paint
            this.reg["MISSING"] = icondb.MISSING
            this.reg["flashing_heart"] = icondb.sampleFlashingHeart
            this.reg["smiley_buttons"] = icondb.sampleSmileyButtons
            this.reg["clap_lights"] = icondb.sampleClapLights
            this.reg["dice"] = icondb.sampleDice
            this.reg["rock_paper_scissors"] = icondb.sampleRockPaperScissors
            this.reg["teleport_duck"] = icondb.sampleTeleportDuck

            this.reg[TID_SENSOR_TIMER] = icondb.tile_timer
            this.reg[TID_SENSOR_RADIO_RECEIVE] = icondb.radio_receive
            this.reg[TID_SENSOR_PRESS] = icondb.finger_press
            this.reg[TID_SENSOR_RELEASE] = icondb.finger_release
            this.reg[TID_SENSOR_MICROPHONE] = icondb.microphone
            this.reg[TID_SENSOR_ACCELEROMETER] = icondb.accelerometer
            this.reg[TID_SENSOR_OUT_PIPE_A] = icondb.outPipeA
            this.reg[TID_SENSOR_OUT_PIPE_B] = icondb.outPipeB
            this.reg[TID_SENSOR_OUT_PIPE_C] = icondb.outPipeC

            this.reg[TID_FILTER_LOGO] = icondb.microbit_logo
            this.reg[TID_FILTER_PIN_0] = icondb.tile_pin_0
            this.reg[TID_FILTER_PIN_1] = icondb.tile_pin_1
            this.reg[TID_FILTER_PIN_2] = icondb.tile_pin_2
            this.reg[TID_FILTER_BUTTON_A] = icondb.tile_button_a
            this.reg[TID_FILTER_BUTTON_B] = icondb.tile_button_b
            this.reg[TID_FILTER_TIMESPAN_SHORT] = icondb.tile_timespan_short
            this.reg[TID_FILTER_TIMESPAN_LONG] = icondb.tile_timespan_long
            this.reg[TID_FILTER_TIMESPAN_VERY_LONG] = icondb.tile_timespan_fiveSeconds
            this.reg[TID_FILTER_TIMESPAN_RANDOM] = icondb.tile_timespan_random
            this.reg[TID_FILTER_VALUE_1] = icondb.tile_value_1
            this.reg[TID_FILTER_VALUE_2] = icondb.tile_value_2
            this.reg[TID_FILTER_VALUE_3] = icondb.tile_value_3
            this.reg[TID_FILTER_VALUE_4] = icondb.tile_value_4
            this.reg[TID_FILTER_VALUE_5] = icondb.tile_value_5

            this.reg[TID_FILTER_LOUD] = icondb.speaker
            this.reg[TID_FILTER_QUIET] = icondb.speakerQuiet

            this.reg[TID_ACTUATOR_SWITCH_PAGE] = icondb.tile_switch_page
            this.reg[TID_ACTUATOR_PAINT] = icondb.showScreen
            this.reg[TID_ACTUATOR_RADIO_SEND] = icondb.radio_send
            this.reg[TID_ACTUATOR_MICROPHONE] = icondb.microphone
            this.reg[TID_ACTUATOR_SPEAKER] = icondb.speakerFun
            this.reg[TID_ACTUATOR_MUSIC] = icondb.music
            this.reg[TID_ACTUATOR_RANDOM_TOSS] = icondb.diceToss

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

            this.reg[TID_MODIFIER_EMOJI_GIGGLE] = icondb.soundGiggle
            this.reg[TID_MODIFIER_EMOJI_HAPPY] = icondb.soundHappy
            this.reg[TID_MODIFIER_EMOJI_HELLO] = icondb.soundHello
            this.reg[TID_MODIFIER_EMOJI_MYSTERIOUS] = icondb.soundMysterious
            this.reg[TID_MODIFIER_EMOJI_SAD] = icondb.soundSad
            this.reg[TID_MODIFIER_EMOJI_SLIDE] = icondb.soundSlide
            this.reg[TID_MODIFIER_EMOJI_SOARING] = icondb.soundSoaring
            this.reg[TID_MODIFIER_EMOJI_SPRING] = icondb.soundSpring
            this.reg[TID_MODIFIER_EMOJI_TWINKLE] = icondb.soundTwinkle
            this.reg[TID_MODIFIER_EMOJI_YAWN] = icondb.soundYawn

            this.reg[TID_MODIFIER_PIPE_IN_A] = icondb.inPipeA
            this.reg[TID_MODIFIER_PIPE_IN_B] = icondb.inPipeB
            this.reg[TID_MODIFIER_PIPE_IN_C] = icondb.inPipeC

            this.reg[TID_FILTER_ACCEL_SHAKE] = icondb.moveShake
            this.reg[TID_FILTER_ACCEL_FREEFALL] = icondb.moveFall
            this.reg[TID_FILTER_ACCEL_TILT_UP] = icondb.moveTiltUp
            this.reg[TID_FILTER_ACCEL_TILT_DOWN] = icondb.moveTiltDown
            this.reg[TID_FILTER_ACCEL_TILT_LEFT] = icondb.moveTiltLeft
            this.reg[TID_FILTER_ACCEL_TILT_RIGHT] = icondb.moveTiltRight

            // for icon editor
            this.reg[TID_MODIFIER_COLOR_RED] = icondb.tile_red
            this.reg[TID_MODIFIER_COLOR_DARKPURPLE] = icondb.tile_darkpurple
        }
    }

    export const wordLogo = img` 
    .111111.......111111...1111.......................................................1111111.................................1111..................
    11bbbbbb.....11bbbbbb.11bbbb....................................................111bbbbbbb1..............................11bbbb.................
    1bbbbbbbb...11bbbbbbbf1bbbbbf..................................................11bbbbbbbbbbb.............................1bbbbbf................
    1bbbbbbbbb.11bbbbbbbbf1bbbbbf.................................................11bbbbbbbbbbbbb............................1bbbbbf................
    1bbbbbbbbbb1bbbbbbbbbf1bbbbbf................................................11bbbbbbbbbbbbbbb...........................1bbbbbf................
    1bbbbbbbbbbbbbbbbbbbbf.bbbbff...............................................11bbbbbbbbbbbbbbbbf..........................1bbbbbf................
    1bbbbbbbbbbbbbbbbbbbbf..ffff.....1111111......1111...111.......1111111......1bbbbbbbbbbbbbbbbbb.....1111111.........111111bbbbbf....1111111.....
    1bbbbbbbbbbbbbbbbbbbbf.1111....111bbbbbbb1...11bbbb.11bbb....111bbbbbbb1...11bbbbbbbfffbbbbbbbbf..111bbbbbbb1.....111bbbbbbbbbbf..111bbbbbbb1...
    1bbbbbbbbbbbbbbbbbbbbf11bbbb..11bbbbbbbbbbb..1bbbbbb1bbbbb..11bbbbbbbbbbb..1bbbbbbbff...bbbbbbbf.11bbbbbbbbbbb...11bbbbbbbbbbbbf.11bbbbbbbbbbb..
    1bbbbbbfbbbbbfbbbbbbbf1bbbbbf.1bbbbbbbbbbbbf.1bbbbbbbbbbbbf.1bbbbbbbbbbbbf.1bbbbbbff.....bbbbbff.1bbbbbbbbbbbbf..1bbbbbbbbbbbbbf.1bbbbbbbbbbbbf.
    1bbbbbbf.bbbff1bbbbbbf1bbbbbf11bbbbbbbbbbbbb.1bbbbbbbbbbbbf11bbbbbbbbbbbbb.1bbbbbbf.......fffff.11bbbbbbbbbbbbb.11bbbbbbbbbbbbbf11bbbbfffbbbbbb.
    1bbbbbbf..fff.1bbbbbbf1bbbbbf1bbbbbfffbbbbbbf1bbbbbfffbbbff1bbbbbfffbbbbbbf1bbbbbbf......11111..1bbbbbfffbbbbbbf1bbbbbfffbbbbbbf1bbbbff...bbbbbf
    1bbbbbbf......1bbbbbbf1bbbbbf1bbbbff...bbbbff1bbbbbf...fff.1bbbbff...bbbbbf1bbbbbbb.....11bbbbb.1bbbbff...bbbbbf1bbbbff..1bbbbbf1bbbbb11111bbbbf
    1bbbbbbf......1bbbbbbf1bbbbbf1bbbbf.....ffff.1bbbbbf.......1bbbbf....1bbbbf1bbbbbbbb...11bbbbbbf1bbbbf....1bbbbf1bbbbf...1bbbbbf1bbbbbbbbbbbbbbf
    1bbbbbbf......1bbbbbbf1bbbbbf1bbbbf....1111..1bbbbbf.......1bbbbf....1bbbbf.bbbbbbbbb111bbbbbbbf1bbbbf....1bbbbf1bbbbf...1bbbbbf1bbbbbbbbbbbbbff
    1bbbbbbf......1bbbbbbf1bbbbbf1bbbbb...11bbbb.1bbbbbf.......1bbbbb...11bbbbf.1bbbbbbbbbbbbbbbbbff1bbbbb...11bbbbf1bbbbb...1bbbbbf1bbbbffffffffff.
    1bbbbbbf......1bbbbbbf1bbbbbf1bbbbbb111bbbbbf1bbbbbf.......1bbbbbb111bbbbbf..bbbbbbbbbbbbbbbbbf.1bbbbbb111bbbbbf1bbbbbb111bbbbbf1bbbbb..........
    1bbbbbbf......1bbbbbbf1bbbbbf.bbbbbbbbbbbbbff1bbbbbf........bbbbbbbbbbbbbff...bbbbbbbbbbbbbbbff..bbbbbbbbbbbbbff.bbbbbbbbbbbbbbf.bbbbbb11111....
    1bbbbbbf......1bbbbbbf1bbbbbf.1bbbbbbbbbbbbf.1bbbbbf........1bbbbbbbbbbbbf.....bbbbbbbbbbbbbff...1bbbbbbbbbbbbf..1bbbbbbbbbbbbbf.1bbbbbbbbbbb...
    1bbbbbbf......1bbbbbbf1bbbbbf..bbbbbbbbbbbff.1bbbbbf.........bbbbbbbbbbbff......bbbbbbbbbbbff.....bbbbbbbbbbbff...bbbbbbbbbbbbbf..bbbbbbbbbbbf..
    .bbbbbff.......bbbbbff.bbbbff...fbbbbbbbfff...bbbbff..........fbbbbbbbfff........fbbbbbbbfff.......fbbbbbbbfff.....fbbbbbbbbbbff...fbbbbbbbbff..
    ..fffff.........fffff...ffff......fffffff......ffff.............fffffff............fffffff...........fffffff.........ffffffffff......ffffffff...
    `
    export const microbitLogo = img` 
    .....1111111111111111.....
    ...11111111111111111111...
    ..111................111..
    .111..................111.
    .11....................11.
    11.....11........11.....11
    11....1111......1111....11
    11....1111......1111....11
    11.....11........11.....11
    .11....................11.
    .111..................111.
    ..111................111..
    ...11111111111111111111...
    .....1111111111111111.....
    `

    export const editorBackground = img`
        8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
        8888888888888811188888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
        8888888888888111888888188888881888888888881888888888888888888888888888888888888888888888888888888888885888888888888888888881888888888888888888818888888888888188
        8818888888881158888888888888818188888888888888888818888888881888888888818888888888881888888888588888888888888888888888888888888888888858888888888888888888888888
        8888888888885158888888888888881888888888888888888181888888888888888888888888888888888888888888888881888881888888888188888888888888888888888888888888888888888888
        8888588888881118888888888888888888888888888888888818888888888888888888888888888888888888888888888888888888888888881818888888888881888888818888888888818888888888
        8888888888888115888858888888888888188888888888888888888888888888818888888888888188888888888888888888888888888888888188888888888888888888888888888888888888888888
        8888888888888811188888888888888888888881888885888888888888888888888888885888888888888888881888888588888888888888888888888888888888888888888888888588888888888888
        8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
        8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
        8886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886888688868886
        8686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686868686
        6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
        6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
        6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
        6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
    `
}

// - upscale 5x5 image to 16 x 16
function scaleUp(led55: ImageG) {
    const ret = image.create(16, 16)
    ret.fill(15)
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
        . . . . . . c f f . . . . . . .
        . . . . . c . . . f . . . . . .
        . . . . c c c f f f f . . . . .
        . . . c 1 1 d d d b b f . . . .
        . . c c c c c f f f f f f . . .
        . . . c b c b c b c c f . . . .
        . . . c 1 c d c d c b f d . . .
        . . . c 1 c d c d c b f d . . .
        . . . c 1 c d c d c b f d . . .
        . . . c 1 c d c d c b f d . . .
        . . . c 1 1 d d d b b f d . . .
        . . . c 1 1 d d d b b f d . . .
        . . . . c c c f f f f d . . . .
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
        . . . . . . . . 7 7 7 6 . . . .
        . . . . 7 7 . 7 7 7 6 . . . . .
        . . . . 7 7 7 7 7 6 . . . . . .
        . . . . 7 7 7 7 6 . . . . . . .
        . . . . 6 7 7 6 . . . . . . . .
        . . . . . 6 6 . . . . . . . . .
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

    export const btn_when_insertion_point = img`
    dddddddddddddddddd
    dcddcddcddcddcddcd
    dddddddddddddddddd
    dddddddddddddddddd
    dcddddddddddddddcd
    dddddddddddddddddd
    dddddddd11dddddddd
    dcdddddd11ddddddcd
    dddddd111111dddddd
    dddddd111111dddddd
    dcddddcc11ccddddcd
    dddddddd11dddddddd
    ddddddddccdddddddd
    dcddddddddddddddcd
    dddddddddddddddddd
    dddddddddddddddddd
    dcddcddcddcddcddcd
    dddddddddddddddddd
    `

    export const btn_do_insertion_point = img`
    bbbbbbbbbbbbbbbbbb
    bdbbdbbdbbdbbdbbdb
    bbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbb
    bdbbbbbbbbbbbbbbdb
    bbbbbbbbbbbbbbbbbb
    bbbbbbbb11bbbbbbbb
    bdbbbbbb11bbbbbbdb
    bbbbbb111111bbbbbb
    bbbbbb111111bbbbbb
    bdbbbbcc11ccbbbbdb
    bbbbbbbb11bbbbbbbb
    bbbbbbbbccbbbbbbbb
    bdbbbbbbbbbbbbbbdb
    bbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbb
    bdbbdbbdbbdbbdbbdb
    bbbbbbbbbbbbbbbbbb
    `

    export const rule_arrow = img`
    d d d . . . . . . . . . . .
    d d d d . . . . . . . . . .
    d d d d d . . . . . . . . .
    d d d d d d . . . . . . . .
    d d d d d d d . . . . . . .
    d d d d d d d d . . . . . .
    d d d d d d d d d . . . . .
    d d d d d d d d d d . . . .
    d d d d d d d d d d d . . .
    d d d d d d d d d d d d . .
    d d d d d d d d d d d d . .
    d d d d d d d d d d d . . .
    d d d d d d d d d d . . . .
    d d d d d d d d d . . . . .
    d d d d d d d d . . . . . .
    d d d d d d d . . . . . . .
    d d d d d d . . . . . . . .
    d d d d d . . . . . . . . .
    d d d d . . . . . . . . . .
    d d d . . . . . . . . . . .
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
        . . . . . . 1 1 . . . . . . . . 
        . . . . . . 1 1 1 . . . . . . . 
        . . . . . . c 1 1 1 . . . . . . 
        . . . . . . . c 1 1 1 . . . . . 
        . . . . . . . . c 1 1 1 . . . . 
        . . . . . . . . 1 1 1 c . . . . 
        . . . . . . . 1 1 1 c . . . . . 
        . . . . . . 1 1 1 c . . . . . . 
        . . . . . . 1 1 c . . . . . . . 
        . . . . . . c c . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
    `

    export const btn_prev_page = img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . 1 1 . . . . . . 
        . . . . . . . 1 1 1 . . . . . . 
        . . . . . . 1 1 1 c . . . . . . 
        . . . . . 1 1 1 c . . . . . . . 
        . . . . 1 1 1 c . . . . . . . . 
        . . . . c 1 1 1 . . . . . . . . 
        . . . . . c 1 1 1 . . . . . . . 
        . . . . . . c 1 1 1 . . . . . . 
        . . . . . . . c 1 1 . . . . . . 
        . . . . . . . . c c . . . . . . 
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
    export const showScreen = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . 2 4 . .
        . . . . 2 . . . . . . 2 4 4 2 .
        . . . . 2 . . . . . 2 4 4 2 e .
        . 2 . . 2 . . . . 2 4 4 2 e b .
        . . 2 . 2 . . . 2 4 4 2 e b . .
        . . . . . . . d 4 4 2 e b . . .
        . . f f f f f d d 2 e b . . . .
        . . f f f f f 2 d d b . . . . .
        . . f f 2 f 2 f f b . . . . . .
        . . f f f f f f f b . 2 2 2 2 .
        . . f 2 f f f 2 f b . . . . . .
        . . f f 2 2 2 f f b . 2 . . . .
        . . f f f f f f f b . . 2 . . .
        . . . b b b b b b b . . . . . .
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

    export const rule_handle = img`
        . f f f f f f f .
        f 1 1 1 1 1 1 1 f
        f 1 1 1 1 1 1 1 f
        f 1 1 1 1 1 1 1 f
        f 1 1 1 1 1 1 1 f
        f 1 1 1 1 1 1 1 f
        f 1 1 1 1 1 1 1 f
        f 1 1 1 1 1 1 1 f
        . f f f f f f f .
    `

    export const tile_switch_page = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f . . . . . . .
        . . . . f f 9 9 f . . . . . . .
        . . . f 9 f 9 9 f d f f f f . .
        . . f f f f 9 9 f f f 7 7 f . .
        . . f 9 9 9 9 9 f 7 f 7 7 f d .
        . . f 9 9 9 9 f f f f 7 7 f d .
        . . f 9 9 9 9 f 5 f 7 7 7 f d .
        . . f 9 f f f f 5 5 f 7 7 f d .
        . . f 9 f 5 5 5 5 5 5 f 7 f d .
        . . f f f f f f 5 5 f 7 7 f d .
        . . . d d d d f 5 f 7 7 7 f d .
        . . . . . . . f f f f f f f d .
        . . . . . . . . d d d d d d d .
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
        . . . . 6 6 6 6 6 6 6 . . . . .
        . . . 6 6 7 7 7 7 7 6 6 . . . .
        . . 6 6 7 1 1 1 1 7 7 6 6 . . .
        . . 6 7 7 1 7 7 7 1 7 7 6 d . .
        . . 6 7 7 1 7 7 7 1 7 7 6 d . .
        . . 6 7 7 1 1 1 1 7 7 7 6 d . .
        . . 6 6 7 1 7 7 7 1 7 6 6 d . .
        . . 8 6 6 1 7 7 7 1 6 6 8 d . .
        . . 8 6 6 1 1 1 1 6 6 6 8 d . .
        . . . 8 6 6 6 6 6 6 6 8 d . . .
        . . . . 8 8 8 8 8 8 8 d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timer = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . b b b b b . . . . . .
        . . . . b 1 1 9 9 9 b . . . . .
        . . . b 1 1 1 b 9 9 9 c . . . .
        . . b 1 1 d 1 b 9 b 9 9 c . . .
        . . b 1 1 1 1 9 9 9 9 9 c d . .
        . . b 1 d d 1 2 2 2 2 9 c d . .
        . . b 1 1 1 1 1 1 1 1 1 c d . .
        . . b 1 1 d 1 d 1 d 1 1 c d . .
        . . . b 1 1 1 d 1 1 1 c d . . .
        . . . . c 1 1 1 1 1 c d . . . .
        . . . . . c c c c c d . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timespan_short = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . b b b b b b b b b b . . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 1 2 1 1 1 1 1 1 1 c . .
        . . b 1 1 2 1 1 1 1 1 1 1 c d .
        . . b 1 1 1 1 1 1 1 1 1 1 c d .
        . . b 1 2 2 2 1 1 1 f f 1 c d .
        . . b 1 1 1 1 1 1 f 1 1 1 c d .
        . . b 1 2 1 2 1 1 1 f 1 1 c d .
        . . b 1 2 2 2 1 1 1 1 f 1 c d .
        . . b 1 1 1 2 1 1 f f 1 1 c d .
        . . b 1 1 1 1 1 1 1 1 1 1 c d .
        . . . c c c c c c c c c c d . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timespan_long = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . b b b b b b b b b b . . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 1 1 2 1 1 1 1 1 1 c d .
        . . b 1 1 2 2 1 1 1 1 1 1 c d .
        . . b 1 1 1 2 1 1 1 f f 1 c d .
        . . b 1 1 1 2 1 1 f 1 1 1 c d .
        . . b 1 1 1 2 1 1 1 f 1 1 c d .
        . . b 1 1 1 2 1 1 1 1 f 1 c d .
        . . b 1 1 2 2 2 1 f f 1 1 c d .
        . . b 1 1 1 1 1 1 1 1 1 1 c d .
        . . . c c c c c c c c c c d . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timespan_fiveSeconds = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . b b b b b b b b b b . . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 2 2 2 2 1 1 1 1 1 c d .
        . . b 1 2 1 1 1 1 1 1 1 1 c d .
        . . b 1 2 2 2 1 1 1 f f 1 c d .
        . . b 1 1 1 1 2 1 f 1 1 1 c d .
        . . b 1 1 1 1 2 1 1 f 1 1 c d .
        . . b 1 1 1 1 2 1 1 1 f 1 c d .
        . . b 1 2 2 2 1 1 f f 1 1 c d .
        . . b 1 1 1 1 1 1 1 1 1 1 c d .
        . . . c c c c c c c c c c d . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_timespan_random = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . b b b b b b b b b b . . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 1 1 1 1 1 1 1 1 1 c . .
        . . b 1 1 2 2 1 1 1 1 1 1 c d .
        . . b 1 2 1 1 2 1 1 1 1 1 c d .
        . . b 1 1 1 1 2 1 1 f f 1 c d .
        . . b 1 1 2 2 1 1 f 1 1 1 c d .
        . . b 1 1 2 1 1 1 1 f 1 1 c d .
        . . b 1 1 1 1 1 1 1 1 f 1 c d .
        . . b 1 1 2 1 1 1 f f 1 1 c d .
        . . b 1 1 1 1 1 1 1 1 1 1 c d .
        . . . c c c c c c c c c c d . .
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
        . . . . . 8 . . . 8 . . . . . .
        . . . 8 . . 8 8 8 . . 8 . . . .
        . 8 . . 8 . . . . . 8 . . 8 . .
        . . 8 . . 8 8 8 8 8 . . 8 . . .
        . . . 8 . . . . . . . 8 . . . .
        . . . . 8 8 8 8 8 8 8 . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . 6 9 9 9 9 9 6 . . . . .
        . . . . . 6 9 9 9 6 . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . . . 6 . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const radio_send = img`
        . . . . . . . . . . . . . . . .
        . . . . 8 8 8 8 8 8 8 . . . . .
        . . . 8 . . . . . . . 8 . . . .
        . . 8 . . 8 8 8 8 8 . . 8 . . .
        . 8 . . 8 . . . . . 8 . . 8 . .
        . . . 8 . . 8 8 8 . . 8 . . . .
        . . . . . 8 . . . 8 . . . . . .
        . . . . . . . 6 . . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . 6 9 9 9 6 . . . . . .
        . . . . 6 9 9 9 9 9 6 . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
        . . . . . . 6 9 6 . . . . . . .
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
        . . . . . . . f . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . f . f . f . . . . . .
        . . . . . . f f f . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . . 4 4 4 4 4 4 4 d . . . .
        . . . e 4 4 4 4 4 4 4 e d . . .
        . . . e 2 4 4 4 4 4 2 e d . . .
        . . . e e 2 2 2 2 2 e e d . . .
        . . . . e e e e e e e d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const finger_release = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . f f f . . . . . . .
        . . . . . f . f . f . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . f . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . . 4 4 4 4 4 4 4 d . . . .
        . . . e 4 4 4 4 4 4 4 e d . . .
        . . . e 2 4 4 4 4 4 2 e d . . .
        . . . e e 2 2 2 2 2 e e d . . .
        . . . . e e e e e e e d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_1 = img`
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . 4 4 5 5 5 5 5 4 4 . . . .
        . . 4 5 5 1 1 1 1 1 5 5 4 . . .
        . . 4 5 1 1 1 1 1 1 1 5 4 . . .
        . 4 5 1 1 1 1 f 1 1 1 1 5 4 . .
        . 4 5 1 1 1 f f 1 1 1 1 5 4 d .
        . 4 5 1 1 1 1 f 1 1 1 1 5 4 d .
        . 4 5 1 1 1 1 f 1 1 1 1 5 4 d .
        . 4 5 1 1 1 f f f 1 1 1 5 4 d .
        . . 4 5 1 1 1 1 1 1 1 5 4 d d .
        . . 4 5 5 1 1 1 1 1 5 5 4 d . .
        . . . 4 4 5 5 5 5 5 4 4 d . . .
        . . . . . 4 4 4 4 4 d d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_2 = img`
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . 4 4 5 5 5 5 5 4 4 . . . .
        . . 4 5 5 1 1 1 1 1 5 5 4 . . .
        . . 4 5 1 1 1 1 1 1 1 5 4 . . .
        . 4 5 1 1 1 f f 1 1 1 1 5 4 . .
        . 4 5 1 1 1 1 1 f 1 1 1 5 4 d .
        . 4 5 1 1 1 1 f 1 1 1 1 5 4 d .
        . 4 5 1 1 1 f 1 1 1 1 1 5 4 d .
        . 4 5 1 1 1 f f f 1 1 1 5 4 d .
        . . 4 5 1 1 1 1 1 1 1 5 4 d d .
        . . 4 5 5 1 1 1 1 1 5 5 4 d . .
        . . . 4 4 5 5 5 5 5 4 4 d . . .
        . . . . . 4 4 4 4 4 d d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_3 = img`
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . 4 4 5 5 5 5 5 4 4 . . . .
        . . 4 5 5 1 1 1 1 1 5 5 4 . . .
        . . 4 5 1 1 1 1 1 1 1 5 4 . . .
        . 4 5 1 1 1 f f 1 1 1 1 5 4 . .
        . 4 5 1 1 1 1 1 f 1 1 1 5 4 d .
        . 4 5 1 1 1 1 f 1 1 1 1 5 4 d .
        . 4 5 1 1 1 1 1 f 1 1 1 5 4 d .
        . 4 5 1 1 1 f f 1 1 1 1 5 4 d .
        . . 4 5 1 1 1 1 1 1 1 5 4 d d .
        . . 4 5 5 1 1 1 1 1 5 5 4 d . .
        . . . 4 4 5 5 5 5 5 4 4 d . . .
        . . . . . 4 4 4 4 4 d d . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_4 = img`
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . 4 4 5 5 5 5 5 4 4 . . . .
        . . 4 5 5 1 1 1 1 1 5 5 4 . . .
        . . 4 5 1 1 1 1 1 1 1 5 4 . . .
        . 4 5 1 1 1 f 1 f 1 1 1 5 4 . .
        . 4 5 1 1 1 f 1 f 1 1 1 5 4 d .
        . 4 5 1 1 1 f f f 1 1 1 5 4 d .
        . 4 5 1 1 1 1 1 f 1 1 1 5 4 d .
        . 4 5 1 1 1 1 1 f 1 1 1 5 4 d .
        . . 4 5 1 1 1 1 1 1 1 5 4 d d .
        . . 4 5 5 1 1 1 1 1 5 5 4 d . .
        . . . 4 4 5 5 5 5 5 4 4 d . . .
        . . . . . 4 4 4 4 4 d d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const tile_value_5 = img`
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . 4 4 5 5 5 5 5 4 4 . . . .
        . . 4 5 5 1 1 1 1 1 5 5 4 . . .
        . . 4 5 1 1 1 1 1 1 1 5 4 . . .
        . 4 5 1 1 1 f f f 1 1 1 5 4 . .
        . 4 5 1 1 1 f 1 1 1 1 1 5 4 d .
        . 4 5 1 1 1 f f 1 1 1 1 5 4 d .
        . 4 5 1 1 1 1 1 f 1 1 1 5 4 d .
        . 4 5 1 1 1 f f 1 1 1 1 5 4 d .
        . . 4 5 1 1 1 1 1 1 1 5 4 d d .
        . . 4 5 5 1 1 1 1 1 5 5 4 d . .
        . . . 4 4 5 5 5 5 5 4 4 d . . .
        . . . . . 4 4 4 4 4 d d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const microphone = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . b c . . . . . . .
. . . . . . b c c c . . . . . .
. . . . . . b c c c . . . . . .
. . . . . . b c c c . . . . . .
. . . . . . b c c c . . . . . .
. . . . f . c c c c . f . . . .
. . . . f . c c c c . f . . . .
. . . . f . . c c . . f . . . .
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
. . . . . c . . . . . . . . . .
. . . . c b . . . . . 8 . . . .
. . . c b c . . . 8 . . 8 . . .
. c c b c c . 8 . . 8 . 8 . . .
. b b c c c . . 8 . 8 . 8 . . .
. c c c c c . . 8 . 8 . 8 . . .
. c c c c c . 8 . . 8 . 8 . . .
. . . c c c . . . 8 . . 8 . . .
. . . . c c . . . . . 8 . . . .
. . . . . c . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`

    export const speakerQuiet = img`
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . c . . . . . . . . . .
. . . . c b . . . . . . . . . .
. . . c b c . . . . . . . . . .
. c c b c c . 8 . . . . . . . .
. b b c c c . . 8 . . . . . . .
. c c c c c . . 8 . . . . . . .
. c c c c c . 8 . . . . . . . .
. . . c c c . . . . . . . . . .
. . . . c c . . . . . . . . . .
. . . . . c . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . .
`
export const speakerFun = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . 3 . . . 5 . . .
    . . . . . . . 3 . . . . . . 2 .
    . . . . . c . . . . . 2 . 2 . .
    . . . . c b . . 2 . 2 . 2 . . .
    . . . c b c . 2 . 2 . . . . 5 .
    . c c b c c . . . . . . . . . .
    . b b c c c . 4 . 4 . 4 . 4 . .
    . c c c c c . . 4 . 4 . 4 . 4 .
    . c c c c c . . . . . . . . . .
    . . . c c c . 6 . 6 . 5 . . . .
    . . . . c c . . 6 . 6 . 6 . . .
    . . . . . c . . . . . 6 . 6 . .
    . . . . . . . 9 . . . . . . . .
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

    export const soundGiggle = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . . 4 5 5 5 5 5 4 . . . . .
        . . . 4 5 5 5 5 5 5 5 4 . . . .
        . . 4 5 5 f 5 5 5 f 5 5 4 . . .
        . . 4 5 f 5 f 5 f 5 f 5 4 d . .
        . . 4 3 3 5 5 5 5 5 3 3 4 d . .
        . . 4 5 5 f f f f f 5 5 4 d . .
        . . 4 5 5 f f 2 2 2 5 5 4 d . .
        . . . 4 5 5 f 2 2 5 5 4 d . . .
        . . . . 4 5 5 5 5 5 4 d . . . .
        . . . . . 4 4 4 4 4 d . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundHappy = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . . 4 5 5 5 5 5 4 . . . . .
        . . . 4 5 5 5 5 5 5 5 4 . . . .
        . . 4 5 5 f 5 5 5 f 5 5 4 . . .
        . . 4 5 5 f 5 5 5 f 5 5 4 d . .
        . . 4 5 5 5 5 5 5 5 5 5 4 d . .
        . . 4 5 5 f 5 5 5 f 5 5 4 d . .
        . . 4 5 5 5 f f f 5 5 5 4 d . .
        . . . 4 5 5 5 5 5 5 5 4 d . . .
        . . . . 4 5 5 5 5 5 4 d . . . .
        . . . . . 4 4 4 4 4 d . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundHello = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . 8 8 8 . .
        . . . . . . . . . . 8 . . . 8 .
        . . . . 4 4 4 4 . . . . 4 . . .
        . . . 4 5 5 5 5 4 . . 4 5 4 . .
        . . 4 5 f 5 5 f 5 4 . 8 8 8 d .
        . . 4 5 5 5 5 5 5 4 d 8 9 8 d .
        . . 4 5 f 5 5 f 5 4 8 9 9 8 d .
        . . 4 5 5 f f 5 5 4 8 9 8 d . .
        . . . 4 5 5 5 5 4 8 9 9 8 d . .
        . . . . 4 4 4 4 9 9 9 8 d . . .
        . . . 8 9 9 9 9 9 9 8 d . . . .
        . . 8 9 9 9 9 9 9 9 8 d . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundMysterious = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . 6 6 6 6 6 6 . . . . . .
        . . . 6 7 7 7 7 7 7 6 . . . . .
        . . f f 1 7 7 7 7 f 1 f . . . .
        . . f f f f 7 7 f f f f d . . .
        . . 6 f f f 7 7 f f f 6 d . . .
        . . 6 7 7 7 7 7 7 7 7 6 d . . .
        . . 6 7 7 f 7 7 f 7 7 6 d . . .
        . . . 6 7 7 f f 7 7 6 d . . . .
        . . . . 6 7 7 7 7 6 d . . . . .
        . . . . . 6 7 7 6 d . . . . . .
        . . . . . . 6 6 d . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundSad = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . . 4 5 5 5 5 5 4 . . . . .
        . . . 4 5 5 5 5 5 5 5 4 . . . .
        . . 4 5 5 f 5 5 5 f 5 5 4 . . .
        . . 4 5 5 f 5 5 5 f 5 5 4 d . .
        . . 4 5 5 5 5 5 5 5 5 5 4 d . .
        . . 4 5 5 5 f f f 5 5 5 4 d . .
        . . 4 5 5 f 5 5 5 f 5 5 4 d . .
        . . . 4 5 5 5 5 5 5 5 4 d . . .
        . . . . 4 5 5 5 5 5 4 d . . . .
        . . . . . 4 4 4 4 4 d . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundSlide = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . 2 2 2 e e e . . . .
        . . . . . 2 2 2 e e d e d . . .
        . . . . . 2 2 e d e e e d . . .
        . . . . . 2 2 e d e d e d . . .
        . . . . . 2 2 e d e e e d . . .
        . . . . . 2 2 e d e d e d . . .
        . . . . . 2 2 e d e e e d . . .
        . . . . 2 2 2 e d e d e d . . .
        . . . 2 2 2 e d . e e e d . . .
        . . 2 2 2 e d . . e d e d . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundSoaring = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 9 9 9 9 9 . . . . . .
        . . . . 9 1 9 9 9 9 9 . . . . .
        . . . 9 1 9 9 7 7 7 9 9 . . . .
        . . . 9 1 9 7 f 7 f 7 9 . . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 d . .
        . 6 9 5 9 5 9 5 9 5 9 5 9 6 d .
        . 8 8 8 8 8 8 8 8 8 8 8 8 8 d .
        . . . . . . 8 8 8 d . . . . . .
        . . . . 9 . . . . . 9 . . . . .
        . . . . . 9 9 9 9 9 . . . . . .
        . . . 9 . . . . . . . 9 . . . .
        . . . . 9 9 9 9 9 9 9 . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundSpring = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 2 d . . . . . . . . . . .
        . . 2 d . . 4 4 d . . . . . . .
        . 2 d . . 4 d d 5 d . . . . . .
        . 2 d . 4 d . . 5 d . . . . . .
        . d 4 4 d . . 5 d . . . . . . .
        . . d d . . 5 d . . 7 7 d . . .
        . . . . . 5 d . . 7 d d 9 d . .
        . . . . . 5 d . 7 d . . 9 d . .
        . . . . . d 7 7 d . . 9 d . . .
        . . . . . . d d . . 9 d . . . .
        . . . . . . . . . . d . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundTwinkle = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 3 . . . 3 . . . 3 . . . .
        . . 3 5 3 . . 3 . . . . . . . .
        . . . 3 . . 3 5 3 . . . . . . .
        . . . . . . 3 5 3 . . . . 3 . .
        . . . . 3 3 5 5 5 3 3 . . . . .
        . . 3 3 5 5 5 5 5 5 5 3 3 . . .
        . . . . 3 3 5 5 5 3 3 . . . . .
        . . . . . . 3 5 3 . . . . . . .
        . . . . . . 3 5 3 . . . 3 . . .
        . . . 3 . . . 3 . . . 3 5 3 . .
        . . . . . . . 3 . . . . 3 . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const soundYawn = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 4 4 4 4 4 . . . . . .
        . . . . 4 5 5 5 5 5 4 . . . . .
        . . . 4 5 5 5 5 5 5 5 4 . . . .
        . . 4 5 f f 5 5 5 f f 5 4 . . .
        . . 4 5 5 5 5 5 5 5 5 5 4 d . .
        . . 4 5 5 5 f f f 5 5 5 4 d . .
        . . 4 5 5 5 f f f 5 5 5 4 d . .
        . . 4 5 5 5 f 2 2 5 5 5 4 d . .
        . . . 4 5 5 5 5 5 5 5 4 d . . .
        . . . . 4 5 5 5 5 5 4 d . . . .
        . . . . . 4 4 4 4 4 d . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    export const moveShake = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . 8 . . 8 . .
        . . . 9 9 9 9 9 9 . . 8 . . 8 .
        . . . 9 6 6 6 6 6 . . . 8 . 8 .
        . . . 9 6 f f f f f f . 8 . 8 .
        . . . 9 6 f 5 5 5 5 f . . . . .
        . . . 9 6 f 5 5 5 5 f 6 9 . . .
        . . . . . f 5 5 5 5 f 6 9 . . .
        . 8 . 8 . f f f f f f 6 9 . . .
        . 8 . 8 . . . 6 6 6 6 6 9 . . .
        . 8 . . 8 . . 9 9 9 9 9 9 . . .
        . . 8 . . 8 . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    export const moveFall = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . 8 . . . 8 . . . . .
        . . . . . . 8 . 8 . 8 . . . . .
        . . . . . . 8 . 8 . 8 . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . 9 9 9 9 9 9 . . . . .
        . . . . . 9 9 9 9 9 9 . . . . .
        . . . . . 6 6 6 6 6 6 . . . . .
        . . . . . 6 6 6 6 6 6 . . . . .
        . . . . . f f f f f f . . . . .
        . . . . . f 5 5 5 5 f . . . . .
        . . . . . f 5 5 5 5 f . . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
`

    export const moveTiltDown = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . 8 8 8 8 . . . . .
    . . . . . . 8 . . . . . . . . .
    . . . . . 8 . . . . . . . . . .
    . . . 8 8 8 8 8 . . . . . . . .
    . . . . 8 8 8 9 9 9 9 9 9 9 . .
    . . . . 9 8 9 9 9 9 9 9 9 9 . .
    . . . . 9 9 9 9 9 9 9 9 9 9 . .
    . f f f f f f f f f 9 9 9 9 . .
    . . f 5 5 5 5 5 5 5 f 9 9 9 . .
    . . . f 5 5 5 5 5 5 5 f 9 9 . .
    . . . . f 5 5 5 5 5 5 5 f 9 . .
    . . . . . f f f f f f f f f . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const moveTiltUp = img`
. . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . 8 8 8 8 . . . . . .
    . . . . . . . . . . 8 . . . . .
    . . . . . . . . . . . 8 . . . .
    . . . . . . . . . 8 8 8 8 8 . .
    . . 9 9 9 9 9 9 9 9 8 8 8 . . .
    . . 9 9 9 9 9 9 9 9 9 8 . . . .
    . . 9 9 9 9 9 9 9 9 9 . . . . .
    . . 9 9 9 9 8 8 8 8 8 f f f . .
    . . 9 9 9 8 6 6 6 6 6 5 f . . .
    . . 9 9 8 6 6 6 6 6 6 f . . . .
    . . 9 8 6 6 6 6 6 6 8 . . . . .
    . . 8 8 8 8 8 8 8 8 9 . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const moveTiltLeft = img`
. . . . . . . . . . . . . . . .
    . . . . . . . . . . 8 . . . . .
    . . . . . . f f . 8 8 . . . . .
    . . . . . f 5 f 8 8 8 8 8 . . .
    . . 9 9 8 5 5 f 9 8 8 . . 8 . .
    . . 9 8 6 5 5 f 9 9 8 . . . 8 .
    . . 9 8 6 5 5 f 9 9 9 . . . 8 .
    . . 9 8 6 5 5 f 9 9 9 . . . 8 .
    . . 9 8 6 5 5 f 9 9 9 . . 8 . .
    . . 9 8 6 5 5 f 9 9 9 . . . . .
    . . 9 8 6 5 5 f 9 9 9 . . . . .
    . . 9 9 8 5 5 f 9 9 9 . . . . .
    . . . . . f 5 f . . . . . . . .
    . . . . . . f f . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const moveTiltRight = img`
    . . . . . . . . . . . . . . . .
    . . . . . 8 . . . . . . . . . .
    . . . . . 8 8 . f f . . . . . .
    . . . 8 8 8 8 8 f 5 f . . . . .
    . . 8 . . 8 8 9 f 5 5 8 9 9 . .
    . 8 . . . 8 9 9 f 5 5 6 8 9 . .
    . 8 . . . 9 9 9 f 5 5 6 8 9 . .
    . 8 . . . 9 9 9 f 5 5 6 8 9 . .
    . . 8 . . 9 9 9 f 5 5 6 8 9 . .
    . . . . . 9 9 9 f 5 5 6 8 9 . .
    . . . . . 9 9 9 f 5 5 6 8 9 . .
    . . . . . 9 9 9 f 5 5 8 9 9 . .
    . . . . . . . . f 5 f . . . . .
    . . . . . . . . f f . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const diceToss = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . b b b b b b b b . . .
    . . . . b 1 1 1 1 1 1 1 b b . .
    . . . b 1 1 1 b 1 1 1 b d b . .
    . . b 1 1 1 1 1 1 1 b d d b . .
    . . c b b b b b b b d d b b . .
    . . c b c b b b c b d d d b . .
    . . c b b b b b b b d d d b . .
    . . c b b b c b b b d b d b d .
    . . c b b b b b b b d d d b d .
    . . c b c b b b c b d d b d . .
    . . c b b b b b b b d b d . . .
    . . . c c c c c c c b d . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

    export const inPipeA = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . c c c c c c c c
    . . . . . . . c f c d d d d d d
    . . . . . . c 6 f f c 1 1 1 1 1
    . . . . . . c 9 6 f c d d f d d
    6 6 6 6 6 6 6 9 9 6 c d f d f d
    9 9 9 9 9 9 9 9 9 9 c d f f f d
    6 6 6 6 6 6 6 9 9 6 c d f d f d
    . . . . . . c 9 6 f c d f d f d
    . . . . . . c 6 f f c d d d d d
    . . . . . . . c f c b b b b b b
    . . . . . . . . c c c c c c c c
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const inPipeB = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . c c c c c c c c
    . . . . . . . c f c d d d d d d
    . . . . . . c 6 f f c 1 1 1 1 1
    . . . . . . c 9 6 f c d f f d d
    6 6 6 6 6 6 6 9 9 6 c d f d f d
    9 9 9 9 9 9 9 9 9 9 c d f f d d
    6 6 6 6 6 6 6 9 9 6 c d f d f d
    . . . . . . c 9 6 f c d f f d d
    . . . . . . c 6 f f c d d d d d
    . . . . . . . c f c b b b b b b
    . . . . . . . . c c c c c c c c
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const inPipeC = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . c c c c c c c c
    . . . . . . . c f c d d d d d d
    . . . . . . c 6 f f c 1 1 1 1 1
    . . . . . . c 9 6 f c d d f d d
    6 6 6 6 6 6 6 9 9 6 c d f d f d
    9 9 9 9 9 9 9 9 9 9 c d f d d d
    6 6 6 6 6 6 6 9 9 6 c d f d f d
    . . . . . . c 9 6 f c d d f d d
    . . . . . . c 6 f f c d d d d d
    . . . . . . . c f c b b b b b b
    . . . . . . . . c c c c c c c c
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const outPipeA = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    c c c c c c c c . . . . . . . .
    d d d d d d c f c . . . . . . .
    1 1 1 1 1 c f f f c . . 6 . . .
    d d f d d c f f f c . . 9 6 . .
    d f d f d c 6 6 6 6 6 6 9 9 6 .
    d f f f d c 9 9 9 9 9 9 9 9 9 6
    d f d f d c 6 6 6 6 6 6 9 9 6 .
    d f d f d c f f f c . . 9 6 . .
    d d d d d c f f f c . . 6 . . .
    b b b b b b c f c . . . . . . .
    c c c c c c c c . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const outPipeB = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    c c c c c c c c . . . . . . . .
    d d d d d d c f c . . . . . . .
    1 1 1 1 1 c f f f c . . 6 . . .
    d f f d d c f f f c . . 9 6 . .
    d f d f d c 6 6 6 6 6 6 9 9 6 .
    d f f d d c 9 9 9 9 9 9 9 9 9 6
    d f d f d c 6 6 6 6 6 6 9 9 6 .
    d f f d d c f f f c . . 9 6 . .
    d d d d d c f f f c . . 6 . . .
    b b b b b b c f c . . . . . . .
    c c c c c c c c . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`
    export const outPipeC = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    c c c c c c c c . . . . . . . .
    d d d d d d c f c . . . . . . .
    1 1 1 1 1 c f f f c . . 6 . . .
    d d f d d c f f f c . . 9 6 . .
    d f d f d c 6 6 6 6 6 6 9 9 6 .
    d f d d d c 9 9 9 9 9 9 9 9 9 6
    d f d f d c 6 6 6 6 6 6 9 9 6 .
    d d f d d c f f f c . . 9 6 . .
    d d d d d c f f f c . . 6 . . .
    b b b b b b c f c . . . . . . .
    c c c c c c c c . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
`

    export const sampleFlashingHeart = img`
    ....ffffffffffffffffffffffff....
    ..ffffffffffffffffffffffffffff..
    .ffffffffffffffffffffff2fffffff.
    .fffffffffffffffffffff212ff2fff.
    ffffffffffffffffffffff212f212fff
    ffffffffffffffffffffff212212ffff
    fffffffffffffffffffffff2212fffff
    ffffffff222222ffff222222f2222fff
    fffffff22222222ff2222222221112ff
    ffffff22111111222211111122222fff
    fffff2211111111221111111122fffff
    ffff221114444111111444411122ffff
    fff22111422224111142222411122fff
    fff221142ffff241142ffff241122fff
    fff221142ffff241142ffff241122fff
    fff2211142ffff2442ffff2411122fff
    ffff221142fffff22fffff241122ffff
    ffff2211142ffffffffff2411122ffff
    fffff2211142ffffffff2411122fffff
    ffffff2211142ffffff2411122ffffff
    fffffff22111422ff22411122fffffff
    ffffffff2211144224411122ffffffff
    fffffffff22111144111122fffffffff
    ffff222fff221111111122ffffffffff
    fff21112fff2221111222fffffffffff
    ffff2222ffff22211222ffffffffffff
    ffffff2122ffff2222ffffffffffffff
    fffff212212ffff22fffffffffffffff
    bfff212f212ffffffffffffffffffffb
    .ffff2ff212ffffffffffffffffffff.
    .bfffffff2ffffffffffffffffffffb.
    ..bbffffffffffffffffffffffffbb..
    ....bbbbbbbbbbbbbbbbbbbbbbbb....
`
    export const sampleSmileyButtons = img`
    ....111111111111111111111111....
    ..1111111111111111111111111111..
    .111111111111111111111111111111.
    .1111bbbbbbbbbbbbbbbb1111111111.
    1111b1111111111111111b1111111111
    1111b1111111111111111b1111111111
    1111b1111114444111111bd111111111
    1111b1111445555441111bd111111111
    1111b1114555555554111bd111111111
    1111b111455f55f554111bd111111111
    1111b114555f55f555411bd111111111
    1111b1145555555555411bd111111111
    1111b1145555555555411bd111111111
    1111b114555f55f555411bd111111111
    1111b1114555ff5554111bd111111111
    1111b1114555555554111bd111111111
    1111b1111445555441111bd111111111
    1111b1111114444111111bd111111111
    1111b111111111111111888811111111
    1111b111111111111118666681111111
    11111bbbbbb1111bbb86611668111111
    111111dddddb11bdd866166166811111
    11111111111b11bd.8661111668d1111
    11111111111db11bd8661661668d1111
    111111111111dbbbd8661661668d1111
    1111111111111ddd18866666688d1111
    11111111111111111188666688d11111
    1111111111111111111888888d111111
    b11111111111111111118888d111111b
    .111111111111111111111111111111.
    .b1111111111111111111111111111b.
    ..bb111111111111111111111111bb..
    ....bbbbbbbbbbbbbbbbbbbbbbbb....
`
    export const sampleDice = img`
    ....111111111111111111111111....
    ..1111111111111111111111111111..
    .111111111111111111111111111111.
    .111111111111111111111111111111.
    1111ccccc11111111111111111111111
    111111111c1111111111111111111111
    1111111111c111111111111111111111
    111cccc1111111111111111111111111
    1111111cc1111cccc111111111111111
    111111111111cdb11cc1111111111111
    11111111111cdddb111ccc1111111111
    111111111ccddddb111111c111111111
    11111111cddddddb111111cd11111111
    1111111cdddddddb1111111c11111111
    1111111cddcdddddb111c11c11111111
    1111111cddddddddb111111cd1111111
    11111111cdddddcdb1111111c1111111
    11111111cdddddddbbbb1111cd111111
    11111111cddddddbbbbbbbbb1c111111
    11111111cdddddbbbbcbbbbbbcd11111
    111111111cddbbbbbbbbbbcbbcd11111
    111111111cdbbbbbbbcbbbbbcd111111
    111111111cbbbbcbbbbbbbbcd1111111
    111111111cccbbbbbbcbbccd11111111
    111111111111cccccbbbcd1111111111
    11111111111111111cccd11111111111
    11111111111111111111111111111111
    11111111111111111111111111111111
    b111111111ddddddddddddddddd1111b
    .111111111111ddddddddddddd11111.
    .b1111111111111111111111111111b.
    ..bb111111111111111111111111bb..
    ....bbbbbbbbbbbbbbbbbbbbbbbb....
`
    export const sampleClapLights = img`
    ....fffff8ffffffffffffffffff....
    ..fffffff8ffffffffffffffffffff..
    .ffffffff8fffffffffffffffffffff.
    .ffffffff8fffffffffffffffffffff.
    fffffffff8ffffffffffffffffffffff
    fffffffff8ffffffffffffffffffffff
    fffffffffeffffffffffffffffffffff
    ffffffffeeefffffffffffffffffffff
    ffffffffeeefffffffffffffffffffff
    ffffffff444fffffffffffffffffffff
    fffffff45154ffffffff5fffffffffff
    ffffff4511154fffffff5fffffffffff
    ffffff4511154fffffff5fff5fffffff
    ffffff4511154fffffff5ff5ffffffff
    fffffff45554ffffffffff5fffffffff
    ffffffff444fffff444fffffffffffff
    fffffffffffffff44144fff5555fffff
    fffffffffffff44441144fffffffffff
    ffffffffffff4141141144ffffffffff
    ffffffffffff4414114144444fffffff
    ffffffffffff414141144141144fffff
    ffffffffffff4414141141141114ffff
    ffffffffffff41414141141144114fff
    fffff5555fff44141411111114114fff
    ffffffffffff41414111111114414fff
    fffffffff5fff4141111111111414fff
    ffffffff5fffff411111111111414fff
    fffffff5ff5ffff41111111111414fff
    bfffffffff5fffff41111111111414fb
    .fffffffff5ffffff4111111111414f.
    .bffffffffffffffff444111111411b.
    ..bbfffffffffffffffff4111111bb..
    ....bbbbbbbbbbbbbbbbbbbbbbbb....
`
    export const sampleRockPaperScissors = img`
    ....111111111111111111111111....
    ..1111111111111111111111111111..
    .111111111111111111111111111111.
    .1111111111111111111c1111111111.
    1111111111111111111c1ccc11111111
    11111111ccc11111111c1111cc111111
    1111111c422c111111c11d1111c11111
    1111ccc42222c11111c111dd11cd1111
    111c42c42c42cd1111c1111111cd1111
    11c422242c42cd1111c1dd111cdd1111
    11c42c242c42cd111c1111d11cd11111
    11c42cc44222cd111c1111111cd11111
    11c222cc442cd111c11dd1111cd11111
    111c2224ccccd111c1111d11cd111111
    1111ccccc1cdcd111cc11111cd111111
    11111111c1cd1cd1111cc11cd1111111
    11111111c1cc11cd11111ccd11111111
    11111111c1cdc11cd111111111111111
    11111111c1cd1c11cd11111111111111
    11111111c1cd11c1cd11ccccc1111111
    11111111c1cd111cd11cddddbc111111
    11111111c1cd111111cd11ddbbc11111
    11111111c1cd11111cd1dddddbbc1111
    111111111cd11111cdddddddbbbcd111
    1111111111111111cddddddbdbbcd111
    1111111111111111cdddddbdbbbcd111
    11111111111111111cdddbdbbbcd1111
    111111111111111111cbbbbbccd11111
    b111111111111111111cccccdd11111b
    .111111111111111111111111111111.
    .b1111111111111111111111111111b.
    ..bb111111111111111111111111bb..
    ....bbbbbbbbbbbbbbbbbbbbbbbb....
`
    export const sampleTeleportDuck = img`
    ....111111111111111111111111....
    ..1111111111111111111111111111..
    .111111111111111611111111111111.
    .161111111111116161111111161111.
    11161111b11111116111116611611111
    11116111111111511111111666111111
    11161611111111111111511611111111
    1111611111fff1111111666161111111
    11161111ff555ff111161116111b1111
    1111611f55fff55f1116111111b1b111
    111111f55f111f55f1611115111b1111
    111111f55f1f1f55f611111111111111
    111111f55f111f55f111166661111111
    1111fffff5fff555f111611116115111
    111f44444f555555fffffff111611111
    1111ffffff5555555555555f11611111
    1111111f5555555555555555f1611111
    1115116f555555554444455556111111
    11111611f5555555555545556f666111
    11116166f5555555555546665f111611
    11111661f5555555556665555fd11161
    1111611666666666665545555fd15161
    111661111f555555544455555fd11611
    1111166661f555555555555566666111
    1111111116666666666666665f111611
    111111111111ffff5555555ffd116111
    1111111111111111fffffffdd1116111
    1111116661111111ff44fd1111156111
    b11666111151111f44444fd11111161b
    .111161111111111fffffd111111111.
    .b1111111111111111111111111111b.
    ..bb111111111111111111111111bb..
    ....bbbbbbbbbbbbbbbbbbbbbbbb....
`
    export const settingsGear = img`
    . . . . . . . . . . . . . . . .
    . . . . . . . d d . . . . . . .
    . . . d d . d b b c . d d . . .
    . . d b b c d b b c d b b c . .
    . . d b b b b b b b b b b c . .
    . . . c b d b c c b d b c . . .
    . . d d b b c . . c b b d d . .
    . d b b b c . . . . c b b b c .
    . d b b b c . . . . c b b b c .
    . . c c b b c . . c b b c c . .
    . . . d b d b c c b d b c . . .
    . . d b b b b b b b b b b c . .
    . . d b b c c b b c c b b c . .
    . . . c c . c b b c . c c . . .
    . . . . . . . c c . . . . . . .
    . . . . . . . . . . . . . . . .
`

    const one = img`
. . . . . .
. . f f . .
. f f f . .
. . f f . .
. . f f . .
. . f f . .
. f f f f .
. . . . . .
`

    const two = img`
. . . . . .
. . f f . .
. f . . f .
. . . . f .
. . f f . .
. f f . . .
. f f f f .
. . . . . .
`
    const three = img`
. . . . . .
. f f f . .
. . . . f .
. . f f f .
. . . . f .
. . . . f .
. f f f . .
. . . . . .
`
    const four = img`
. . . . . .
. f . . f .
. f . . f .
. f f f f .
. . . . f .
. . . . f .
. . . . f .
. . . . . .
`
    const five = img`
. . . . . .
. f f f f .
. f . . . .
. f f f . .
. . . . f .
. . . . f .
. f f f . .
. . . . . .
`

    export const oneToFive = [one, two, three, four, five]

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

    */
}
