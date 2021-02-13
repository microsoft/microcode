namespace kojac {
    export type LibraryFn = (rule: Rule) => void;
 
    export type LibraryFnMap = {
        [id: string]: LibraryFn;
    };

    export class Library {
        public static getFunction(id: string): LibraryFn {
            id = id || "noop";
            return librarydb[id] || librarydb["noop"];
        }
    }

    const DIST_CUTOFF_SQ = 3000;

    const librarydb: LibraryFnMap = {
        "noop": (rule: Rule) => { },

        ///
        /// SENSORS
        ///
        [tid.sensor.always]: (rule: Rule) => {
            rule.state["exec"] = true;
        },

        [tid.sensor.dpad]: (rule: Rule) => {
            const direction = mkVec2();
            if (controller.up.isPressed()) { direction.y -= 1; }
            if (controller.down.isPressed()) { direction.y += 1; }
            if (controller.left.isPressed()) { direction.x -= 1; }
            if (controller.right.isPressed()) { direction.x += 1; }
            if (direction.x || direction.y) {
                rule.state["exec"] = true;
                rule.state["direction"] = direction;
            }
        },

        [tid.sensor.button_a]: (rule: Rule) => {
            if (controller.A.isPressed()) {
                rule.state["exec"] = true;
            }
        },

        [tid.sensor.button_b]: (rule: Rule) => {
            if (controller.B.isPressed()) {
                rule.state["exec"] = true;
            }
        },

        [tid.sensor.timer]: (rule: Rule) => {
            const timerStart = rule.prevState["timerStart"] || control.millis();
            rule.state["timerStart"] = timerStart;
            const now = control.millis();
            const timespan = rule.state["timespan"] || 1000;
            const elapsed = now - timerStart;
            if (elapsed >= timespan) {
                rule.state["exec"] = true;
                rule.state["timerStart"] = now;
            }
        },

        ///
        /// FILTERS
        ///
        [tid.filter.timespan_short]: (rule: Rule) => {
            let timespan: number = rule.state["timespan"] || 1000;
            timespan /= 2.0;
            rule.state["timespan"] = timespan;
        },

        [tid.filter.timespan_long]: (rule: Rule) => {
            let timespan: number = rule.state["timespan"] || 1000;
            timespan += 1000;
            rule.state["timespan"] = timespan;
        },

        ///
        /// ACTUATORS
        ///
        [tid.actuator.switch_page]: (rule: Rule) => {
            const page: number = rule.state["page"];
            if (page !== undefined) {
                rule.prog.switchPage(page);
            }
        },

        ///
        /// MODIFIERS
        ///
        [tid.modifier.page_1]: (rule: Rule) => {
            rule.state["page"] = 0;
        },

        [tid.modifier.page_2]: (rule: Rule) => {
            rule.state["page"] = 1;
        },
        
        [tid.modifier.page_3]: (rule: Rule) => {
            rule.state["page"] = 2;
        },
        
        [tid.modifier.page_4]: (rule: Rule) => {
            rule.state["page"] = 3;
        },
        
        [tid.modifier.page_5]: (rule: Rule) => {
            rule.state["page"] = 4;
        },
    }
}