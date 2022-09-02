namespace microcode {
    export type LibraryFn = (rule: Rule) => void

    export type LibraryFnMap = {
        [id: string]: LibraryFn
    }

    export class Library {
        public static getFunction(id: string): LibraryFn {
            id = id || "noop"
            return librarydb[id] || librarydb["noop"]
        }
    }

    const librarydb: LibraryFnMap = {
        noop: (rule: Rule) => {},

        ///
        /// SENSORS
        ///
        [TID_SENSOR_ALWAYS]: (rule: Rule) => {
            rule.state["exec"] = true
        },

        /*
        [TID_SENSOR_DPAD]: (rule: Rule) => {
            const direction = new Vec2();
            if (controller.up.isPressed()) { direction.y -= 1; }
            if (controller.down.isPressed()) { direction.y += 1; }
            if (controller.left.isPressed()) { direction.x -= 1; }
            if (controller.right.isPressed()) { direction.x += 1; }
            if (direction.x || direction.y) {
                rule.state["exec"] = true;
                rule.state["direction"] = direction;
            }
        },
        */

        [TID_SENSOR_BUTTON_A]: (rule: Rule) => {
            const pressed = controller.A.isPressed()
            if (pressed) {
                rule.state["exec"] = true
            }
            rule.state["value"] = pressed
            rule.state["value_type"] = "boolean"
            rule.state["value_name"] = "A"
        },

        [TID_SENSOR_BUTTON_B]: (rule: Rule) => {
            const pressed = controller.B.isPressed()
            if (pressed) {
                rule.state["exec"] = true
            }
            rule.state["value"] = pressed
            rule.state["value_type"] = "boolean"
            rule.state["value_name"] = "B"
        },

        [TID_SENSOR_TIMER]: (rule: Rule) => {
            const timerStart = rule.prevState["timerStart"] || control.millis()
            rule.state["timerStart"] = timerStart
            const now = control.millis()
            const timespan = rule.state["timespan"] || 1000
            const elapsed = now - timerStart
            const trigger = elapsed >= timespan
            if (trigger) {
                rule.state["exec"] = true
                rule.state["timerStart"] = now
            }
            rule.state["value"] = trigger
            rule.state["value_type"] = "boolean"
            rule.state["value_name"] = "Timer"
        },
        [TID_SENSOR_PIN_1]: (rule: Rule) => {
            let mode = rule.state["pin_mode"]
            if (mode == undefined) {
                mode = "analog"
            }
            const value = 0 // (mode === "analog") ? pins.analogReadPin(AnalogPin.P1) : pins.digitalReadPin(DigitalPin.P1);
            /*
            const prev = rule.prevState["value"] || Math.random();
            const value = (mode === "analog")
                ? Math.random() > 0.5 ? prev + 0.1 : prev - 0.1
                : Math.random() > 0.1 ? Math.random() > 0.5 ? 1 : 0 : prev;
            */
            rule.state["value"] = value
            rule.state["value_type"] = "number"
            rule.state["value_name"] = "P1"
            rule.state["exec"] = true
        },

        ///
        /// FILTERS
        ///
        [TID_FILTER_TIMESPAN_SHORT]: (rule: Rule) => {
            let timespan: number = rule.state["timespan"] || 1000
            timespan /= 2.0
            rule.state["timespan"] = timespan
        },

        [TID_FILTER_TIMESPAN_LONG]: (rule: Rule) => {
            let timespan: number = rule.state["timespan"] || 1000
            timespan += 1000
            rule.state["timespan"] = timespan
        },

        [TID_FILTER_PIN_ANALOG]: (rule: Rule) => {
            rule.state["pin_mode"] = "analog"
        },

        [TID_FILTER_PIN_DIGITAL]: (rule: Rule) => {
            rule.state["pin_mode"] = "digital"
        },

        ///
        /// ACTUATORS
        ///
        [TID_ACTUATOR_SWITCH_PAGE]: (rule: Rule) => {
            const page: number = rule.state["page"]
            if (page !== undefined) {
                rule.prog.switchPage(page)
            }
        },

        [TID_ACTUATOR_PIN_0]: (rule: Rule) => {
            let state: boolean = rule.state["pin_state"]
            if (state === undefined) {
                state = true
            }
            // pins.digitalWritePin(DigitalPin.P0, state ? 1 : 0);
        },

        /*
        [TID_ACTUATOR_LOG]: (rule: Rule) => {
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

        [TID_ACTUATOR_PLOT]: (rule: Rule) => {
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
        */

        ///
        /// MODIFIERS
        ///
        [TID_MODIFIER_PAGE_1]: (rule: Rule) => {
            rule.state["page"] = 0
        },

        [TID_MODIFIER_PAGE_2]: (rule: Rule) => {
            rule.state["page"] = 1
        },

        [TID_MODIFIER_PAGE_3]: (rule: Rule) => {
            rule.state["page"] = 2
        },

        [TID_MODIFIER_PAGE_4]: (rule: Rule) => {
            rule.state["page"] = 3
        },

        [TID_MODIFIER_PAGE_5]: (rule: Rule) => {
            rule.state["page"] = 4
        },

        [TID_MODIFIER_PIN_ON]: (rule: Rule) => {
            rule.state["pin_state"] = true
        },
        [TID_MODIFIER_PIN_OFF]: (rule: Rule) => {
            rule.state["pin_state"] = false
        },
    }
}
