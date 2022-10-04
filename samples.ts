namespace microcode {
    export class Sample {
        constructor(
            public label: string,
            public ariaId: string,
            public icon: string,
            private src: string,
            private b64: string,
            private buf: Buffer
        ) {}

        get source() {
            return (
                this.src ||
                (this.buf ? this.buf.toString() : undefined) ||
                Buffer.fromBase64(this.b64).toString()
            )
        }
    }

    export function samples(withIcon: boolean): Sample[] {
        const s: {
            label: string
            ariaId?: string
            src?: string
            b64?: string
            buf?: Buffer
            // leave empty to hide sample
            icon?: string
        }[] = [
            {
                label: "new program",
                ariaId: "N1",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19",
                icon: "new_program",
            },
            {
                label: "first program",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkYzIl0sIk0iOlsiTTE1KDAwMDAwMDEwMTAwMDAwMDEwMDAxMDExMTApIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=",
            },
            {
                label: "flashing heart",
                ariaId: "N2",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMTAxMDEwMTAxMTAwMDEwMTAxMDAwMTAwKSIsIk0xNSgwMDAwMDAxMDEwMDExMTAwMDEwMDAwMDAwKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX1dfX0=",
                icon: "flashing_heart",
            },
            {
                label: "smiley buttons",
                ariaId: "N3",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkYzIl0sIk0iOlsiTTE1KDExMDExMTEwMTEwMDAwMDEwMDAxMDExMTApIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE1Il0sIkYiOlsiRjQiXSwiTSI6WyJNMTUoMTEwMTExMTAxMTAwMDAwMDExMTAxMDAwMSkiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==",
                icon: "smiley_buttons",
            },
            {
                label: "pet hamster",
                ariaId: "N4",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAwMDAxMTAxMTAwMDAwMDExMTAwMDAwMCkiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTUiXSwiRiI6WyJGNyJdLCJNIjpbIk0xNSgwMDAwMDAxMDEwMDAwMDAxMDAwMTAxMTEwKSIsIk0xNSgwMDAwMDExMDExMDAwMDAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMiJdLCJGIjpbIkY3Il0sIk0iOlsiTTE5Z2lnZ2xlIl19LHsiUyI6WyJTMyJdLCJBIjpbIkE1Il0sIkYiOlsiRjE3X3NoYWtlIl0sIk0iOlsiTTE1KDAwMDAwMDEwMTAwMDAwMDAxMTEwMTAwMDEpIiwiTTE1KDAwMDAwMTEwMTEwMDAwMDAxMTEwMDAwMDApIl19LHsiUyI6WyJTMyJdLCJBIjpbIkEyIl0sIkYiOlsiRjE3X3NoYWtlIl0sIk0iOlsiTTE5c2FkIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=",
                icon: "pet_hamster",
            },
            {
                label: "rock, paper, scissors",
                ariaId: "N8",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMTdfc2hha2UiXSwiTSI6WyJNMjIiLCJNOCJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOCJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSIsIk0xNSgwMDAwMDAxMTEwMDExMTAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSIsIk0xNSgxMTExMTEwMDAxMTAwMDExMDAwMTExMTExKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGMTAiXSwiTSI6WyJNMTUoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCkiLCJNMTUoMTEwMDExMTAxMDAwMTAwMTEwMTAxMTAwMSkiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==",
                icon: "rock_paper_scissors",
            },
            {
                label: "head or tail",
                ariaId: "N9",
                src: `{"progdef":{"P":[{"R":[{"S":["S3"],"A":["A9A"],"M":["M22","M7"]},{"S":["S9A"],"A":["A5"],"F":["F8"],"M":["M15(1111110101111110111001110)"]},{"S":["S9A"],"A":["A5"],"F":["F9"],"M":["M15(1111110001100011000111111)"]},{}]},{"R":[{}]},{"R":[{}]},{"R":[{}]},{}]}}`,
                icon: "heads_tails",
            },
            {
                label: "hot potato",
                ariaId: "N7",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOCJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJBIjpbIkE1Il0sIk0iOlsiTTE1KDExMTExMTAxMDExMTExMTAxMTEwMDExMTApIl19LHsiQSI6WyJBMiJdLCJNIjpbIk0xOXNhZCJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==",
                icon: "hot_potato",
            },
            {
                label: "clap lights",
                ariaId: "N10",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMTExMTExMTExMTExMTExMTExMTExMTExMSkiXX0seyJTIjpbIlM4Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTUiXSwiTSI6WyJNMiJdfSx7fV19LHsiUiI6W3siQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzgiXSwiQSI6WyJBMSJdLCJGIjpbIkYxNSJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19",
                icon: "clap_lights",
            },
            {
                label: "reaction time",
                ariaId: "N6",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAwMDAwMDAwMDAwMTAwMDAwMDAwMDAwMCkiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiTSI6WyJNMiJdfSx7fV19LHsiUiI6W3siQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTExMTExMTExMTExMTExMTExMTExKSJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMSJdLCJGIjpbIkYwIl0sIk0iOlsiTTMiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTEiXSwiRiI6WyJGMSJdLCJNIjpbIk00Il19LHt9XX0seyJSIjpbeyJBIjpbIkE1Il0sIk0iOlsiTTE1KDAxMTEwMDEwMTAwMTExMDAxMDEwMDEwMTApIl19LHt9XX0seyJSIjpbeyJBIjpbIkE1Il0sIk0iOlsiTTE1KDAxMTEwMDEwMTAwMTExMDAxMDEwMDExMTApIl19LHt9XX0se31dfX0=",
                icon: "reaction_time",
            },
            {
                label: "chuck a duck",
                ariaId: "N5",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNiJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk02Il19LHsiUyI6WyJTNyJdLCJBIjpbIkE1Il0sIkYiOlsiRjgiXSwiTSI6WyJNMTUoMDExMDAxMTEwMDAxMTExMDExMTAwMDAwMCkiXX0seyJTIjpbIlM3Il0sIkEiOlsiQTIiXSwiRiI6WyJGOCJdLCJNIjpbIk0xOWhlbGxvIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=",
                icon: "teleport_duck",
            },
            {
                label: "creeper detector",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwKSIsIk0xNSgwMDAwMDAxMDEwMDAwMDAwMTAxMDAwMDAwKSIsIk0xNSgxMDAwMTAwMDAwMDAwMDAwMDAwMDEwMDAxKSIsIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzciXSwiQSI6WyJBMSJdLCJGIjpbIkY4Il0sIk0iOlsiTTIiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTEiXSwiRiI6WyJGNyJdLCJNIjpbIk0zIl19LHt9XX0seyJSIjpbeyJTIjpbIlM0Il0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAxMDAwMDEwMDAwMTAwMDAwMDAwMDEwMCkiLCJNMTUoMDEwMTAwMTAxMDAxMDEwMDAwMDAwMTAxMCkiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTIiXSwiRiI6WyJGMTQiXSwiTSI6WyJNMTlteXN0ZXJpb3VzIl19LHsiUyI6WyJTNCJdLCJBIjpbIkExIl0sIkYiOlsiRjE5Il0sIk0iOlsiTTEiXX0se31dfSx7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTEwMTAxMDExMTAwMDAwMDAxMTEwKSIsIk0xNSgxMTExMTEwMTAxMDExMTAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBNiJdLCJNIjpbIk02Il19LHt9XX0seyJSIjpbe31dfSx7fV19fQ==",
            },
            {
                label: "firefly",
                ariaId: "N11",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAwMDAwMDAwMDAwMTAwMDAwMDAwMDAwMCkiXX0seyJTIjpbIlM3Il0sIkEiOlsiQTlBIl0sIk0iOlsiTTIwQSIsIk02Il19LHsiUyI6WyJTNCJdLCJBIjpbIkE5QSJdLCJGIjpbIkYxMyJdLCJNIjpbIk0yMEEiLCJNNiJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTEiXSwiRiI6WyJGMTAiLCJGMTIiXSwiTSI6WyJNMiJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxNCIsIkYxNCIsIkYxNCJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJBIjpbIkE2Il19LHsiQSI6WyJBOUEiXSwiTSI6WyJNNiJdfSx7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMTExMTExMTExMTExMDExMTExMTExMTExMSkiXX0seyJBIjpbIkEyIl0sIk0iOlsiTTE5aGVsbG8iXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTMiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==",
                icon: "firefly",
            },
            {
                label: "railroad crossing",
                ariaId: "N12",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBMjFfIl0sIkYiOlsiRjMiXSwiTSI6WyJNNiJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBOCJdLCJGIjpbIkYzIl0sIk0iOlsiQTIwXzEiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTIxXyJdLCJGIjpbIkY0Il0sIk0iOlsiTTEwIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE4Il0sIkYiOlsiRjQiXSwiTSI6WyJBMjBfMyJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19",
                icon: "railroad_crossing",
            },
            {
                label: "moves",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN190aWx0X2Rvd24iXSwiTSI6WyJNMTUoMTExMDAxMDAxMDEwMDEwMTAwMTAxMTEwMCkiXX0seyJTIjpbIlMzIl0sIkEiOlsiQTUiXSwiRiI6WyJGMTdfdGlsdF91cCJdLCJNIjpbIk0xNSgxMDAxMDEwMDEwMTAwMTAxMDAxMDExMTEwKSJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN190aWx0X2xlZnQiXSwiTSI6WyJNMTUoMTAwMDAxMDAwMDEwMDAwMTAwMDAxMTExMCkiXX0seyJTIjpbIlMzIl0sIkEiOlsiQTUiXSwiRiI6WyJGMTdfdGlsdF9yaWdodCJdLCJNIjpbIk0xNSgxMTEwMDEwMDEwMTExMDAxMDAxMDEwMDEwKSJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0xNSgxMTExMDEwMDAwMTExMTAwMDAxMDExMTEwKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19",
            },
            {
                label: "coins",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMyJdLCJNIjpbIk02Il19LHsiUyI6WyJTMiJdLCJBIjpbIkE5QSJdLCJGIjpbIkY0Il0sIk0iOlsiTTIwQSIsIk02Il19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkYxMCJdLCJNIjpbIk0xNSgwMTExMTAwMDAxMDAxMTEwMDAwMTAxMTExKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGMTEiXSwiTSI6WyJNMTUoMTExMTAxMDAwMDExMTEwMDAwMTAxMTEwMCkiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkE1Il0sIkYiOlsiRjEyIl0sIk0iOlsiTTE1KDEwMTExMTAxMDExMDEwMTEwMTAxMTAxMTEpIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=",
            },
        ]
        return s
            .filter(({ icon }) => !withIcon || !!icon)
            .map(
                ({ label, ariaId, src, icon, b64, buf }) =>
                    new Sample(label, ariaId, icon, src, b64, buf)
            )
    }
}
