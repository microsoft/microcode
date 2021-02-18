namespace kojac {
    export type ButtonStyle = "white" | "beige" | "clear" | "danger";

    export class icons {
        static reg: {[name: string]: Image } = {};

        public static get(name: string, nullIfMissing = false): Image {
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
            this.reg[tid.modifier.page_1] = icondb.tile_page_1;
            this.reg[tid.modifier.page_2] = icondb.tile_page_2;
            this.reg[tid.modifier.page_3] = icondb.tile_page_3;
            this.reg[tid.modifier.page_4] = icondb.tile_page_4;
            this.reg[tid.modifier.page_5] = icondb.tile_page_5;
            this.reg[tid.filter.express_none] = this.reg[tid.modifier.express_none] = icondb.tile_express_none;
            this.reg[tid.filter.express_happy] = this.reg[tid.modifier.express_happy] = icondb.tile_express_happy;
            this.reg[tid.filter.express_angry] = this.reg[tid.modifier.express_angry] = icondb.tile_express_angry;
            this.reg[tid.filter.express_sad] = this.reg[tid.modifier.express_sad] = icondb.tile_express_sad;
            this.reg[tid.filter.express_heart] = this.reg[tid.modifier.express_heart] = icondb.tile_express_heart;
            this.reg[tid.filter.timespan_short] = icondb.tile_timespan_short;
            this.reg[tid.filter.timespan_long] = icondb.tile_timespan_long;
            this.reg[tid.actuator.switch_page] = icondb.tile_switch_page;
            this.reg[tid.actuator.express] = icondb.tile_express;
            this.reg[RuleCondition.DEFAULT] = icondb.rc_default;
            this.reg[RuleCondition.HIGH] = icondb.rc_high;
            this.reg[RuleCondition.LOW] = icondb.rc_low;
            this.reg[RuleCondition.LOW_TO_HIGH] = icondb.rc_low_to_high;
            this.reg[RuleCondition.HIGH_TO_LOW] = icondb.rc_high_to_low;
        }
    }
}

namespace icondb {
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
        .7777777777777777.
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        7................7
        .7777777777777777.
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
        . . . . c c . . . c c . . . . .
        . . . . c c c . c c c . . . . .
        . . . . b c c c c c b . . . . .
        . . . . . b c c c b . . . . . .
        . . . . . c c c c c . . . . . .
        . . . . c c c b c c c . . . . .
        . . . . c c b . b c c . . . . .
        . . . . b b . . . b b . . . . .
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
        . . . . . f f f f f . . . . . .
        . . . . . f 5 5 5 f . . . . . .
        . . . . . f 5 5 5 f . . . . . .
        . . f f f f 5 5 5 f f f f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f 5 5 5 5 5 5 5 5 5 f . . .
        . . f f f f 5 5 5 f f f f . . .
        . . . . . f 5 5 5 f . . . . . .
        . . . . . f 5 5 5 f . . . . . .
        . . . . . f f f f f . . . . . .
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
    export const tile_express_none = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . . . . f d d d d d f . . .
        . . . . . f d d d d d d d f . .
        . . . . f b d 1 1 d 1 1 d d f .
        . . . . f b d 1 f d f 1 d d f .
        . . . . f b d d d d d d d d f .
        . . . . f b d d d d d d d d f .
        . . . . f b b d f f f d d d f .
        . . f f f f b b d d d d d f . .
        . f 1 1 1 1 f b b b b b f . . .
        . f 1 f 1 f 1 f f f f f . . . .
        . f 1 1 1 1 1 f . . . . . . . .
        . f f f f f f . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_express_happy = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . . . . f 9 9 9 9 9 f . . .
        . . . . . f 9 9 9 9 9 9 9 f . .
        . . . . f 6 9 1 1 9 1 1 9 9 f .
        . . . . f 6 9 1 f 9 f 1 9 9 f .
        . . . . f 6 9 9 9 9 9 9 9 9 f .
        . . . . f 6 f 9 9 9 9 9 f 9 f .
        . . . . f 6 6 f f f f f 9 9 f .
        . . f f f f 6 6 9 9 9 9 9 f . .
        . f 1 1 1 1 f 6 6 6 6 6 f . . .
        . f 1 f 1 f 1 f f f f f . . . .
        . f 1 1 1 1 1 f . . . . . . . .
        . f f f f f f . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_express_angry = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . . . . f 4 4 4 4 4 f . . .
        . . . . . f f 4 4 4 4 4 f f . .
        . . . . f 2 4 f 4 4 4 f 4 4 f .
        . . . . f 2 4 1 f 4 f 1 4 4 f .
        . . . . f 2 4 1 f 4 f 1 4 4 f .
        . . . . f 2 4 4 4 4 4 4 4 4 f .
        . . . . f 2 2 f f f f f 4 4 f .
        . . f f f f 2 2 4 4 4 4 4 f . .
        . f 1 1 1 1 f 2 2 2 2 2 f . . .
        . f 1 f 1 f 1 f f f f f . . . .
        . f 1 1 1 1 1 f . . . . . . . .
        . f f f f f f . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_express_sad = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . . . . f b b b b b f . . .
        . . . . . f b b b b b b b f . .
        . . . . f c b 1 1 b 1 1 b b f .
        . . . . f c b 1 f b f 1 b b f .
        . . . . f c b 9 9 b 9 9 b b f .
        . . . . f c b b b b b b b b f .
        . . . . f c c b f f f b b b f .
        . . f f f f c c b b b b b f . .
        . f 1 1 1 1 f c c c c c f . . .
        . f 1 f 1 f 1 f f f f f . . . .
        . f 1 1 1 1 1 f . . . . . . . .
        . f f f f f f . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_express_heart = img`
        . . . . . . . . . . . . . . . .
        . . . . . . f f . . . f f . . .
        . . . . . f 4 4 f . f 4 4 f . .
        . . . . f 2 2 2 4 f 4 2 2 4 f .
        . . . . f 2 2 2 2 4 2 2 2 4 f .
        . . . . f 2 2 2 2 2 2 2 2 4 f .
        . . . . f 2 2 2 2 2 2 2 2 4 f .
        . . . . . f 2 2 2 2 2 2 2 f . .
        . . . . . . f 2 2 2 2 2 f . . .
        . . f f f f f f 2 2 2 f . . . .
        . f 1 1 1 1 1 f f 2 f . . . . .
        . f 1 f 1 f 1 f . f . . . . . .
        . f 1 1 1 1 1 f . . . . . . . .
        . f f f f f f . . . . . . . . .
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
    export const tile_express = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . f f f f f . . .
        . . . . . . . f 1 1 1 1 1 f . .
        . . . . . . . f 1 f 1 f 1 f . .
        . . . . . . . f 1 1 1 1 1 f . .
        . . . f f f f f f 1 1 f f . . .
        . . f 9 9 9 9 9 f 1 f . . . . .
        . f 9 1 f 9 f 1 f f . . . . . .
        . f 6 1 f 9 f 1 9 f . . . . . .
        . f 6 1 1 9 1 1 9 f . . . . . .
        . f 6 9 9 9 9 9 9 f . . . . . .
        . f 6 6 9 9 9 9 9 f . . . . . .
        . . f 6 6 6 6 6 f . . . . . . .
        . . . f f f f f . . . . . . . .
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