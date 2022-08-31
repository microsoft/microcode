namespace microcode {
    export type ButtonStyle = "white" | "beige" | "clear" | "danger";

    export class icons {
        static reg: {[name: string]: ImageG } = {};

        public static get(name: string, nullIfMissing = false): ImageG {
            let icon = this.reg[name];
            if (!icon && !nullIfMissing) {
                icon = this.reg["MISSING"];
            }
            return icon;
        }

        public static init() {
            this.reg["cursor"] = icondb.cursor;
            this.reg["stylus"] = icondb.stylus;
            this.reg["button_white"] = icondb.btn_bknd_white;
            this.reg["button_beige"] = icondb.btn_bknd_beige;
            this.reg["button_clear"] = icondb.btn_bknd_clear;
            this.reg["button_danger"] = icondb.btn_bknd_danger;
            this.reg["edit"] = icondb.btn_edit;
            this.reg["delete"] = icondb.btn_delete;
            this.reg["cancel"] = icondb.btn_cancel;
            this.reg["ok"] = icondb.btn_ok;
            this.reg["plus"] = icondb.btn_plus;
            this.reg["new_file"] = icondb.btn_new_file;
            this.reg["log"] = icondb.btn_log;
            this.reg["plot"] = icondb.btn_plot;
            this.reg["dpad_left"] = icondb.btn_dpad_left;
            this.reg["when"] = icondb.ui_when;
            this.reg["do"] = icondb.ui_do;
            this.reg["insertion_point"] = icondb.btn_insertion_point;
            this.reg["next_page"] = icondb.btn_next_page;
            this.reg["prev_page"] = icondb.btn_prev_page;
            this.reg["MISSING"] = icondb.MISSING;
            this.reg[tid.sensor.button_a] = icondb.tile_button_a;
            this.reg[tid.sensor.button_b] = icondb.tile_button_b;
            this.reg[tid.sensor.timer] = icondb.tile_timer;
            this.reg[tid.sensor.pin_1] = icondb.tile_pin_1;
            this.reg[tid.modifier.page_1] = icondb.tile_page_1;
            this.reg[tid.modifier.page_2] = icondb.tile_page_2;
            this.reg[tid.modifier.page_3] = icondb.tile_page_3;
            this.reg[tid.modifier.page_4] = icondb.tile_page_4;
            this.reg[tid.modifier.page_5] = icondb.tile_page_5;
            this.reg[tid.modifier.pin_on] = icondb.tile_pin_on;
            this.reg[tid.modifier.pin_off] = icondb.tile_pin_off;
            this.reg[tid.modifier.happy] = icondb.happy
            this.reg[tid.modifier.sad] = icondb.sad
            this.reg[tid.modifier.color_white] = icondb.tile_white;
            this.reg[tid.modifier.color_red] = icondb.tile_red;
            this.reg[tid.modifier.color_pink] = icondb.tile_pink;
            this.reg[tid.modifier.color_orange] = icondb.tile_orange;
            this.reg[tid.modifier.color_yellow] = icondb.tile_yellow;
            this.reg[tid.modifier.color_teal] = icondb.tile_teal;
            this.reg[tid.modifier.color_green] = icondb.tile_green;
            this.reg[tid.modifier.color_blue] = icondb.tile_blue;
            this.reg[tid.modifier.color_lightblue] = icondb.tile_lightblue;
            this.reg[tid.modifier.color_purple] = icondb.tile_purple;
            this.reg[tid.modifier.color_lightpurple] = icondb.tile_lightpurple;
            this.reg[tid.modifier.color_darkpurple] = icondb.tile_darkpurple;
            this.reg[tid.modifier.color_tan] = icondb.tile_tan;
            this.reg[tid.modifier.color_brown] = icondb.tile_brown;
            this.reg[tid.modifier.color_black] = icondb.tile_black;
            this.reg[tid.filter.timespan_short] = icondb.tile_timespan_short;
            this.reg[tid.filter.timespan_long] = icondb.tile_timespan_long;
            this.reg[tid.filter.pin_analog] = icondb.tile_pin_analog;
            this.reg[tid.filter.pin_digital] = icondb.tile_pin_digital;
            this.reg[tid.actuator.switch_page] = icondb.tile_switch_page;
            this.reg[tid.actuator.pin_0] = icondb.tile_pin_0;
            this.reg[tid.actuator.paint] = icondb.paint;
            this.reg[tid.actuator.stamp] = icondb.stamp;
            this.reg[RuleCondition.DEFAULT] = icondb.rc_default;
            this.reg[RuleCondition.HIGH] = icondb.rc_high;
            this.reg[RuleCondition.LOW] = icondb.rc_low;
            this.reg[RuleCondition.LOW_TO_HIGH] = icondb.rc_low_to_high;
            this.reg[RuleCondition.HIGH_TO_LOW] = icondb.rc_high_to_low;
        }
    }
}

// - upscale 5x5 image to 16 x 16
function scaleUp(led55: ImageG) {
    const ret = image.create(16, 16)
    ret.fill(15)
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const color = led55.getPixel(col, row) ? 2 : 12;
            const nrow = 1 + row * 3, ncol = 1 + col * 3
            ret.setPixel(ncol, nrow, color)
            ret.setPixel(ncol + 1, nrow, color)
            ret.setPixel(ncol, nrow + 1, color)
            ret.setPixel(ncol + 1, nrow + 1, color)
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
    export const btn_delete = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f . . . f f . . . .
        . . . . f 2 2 f . f 2 2 f . . .
        . . . . f 2 2 2 f 2 2 2 f . . .
        . . . . . f 2 2 2 2 2 f . . . .
        . . . . . . f 2 2 2 f . . . . .
        . . . . . f 2 2 2 2 2 f . . . .
        . . . . f 2 2 2 f 2 2 2 f . . .
        . . . . f 2 2 f . f 2 2 f . . .
        . . . . . f f . . . f f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;

    export const paint = img`
        f f f f f f f f f f f f f f f f
        f f f f f f f f f f f f f f f f
        f f f f 4 1 4 1 4 1 4 1 f f f f
        f f f f 4 1 4 1 4 1 4 1 f f f f
        f f f f 1 1 1 1 1 1 1 1 f f f f
        f f f f 1 1 1 1 1 1 1 1 f f f f
        f f f f 9 9 9 9 9 9 9 9 f f f f
        f f f f d e e e e e e e f f f f
        f f f f d e e e e e e e f f f f
        f f f f f f d e e e f f f f f f
        f f f f f f d e e e f f f f f f
        f f f f f f d e e e f f f f f f
        f f f f f f d f f e f f f f f f
        f f f f f f d e e e f f f f f f
        f f f f f f f f f f f f f f f f
        f f f f f f f f f f f f f f f f
    `;

    export const stamp = img`
        f f f f f f f f f f f f f f f f
        f f f f f f 2 2 2 2 f f f f f f
        f f f f f 2 2 f f 2 2 f f f f f
        f f f f f 2 f f f f 2 f f f f f
        f f f f f 2 2 f f 2 2 f f f f f
        f f f f f f 2 2 2 2 f f f f f f
        f f f f f f f 2 2 f f f f f f f
        f f f f f f f 2 2 f f f f f f f
        f f f f f f f 2 2 f f f f f f f
        f f f 2 2 2 2 2 2 2 2 2 2 f f f
        f f 2 2 2 2 2 2 2 2 2 2 2 2 f f
        f f 2 2 2 2 2 2 2 2 2 2 2 2 f f
        f f 2 2 2 2 2 2 2 2 2 2 2 2 f f
        f f f c c c c c c c c c c f f f
        f f f 3 3 3 3 3 3 3 3 3 3 f f f
        f f f f f f f f f f f f f f f f
    `;

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
    `;
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
    `;
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
    `;
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
    `;
    ///
    /// LANGUAGE TILES
    ///
    export const tile_button_a = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . f 6 6 6 1 1 1 6 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 1 1 1 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 6 6 6 6 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_button_b = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . f 6 6 1 1 1 1 6 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 1 1 6 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 6 6 1 6 6 f . . .
        . . f 6 6 1 1 1 1 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
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
        . . f 5 f 5 5 5 5 f 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_pin_1 = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f . . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 f f 5 5 5 f 5 5 f . . .
        . . f 5 f 5 f 5 f f 5 5 f . . .
        . . f 5 f f 5 5 5 f 5 5 f . . .
        . . f 5 f 5 5 5 f f f 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_pin_on = img`
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
    `;
    export const tile_pin_off = img`
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
    `;
    export const tile_pin_analog = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 6 6 6 6 6 6 6 6 6 . . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 . . .
        . . 6 6 6 6 6 6 5 5 5 6 6 . . .
        . . 6 6 6 6 6 5 5 6 6 6 6 . . .
        . . 6 6 6 6 5 5 6 6 6 6 6 . . .
        . . 6 6 9 6 5 6 9 6 9 6 6 . . .
        . . 6 6 6 6 5 6 6 6 6 6 6 . . .
        . . 6 6 6 5 5 6 6 6 6 6 6 . . .
        . . 6 6 5 5 6 6 6 6 6 6 6 . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 . . .
        . . . 6 6 6 6 6 6 6 6 6 . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_pin_digital = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 6 6 6 6 6 6 6 6 6 . . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 . . .
        . . 6 6 6 6 6 5 5 5 5 6 6 . . .
        . . 6 6 6 6 6 5 6 6 6 6 6 . . .
        . . 6 6 6 6 6 5 6 6 6 6 6 . . .
        . . 6 6 9 6 9 5 9 6 9 6 6 . . .
        . . 6 6 6 6 6 5 6 6 6 6 6 . . .
        . . 6 6 6 6 6 5 6 6 6 6 6 . . .
        . . 6 6 5 5 5 5 6 6 6 6 6 . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 . . .
        . . . 6 6 6 6 6 6 6 6 6 . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_console = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f f f f f f f . . .
        . . f f f f f f f f f f f f . .
        . . f f f f f f f f f f f f . .
        . . f f 7 f f f f f f f f f . .
        . . f f f 7 f f f f f f f f . .
        . . f f f f 7 f f f f f f f . .
        . . f f f 7 f f f f f f f f . .
        . . f f 7 f f f 7 7 7 f f f . .
        . . f f f f f f f f f f f f . .
        . . f f f f f f f f f f f f . .
        . . . f f f f f f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_graph = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . 6 6 6 6 6 6 6 6 6 6 . . .
        . . 6 6 6 6 6 6 6 6 6 6 6 6 . .
        . . 6 6 6 6 6 6 6 6 6 6 6 6 . .
        . . 6 6 6 6 5 5 5 6 6 6 6 6 . .
        . . 6 6 6 5 6 6 6 5 6 6 6 6 . .
        . . 6 6 5 6 6 6 6 6 5 6 6 6 . .
        . . 6 6 5 6 6 6 6 6 6 5 6 6 . .
        . . 6 5 6 6 6 6 6 6 6 6 5 6 . .
        . . 6 6 6 6 6 6 6 6 6 6 6 6 . .
        . . 6 6 6 6 6 6 6 6 6 6 6 6 . .
        . . . 6 6 6 6 6 6 6 6 6 6 . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_white = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 1 1 1 1 1 1 f . . . .
        . . . f 1 1 1 1 1 1 1 1 f . . .
        . . . f 1 1 1 1 1 1 1 1 f . . .
        . . . f 1 1 1 1 1 1 1 1 f . . .
        . . . f 1 1 1 1 1 1 1 1 f . . .
        . . . f 1 1 1 1 1 1 1 1 f . . .
        . . . f 1 1 1 1 1 1 1 1 f . . .
        . . . . f 1 1 1 1 1 1 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
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
    `;
    export const tile_pink = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 3 3 3 3 3 3 f . . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . f 3 3 3 3 3 3 3 3 f . . .
        . . . . f 3 3 3 3 3 3 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_orange = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 4 4 4 4 4 4 f . . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . f 4 4 4 4 4 4 4 4 f . . .
        . . . . f 4 4 4 4 4 4 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_yellow = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 5 5 5 5 5 5 f . . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . f 5 5 5 5 5 5 5 5 f . . .
        . . . . f 5 5 5 5 5 5 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_teal = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 6 6 6 6 6 6 f . . . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . . f 6 6 6 6 6 6 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_green = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 7 7 7 7 7 7 f . . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . f 7 7 7 7 7 7 7 7 f . . .
        . . . . f 7 7 7 7 7 7 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_blue = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 8 8 8 8 8 8 f . . . .
        . . . f 8 8 8 8 8 8 8 8 f . . .
        . . . f 8 8 8 8 8 8 8 8 f . . .
        . . . f 8 8 8 8 8 8 8 8 f . . .
        . . . f 8 8 8 8 8 8 8 8 f . . .
        . . . f 8 8 8 8 8 8 8 8 f . . .
        . . . f 8 8 8 8 8 8 8 8 f . . .
        . . . . f 8 8 8 8 8 8 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_lightblue = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 9 9 9 9 9 9 f . . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . f 9 9 9 9 9 9 9 9 f . . .
        . . . . f 9 9 9 9 9 9 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_purple = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f a a a a a a f . . . .
        . . . f a a a a a a a a f . . .
        . . . f a a a a a a a a f . . .
        . . . f a a a a a a a a f . . .
        . . . f a a a a a a a a f . . .
        . . . f a a a a a a a a f . . .
        . . . f a a a a a a a a f . . .
        . . . . f a a a a a a f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_lightpurple = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f b b b b b b f . . . .
        . . . f b b b b b b b b f . . .
        . . . f b b b b b b b b f . . .
        . . . f b b b b b b b b f . . .
        . . . f b b b b b b b b f . . .
        . . . f b b b b b b b b f . . .
        . . . f b b b b b b b b f . . .
        . . . . f b b b b b b f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
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
    `;
    export const tile_tan = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f d d d d d d f . . . .
        . . . f d d d d d d d d f . . .
        . . . f d d d d d d d d f . . .
        . . . f d d d d d d d d f . . .
        . . . f d d d d d d d d f . . .
        . . . f d d d d d d d d f . . .
        . . . f d d d d d d d d f . . .
        . . . . f d d d d d d f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_brown = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f e e e e e e f . . . .
        . . . f e e e e e e e e f . . .
        . . . f e e e e e e e e f . . .
        . . . f e e e e e e e e f . . .
        . . . f e e e e e e e e f . . .
        . . . f e e e e e e e e f . . .
        . . . f e e e e e e e e f . . .
        . . . . f e e e e e e f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_black = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f f f f f f f f . . . .
        . . . f f f f f f f f f f . . .
        . . . f f f f f f f f f f . . .
        . . . f f f f f f f f f f . . .
        . . . f f f f f f f f f f . . .
        . . . f f f f f f f f f f . . .
        . . . f f f f f f f f f f . . .
        . . . . f f f f f f f f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    ///
    /// RULE CONDITIONS
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
    `;
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
    `;
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
    `;
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
    `;
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
    `;
    ///
    /// FEELINGS
    ///
    export const emo_happy = img`
        . . f f f f f . .
        . f 9 9 9 9 9 f .
        f 6 1 1 9 1 1 9 f
        f 6 1 f 9 f 1 9 f
        f 6 9 9 9 9 9 9 f
        f 6 f 9 9 9 f 9 f
        f 6 6 f f f 9 9 f
        . f 6 6 6 9 9 f .
        . . f f f f f . .
    `
    export const emo_angry = img`
        . . f f f f f . .
        . f 4 4 4 4 4 f .
        f 2 f 4 4 4 f 4 f
        f 2 1 f 4 f 1 4 f
        f 2 4 4 4 4 4 4 f
        f 2 4 4 4 4 4 4 f
        f 2 2 f f f 4 4 f
        . f 2 2 2 4 4 f .
        . . f f f f f . .
    `
    export const emo_heart = img`
        . . f f . f f . .
        . f 4 4 f 4 4 f .
        f 2 2 2 4 2 2 4 f
        f 2 2 2 2 2 2 4 f
        f 2 2 2 2 2 2 4 f
        . f 2 2 2 2 4 f .
        . . f 2 2 2 f . .
        . . . f 2 f . . .
        . . . . f . . . .
    `
    export const emo_sad= img`
        . . f f f f f . .
        . f b b b b b f .
        f c 1 1 b 1 1 b f
        f c 1 f b f 1 b f
        f c 9 9 b 9 9 b f
        f c b b b b b b f
        f c c f f f b b f
        . f c c c b b f .
        . . f f f f f . .
    `
}