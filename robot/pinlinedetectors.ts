namespace microcode.robots {
    export class DigitalPinLineDetectors implements LineDetectors {
        /**
         * Left line detector
         */
        constructor(
            public readonly pins: DigitalPin[],
            public readonly lineHigh: boolean
        ) {
            this.pins = pins
        }

        start() {
            this.pins
                .filter(pin => !!pin)
                .forEach(pin => pins.setPull(pin, PinPullMode.PullNone))
        }

        lineState(): number[] {
            const values = this.pins.map(pin =>
                pin
                    ? pins.digitalReadPin(pin) > 0 === this.lineHigh
                        ? LINE_HIGH
                        : 0
                    : undefined
            )
            return values
        }
    }

    export class AnalogPinLineDetectors implements LineDetectors {
        convertValue?: (value: number) => number = v => v

        /**
         * Left line detector
         */
        constructor(
            public readonly pins: AnalogPin[],
            public readonly lineHigh: boolean
        ) {
            this.pins = pins
        }

        start() {
            this.pins
                .filter(pin => !!pin)
                .forEach(pin =>
                    pins.setPull(<DigitalPin>(<any>pin), PinPullMode.PullNone)
                )
        }

        lineState(): number[] {
            const values = this.pins.map(pin =>
                pin ? this.convertValue(pins.analogReadPin(pin)) : undefined
            )
            return values
        }
    }
}
