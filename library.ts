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
        [tid.sensor.pin_1]: (rule: Rule) => {
            let mode = rule.state["pin_mode"];
            if (mode == undefined) {
                mode = "analog";
            }
            const value = (mode === "analog") ? pins.analogReadPin(AnalogPin.P1) : pins.digitalReadPin(DigitalPin.P1);
            rule.state["value"] = value;
            rule.state["value_type"] = "number";
            rule.state["value_name"] = "P1";
            rule.state["exec"] = true;
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

        [tid.filter.pin_analog]: (rule: Rule) => {
            rule.state["pin_mode"] = "analog";
        },

        [tid.filter.pin_digital]: (rule: Rule) => {
            rule.state["pin_mode"] = "digital";
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

        [tid.actuator.pin_0]: (rule: Rule) => {
            let state: boolean = rule.state["pin_state"];
            if (state === undefined) {
                state = true;
            }
            pins.digitalWritePin(DigitalPin.P0, state ? 1 : 0);
        },

        [tid.actuator.log]: (rule: Rule) => {
            const value_type = rule.state["value_type"];
            const name = rule.state["value_name"];
            const color = rule.state["color"] || 5;
            switch (value_type) {
                case "boolean": {
                    const value: boolean = rule.state["value"];
                    rule.prog.agent.logBoolean(name, value, color);
                    break;
                }
                case "number": {
                    const value: number = rule.state["value"];
                    rule.prog.agent.logNumber(name, value, color);
                    break;
                }
                case "string": {
                    const value: string = rule.state["value"];
                    rule.prog.agent.logString(name, value, color);
                    break;
                }
            }
        },

        [tid.actuator.plot]: (rule: Rule) => {
            const value_type = rule.state["value_type"];
            const name = rule.state["value_name"];
            const color = rule.state["color"] || 5;
            switch (value_type) {
                case "boolean": {
                    const value: boolean = rule.state["value"];
                    rule.prog.agent.plotBoolean(name, value, color);
                    break;
                }
                case "number": {
                    const value: number = rule.state["value"];
                    rule.prog.agent.plotNumber(name, value, color);
                    break;
                }
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

        [tid.modifier.pin_on]: (rule: Rule) => {
            rule.state["pin_state"] = true;
        },

        [tid.modifier.pin_off]: (rule: Rule) => {
            rule.state["pin_state"] = false;
        },
        [tid.modifier.color_white]: (rule: Rule) => {
            rule.state["color"] = 1;
        },
        [tid.modifier.color_red]: (rule: Rule) => {
            rule.state["color"] = 2;
        },
        [tid.modifier.color_pink]: (rule: Rule) => {
            rule.state["color"] = 3;
        },
        [tid.modifier.color_orange]: (rule: Rule) => {
            rule.state["color"] = 4;
        },
        [tid.modifier.color_yellow]: (rule: Rule) => {
            rule.state["color"] = 5;
        },
        [tid.modifier.color_teal]: (rule: Rule) => {
            rule.state["color"] = 6;
        },
        [tid.modifier.color_green]: (rule: Rule) => {
            rule.state["color"] = 7;
        },
        [tid.modifier.color_blue]: (rule: Rule) => {
            rule.state["color"] = 8;
        },
        [tid.modifier.color_lightblue]: (rule: Rule) => {
            rule.state["color"] = 9;
        },
        [tid.modifier.color_purple]: (rule: Rule) => {
            rule.state["color"] = 10;
        },
        [tid.modifier.color_lightpurple]: (rule: Rule) => {
            rule.state["color"] = 11;
        },
        [tid.modifier.color_darkpurple]: (rule: Rule) => {
            rule.state["color"] = 12;
        },
        [tid.modifier.color_tan]: (rule: Rule) => {
            rule.state["color"] = 13;
        },
        [tid.modifier.color_brown]: (rule: Rule) => {
            rule.state["color"] = 14;
        },
        [tid.modifier.color_black]: (rule: Rule) => {
            rule.state["color"] = 15;
        },
    }
}
