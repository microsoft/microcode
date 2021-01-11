namespace kodu {
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
            this.reg["cursor"] = icondb.ui_cursor;
            this.reg["kodu"] = this.reg[tid.filter.kodu] = this.reg[tid.modifier.kodu] = icondb.char_kodu;
            this.reg["apple"] = this.reg[tid.filter.apple] = this.reg[tid.modifier.apple] = icondb.char_apple;
            this.reg["tree"] = this.reg[tid.filter.tree] = this.reg[tid.modifier.tree] = icondb.char_tree;
            this.reg["play"] = icondb.btn_play;
            this.reg["stop"] = icondb.btn_stop;
            this.reg["object_mode"] = icondb.btn_object_mode;
            this.reg["terrain_mode"] = icondb.btn_terrain_mode;
            this.reg["focus"] = icondb.btn_focus;
            this.reg["underline"] = icondb.btn_underline;
            this.reg["button_white"] = icondb.btn_bknd_white;
            this.reg["button_beige"] = icondb.btn_bknd_beige;
            this.reg["button_clear"] = icondb.btn_bknd_clear;
            this.reg["button_danger"] = icondb.btn_bknd_danger;
            this.reg["edit"] = icondb.btn_edit;
            this.reg["move"] = icondb.btn_move;
            this.reg["duplicate"] = icondb.btn_duplicate;
            this.reg["delete"] = icondb.btn_delete;
            this.reg["carry"] = icondb.btn_carry;
            this.reg["cancel"] = icondb.btn_cancel;
            this.reg["ok"] = icondb.btn_ok;
            this.reg["plus"] = icondb.btn_plus;
            this.reg["new_file"] = icondb.btn_new_file;
            this.reg["when"] = icondb.ui_when;
            this.reg["do"] = icondb.ui_do;
            this.reg["insertion-point"] = icondb.btn_insertion_point;
            this.reg["MISSING"] = icondb.MISSING;
            this.reg[tid.sensor.see] = icondb.tile_see;
            this.reg[tid.sensor.dpad] = icondb.tile_dpad;
            this.reg[tid.sensor.button_a] = icondb.tile_button_a;
            this.reg[tid.sensor.button_b] = icondb.tile_button_b;
            this.reg[tid.sensor.bump] = icondb.tile_bump;
            this.reg[tid.sensor.timer] = icondb.tile_timer;
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
            this.reg[tid.filter.me] = this.reg[tid.modifier.me] = icondb.tile_me;
            this.reg[tid.filter.it] = this.reg[tid.modifier.it] = icondb.tile_it;
            this.reg[tid.filter.faraway] = icondb.tile_faraway;
            this.reg[tid.filter.nearby] = icondb.tile_nearby;
            this.reg[tid.filter.timespan_short] = icondb.tile_timespan_short;
            this.reg[tid.filter.timespan_long] = icondb.tile_timespan_long;
            this.reg[tid.actuator.move] = icondb.tile_move;
            this.reg[tid.actuator.switch_page] = icondb.tile_switch_page;
            this.reg[tid.actuator.camera_follow] = icondb.tile_camera_follow;
            this.reg[tid.actuator.vanish] = icondb.tile_vanish;
            this.reg[tid.actuator.express] = icondb.tile_express;
            this.reg[tid.modifier.toward] = icondb.tile_toward;
            this.reg[tid.modifier.away] = icondb.tile_away;
            this.reg[tid.modifier.avoid] = icondb.tile_avoid;
            this.reg[tid.modifier.quickly] = icondb.tile_quickly;
            this.reg[tid.modifier.slowly] = icondb.tile_slowly;
            this.reg[RuleCondition.DEFAULT] = icondb.rc_default;
            this.reg[RuleCondition.HIGH] = icondb.rc_high;
            this.reg[RuleCondition.LOW] = icondb.rc_low;
            this.reg[RuleCondition.LOW_TO_HIGH] = icondb.rc_low_to_high;
            this.reg[RuleCondition.HIGH_TO_LOW] = icondb.rc_high_to_low;
            this.reg[Feeling.Happy] = icondb.emo_happy;
            this.reg[Feeling.Angry] = icondb.emo_angry;
            this.reg[Feeling.Heart] = icondb.emo_heart;
            this.reg[Feeling.Sad] = icondb.emo_sad;
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
    export const ui_cursor = img`
        . . f f f . .
        . . f 5 f . .
        f f f 5 f f f
        f 5 5 5 5 5 f
        f f f 5 f f f
        . . f 5 f . .
        . . f f f . .
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
    export const btn_object_mode = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f f . . . . . . . . .
        . . f 9 9 9 9 f . . . . . . . .
        . . f 9 3 3 3 f f f f f f f . .
        . f 9 3 1 3 1 f 7 7 7 7 7 7 f .
        . f 9 3 f 3 f f 7 7 7 7 7 7 f .
        . f 9 3 3 3 3 f 7 7 7 7 7 7 f .
        . f 9 9 9 9 9 f f 7 e e 7 7 f .
        . . f f f f f f . f e e f f . .
        . . . . . . . . . f e e f . . .
        . . . . . . . . f e e e f . . .
        . . . . . . . . f f f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const btn_terrain_mode = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f f . . . . 6 6 6 6 . .
        . . . f e e f . . . 6 6 6 6 . .
        . . . f e e f . . . 6 6 6 6 . .
        . . . f e e f . . . . . . . . .
        . . f f e e f f . . 4 4 4 4 . .
        . f e e e e e e f . 4 4 4 4 . .
        . f f f f f f f f . 4 4 4 4 . .
        . f d d d d d d f . . . . . . .
        . f d d d d d d f . a a a a . .
        . f d d d d d d f . a a a a . .
        . f f f f f f f f . a a a a . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const btn_focus = img`
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
        . 5 5 5 5 5 5 5 5 5 5 5 5 5 5 .
    `;
    export const btn_underline = img`
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
        f f f f f f f f f f f f f f f f
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
    export const btn_move = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . f . . . . . . .
        . . . . . . . f 5 f . . . . . .
        . . . . . . f 5 5 5 f . . . . .
        . . . . . . f 5 5 5 f . . . . .
        . . . . f f . f 5 f . f f . . .
        . . . f 5 5 f f 5 f f 5 5 f . .
        . . f 5 5 5 5 5 5 5 5 5 5 5 f .
        . . . f 5 5 f f 5 f f 5 5 f . .
        . . . . f f . f 5 f . f f . . .
        . . . . . . f 5 5 5 f . . . . .
        . . . . . . f 5 5 5 f . . . . .
        . . . . . . . f 5 f . . . . . .
        . . . . . . . . f . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const btn_duplicate = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f . . . . . . . . . .
        . . f 9 9 9 f . . . . . . . . .
        . f 6 9 1 9 1 f . . . . . . . .
        . f 6 9 f 9 f f . . . . . . . .
        . f 6 9 9 9 9 f . f f f . . . .
        . . f 6 6 6 f . f 9 9 9 f . . .
        . . . f f f . f 6 9 1 9 1 f . .
        . . . . . . . f 6 9 f 9 f f . .
        . . . . . . . f 6 9 9 9 9 f . .
        . . . . . . . . f 6 6 6 f . . .
        . . . . . . . . . f f f . . . .
        . . . . . . . . . . . . . . . .
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
    export const btn_carry = img`
        . . f f f . .
        . . f 9 f . .
        f f f 9 f f f
        f 9 9 9 9 9 f
        f f f 9 f f f
        . . f 9 f . .
        . . f f f . .
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
    /// BUILT-IN CHARACTERS
    ///
    export const char_kodu = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f f f f . . . . .
        . . . . f 9 9 9 9 9 9 f . . . .
        . . . f 9 6 3 3 3 3 6 9 f . . .
        . . . f 9 3 3 3 3 3 3 9 f . . .
        . . f 9 6 3 1 3 3 1 3 6 9 f . .
        . . f 9 3 3 f 3 3 f 3 3 9 f . .
        . . f 9 3 3 f 3 3 f 3 3 9 f . .
        . . f 9 3 3 3 3 3 3 3 3 9 f . .
        . . f 9 6 3 3 3 3 3 3 6 9 f . .
        . . f 9 9 9 9 9 9 9 9 9 9 f . .
        . . . f 6 6 6 6 6 6 6 6 f . . .
        . . . . f f f f f f f f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const char_apple = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f f . . . . . . .
        . . . . . . f e e f . . . . . .
        . . . . f f f e f f f . . . . .
        . . . f 4 4 4 e 4 4 4 f . . . .
        . . f 2 2 2 4 4 2 2 2 f . . . .
        . . f 2 2 2 2 2 2 2 2 4 f . . .
        . . f 2 2 2 2 2 2 2 2 4 f . . .
        . . f 2 2 2 2 2 2 2 2 4 f . . .
        . . . f 2 2 2 2 2 2 2 f . . . .
        . . . f c c c c c c c f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const char_tree = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . f f f f f f f . . .
        . . . . f f 7 7 7 7 7 7 7 f . .
        . . . f 7 7 7 7 7 7 7 7 7 f . .
        . . f 7 7 7 7 7 7 7 7 7 7 7 f .
        . . f 7 7 7 7 7 f f f 7 7 7 f .
        . . f 7 7 7 f f e e e f 7 7 f .
        . . . f 7 7 e e e e 7 7 7 f . .
        . . . . f f f e e e f f f . . .
        . . . . . . f e e e f . . . . .
        . . . . . . f e e e f . . . . .
        . . . . . f e e e e e f . . . .
        . . . . . f f f f f f f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    ///
    /// LANGUAGE TILES
    ///
    export const tile_see = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 9 9 9 9 9 9 9 f . . . .
        . . f 6 9 9 9 9 9 9 9 9 f . . .
        . f 6 9 9 1 1 9 9 9 1 1 9 f . .
        . f 6 9 1 1 f 1 9 1 1 f 1 f . .
        . f 6 9 1 1 f f 9 1 1 f f f . .
        . f 6 9 1 1 f f 9 1 1 f f f . .
        . f 6 9 9 1 1 9 9 9 1 1 9 f . .
        . f 6 9 9 9 9 9 9 9 9 9 9 f . .
        . f 6 6 9 9 9 9 9 9 9 9 9 f . .
        . . f 6 6 9 9 9 9 9 9 6 f . . .
        . . . f f 6 6 6 6 6 6 f . . . .
        . . . . . f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_dpad = img`
        . . . . . . . . . . . . . . . .
        . . . . f f f f f f f . . . . .
        . . . f 6 6 1 1 1 6 6 f . . . .
        . . f 6 6 6 1 1 1 6 6 6 f . . .
        . f 6 6 6 6 1 1 1 6 6 6 6 f . .
        . f 6 6 6 b b b b b 6 6 6 f . .
        . f 1 1 1 b c c c b 1 1 1 f . .
        . f 1 1 1 b c c c b 1 1 1 f . .
        . f 1 1 1 b c c c b 1 1 1 f . .
        . f 6 6 6 b b b b b 6 6 6 f . .
        . f 6 6 6 6 1 1 1 6 6 6 6 f . .
        . . f 6 6 6 1 1 1 6 6 6 f . . .
        . . . f 6 6 1 1 1 6 6 f . . . .
        . . . . f f f f f f f . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
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
    export const tile_bump = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . 5 . 5 . . . . . . .
        . . . f f f . 5 . f f f . . . .
        . . f 9 9 9 f 5 f 4 4 4 f . . .
        . f 6 9 1 9 1 f 2 2 4 4 4 f . .
        . f 6 9 f 9 f 5 2 2 2 2 4 f . .
        . f 6 6 9 9 9 f 2 2 2 2 4 f . .
        . . f 6 6 6 f 5 f 2 2 2 f . . .
        . . . f f f . 5 . f f f . . . .
        . . . . . . 5 . 5 . . . . . . .
        . . . . . . . . . . . . . . . .
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
    export const tile_me = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . f f f . . . . . . . .
        . . . . f 9 9 9 f . . . . . . .
        . . . f 6 1 9 1 9 f c c . . . .
        . . . f 6 f 9 f 9 f d d c . . .
        . . . f 6 9 9 9 9 f b d c . . .
        . . . . f 6 6 6 f b b b c . . .
        . . . . . f f f . c c c . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_it = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . c c c . . . . . . . .
        . . . . c d d d c . . . . . . .
        . . . c b d d d d c f f . . . .
        . . . c b c d c d c 4 4 f . . .
        . . . c b d d d d c 2 4 f . . .
        . . . . c b b b c 2 2 2 f . . .
        . . . . . c c c . f f f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_faraway = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . f f . .
        . f f f . . . . . . . f 2 4 f .
        . f 4 5 f f f . . . . f 2 2 f .
        . f 4 5 5 5 5 f f . . . f f . .
        . f 4 5 5 5 5 5 5 f f f . . . .
        . f 4 5 5 5 5 5 5 5 5 5 f f . .
        . f 4 5 5 c 5 5 5 c 5 5 5 5 f .
        . f 4 c 5 c 5 c 5 c 5 c 5 5 f .
        . f f f f f f f f f f f f f f .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_nearby = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f . . . . . . . . . .
        . . f 4 4 4 f . . . . . . . . .
        . f 2 2 4 4 4 f . . . . . . . .
        . f 2 2 2 2 4 f . . . . . . . .
        . f 2 2 2 2 4 f . . . . . . . .
        . f f 2 2 2 f f f . . . . . . .
        . f 4 f f f 5 5 5 f f f . . . .
        . f 4 5 5 5 5 5 5 5 5 5 f f . .
        . f 4 5 5 c 5 5 5 c 5 5 5 5 f .
        . f 4 c 5 c 5 c 5 c 5 c 5 5 f .
        . f f f f f f f f f f f f f f .
        . . . . . . . . . . . . . . . .
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
    export const tile_move = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . . . . f 9 9 9 9 9 f . . .
        . 1 1 1 . f 9 9 1 1 9 1 1 f . .
        . . . . . f 6 9 1 f 9 1 f f . .
        . . 1 1 . f 6 9 1 f 9 1 f f . .
        . . . . . f 6 9 9 9 9 9 9 f . .
        . 1 1 1 . f 6 6 9 9 9 9 9 f . .
        . . . . . . f 6 6 6 6 6 f . . .
        . . . . . . . f f f f f . . . .
        . . . . . . . . . . . . . . . .
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
    export const tile_camera_follow = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . f f f f f . f f . . . . . . .
        . f a a a f f a f . . . . . . .
        . f a a a f a a f . . . . . . .
        . f c c c f f c f . . . . . . .
        . f f f f f . f f . . . . . . .
        . . . f f . . . . . f f f . . .
        . . f . . f . . . f 9 9 9 f . .
        . f . . . . f . f 6 9 1 9 1 f .
        . . . . . . . . f 6 9 f 9 f f .
        . . . . . . . . f 6 6 9 9 9 f .
        . . . . . . . . . f 6 6 6 f . .
        . . . . . . . . . . f f f . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_vanish = img`
        . . . . . . . . . . . . . . . .
        . . . . 1 . . 1 . . 9 . . . . .
        . . . . . 9 . 9 . 1 . . . . . .
        . . 1 . . . . . . . . . 1 . . .
        . . . 9 . . f f f . . 9 . . . .
        . . . . . f d d d f . . . . . .
        . . . . f d 1 d 1 d f . . . . .
        . 9 1 . f d f d f d f . 1 9 . .
        . . . . f d d d d d f . . . . .
        . . . . . f d d d f . . . . . .
        . . . 1 . . f f f . . 9 . . . .
        . . 9 . . . . . . . . . 1 . . .
        . . . . . 9 . 9 . 1 . . . . . .
        . . . . 1 . . 1 . . 9 . . . . .
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
    export const tile_toward = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . f f f . . . f . . . . . .
        . . f 9 9 9 f . f 5 f . . . . .
        . f 6 9 1 9 1 f f 5 5 f f f . .
        . f 6 9 f 9 f 5 5 5 5 5 4 4 f .
        . f 6 9 9 9 9 f f 5 5 2 2 4 f .
        . . f 6 6 6 f . f 5 f 2 2 2 f .
        . . . f f f . . . f . f f f . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_away = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . f . . f f f . . . . . .
        . . . f 5 f f 9 9 9 f . . . . .
        . . f 5 5 f 1 9 1 9 9 f f f . .
        . f 5 5 5 5 f 9 f 9 9 f 4 4 f .
        . . f 5 5 f 6 9 9 9 9 f 2 4 f .
        . . . f 5 f f 6 6 6 f 2 2 2 f .
        . . . . f . . f f f . f f f . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_avoid = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f f f . . . .
        . . . f f f . f 5 5 5 5 f . . .
        . . f 4 4 4 f f 5 5 5 f . . . .
        . . f 2 2 4 f f 5 f 5 5 f . . .
        . . f 2 2 2 f . f . f 5 f . . .
        . . . f f f . f f f f 5 f . . .
        . . . . . . f 9 9 9 f f . . . .
        . . . . . f 6 1 9 1 9 f . . . .
        . . . . . f 6 f 9 f 9 f . . . .
        . . . . . f 6 9 9 9 9 f . . . .
        . . . . . . f 6 6 6 f . . . . .
        . . . . . . . f f f . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_quickly = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . f f f . . . .
        . . . 1 1 1 . . f 9 9 9 f . . .
        . . . . . . . f 6 9 1 9 1 f . .
        . . 1 1 1 1 . f 6 9 f 9 f f . .
        . . . . . . . f 6 9 9 9 9 f . .
        . . . . 1 1 . . f 6 6 6 f . . .
        . . . . . . . . . f f f . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `;
    export const tile_slowly = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . f f f . . . . . .
        . . . . . . f 9 9 9 f . . . . .
        . . . . . f 6 9 9 9 9 f . . . .
        . . . . . f 6 9 1 9 1 f . . . .
        . . . . . f 6 9 f 9 f f . . . .
        . . . . . . f 6 6 6 f . . . . .
        . . . . . . . f f f . . . . . .
        . . . . . . . . . . . . . . . .
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