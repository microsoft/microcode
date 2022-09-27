namespace microcode {
    export class Sample {
        constructor(
            public label: string,
            public ariaId: string,
            public icon: string,
            private src: string,
            private b64: string
        ) {}

        get source() {
            return this.src || Buffer.fromBase64(this.b64).toString()
        }
    }

    export function samples(): Sample[] {
        const s: {
            label: string
            ariaId?: string
            src?: string
            b64?: string
            icon: string
        }[] = [
            {
                label: "new program",
                ariaId: "N1",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19",
                icon: "new_program",
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
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkYzIl0sIk0iOlsiTTE1KDExMDExMTEwMTEwMDAwMDEwMDAxMDExMTApIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE1Il0sIkYiOlsiRjQiXSwiTSI6WyJNMTUoMTEwMTExMTAxMTAwMDAwMDExMTAxMDAwMSkiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==',
                icon: "smiley_buttons",
            },
            {
                label: "rock, paper, scissors",
                ariaId: "N8",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBNyJdLCJNIjpbIk04IiwiTTIwQSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOCJdLCJNIjpbIk0xNSgwMDAwMDAxMTEwMDExMTAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOSJdLCJNIjpbIk0xNSgxMTExMTEwMDAxMTAwMDExMDAwMTExMTExKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGMTAiXSwiTSI6WyJNMTUoMTEwMDExMTAxMDAwMTAwMTEwMTAxMTAwMSkiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==',
                icon: "rock_paper_scissors",
            },
            {
                label: "chuck a duck",
                ariaId: "N5",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNiJdLCJGIjpbIkYxN19zaGFrZSJdfSx7IlMiOlsiUzciXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMTEwMDExMTAwMDExMTEwMTExMDAwMDAwKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19',
                icon: "teleport_duck",
            },
            {
                label: "pet hamster",
                ariaId: "N4",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAwMDAxMTAxMTAwMDAwMDExMTAwMDAwMCkiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTUiXSwiRiI6WyJGNyJdLCJNIjpbIk0xNSgwMDAwMDAxMDEwMDAwMDAxMDAwMTAxMTEwKSIsIk0xNSgwMDAwMDExMDExMDAwMDAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMiJdLCJGIjpbIkY3Il0sIk0iOlsiTTE5Z2lnZ2xlIl19LHsiUyI6WyJTMyJdLCJBIjpbIkE1Il0sIkYiOlsiRjE3X3NoYWtlIl0sIk0iOlsiTTE1KDAwMDAwMDEwMTAwMDAwMDAxMTEwMTAwMDEpIiwiTTE1KDAwMDAwMTEwMTEwMDAwMDAxMTEwMDAwMDApIl19LHsiUyI6WyJTMyJdLCJBIjpbIkEyIl0sIkYiOlsiRjE3X3NoYWtlIl0sIk0iOlsiTTE5c2FkIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=',
                icon: "pet_hamster",
            },
            {
                label: "head or tail",
                ariaId: "N9",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBNyJdLCJNIjpbIk03IiwiTTIwQSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOCJdLCJNIjpbIk0xNSgxMTExMTEwMTAxMTExMTEwMTExMDAxMTEwKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOSJdLCJNIjpbIk0xNSgxMTExMTEwMDAxMTAwMDExMDAwMTExMTExKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19',
                icon: "heads_tails",
            },
            {
                label: "reaction time",
                ariaId: "N6",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAwMDAwMDAwMDAwMTAwMDAwMDAwMDAwMCkiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiTSI6WyJNMiJdfSx7fV19LHsiUiI6W3siQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTExMTExMTExMTExMTExMTExMTExKSJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMSJdLCJGIjpbIkYwIl0sIk0iOlsiTTMiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTEiXSwiRiI6WyJGMSJdLCJNIjpbIk00Il19LHt9XX0seyJSIjpbeyJBIjpbIkE1Il0sIk0iOlsiTTE1KDAxMTEwMDEwMTAwMTExMDAxMDEwMDEwMTApIl19LHt9XX0seyJSIjpbeyJBIjpbIkE1Il0sIk0iOlsiTTE1KDAxMTEwMDEwMTAwMTExMDAxMDEwMDExMTApIl19LHt9XX0se31dfX0=',
                icon: "reaction_time",
            },
            {
                label: "hot potato",
                ariaId: "N7",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOCJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJBIjpbIkE1Il0sIk0iOlsiTTE1KDExMTExMTAxMDExMTExMTAxMTEwMDExMTApIl19LHsiQSI6WyJBMiJdLCJNIjpbIk0xOXNhZCJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19fQ==',
                icon: "hot_potato",
            },
            {
                label: "clap lights",
                ariaId: "N10",
                b64: 'eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IkEiOlsiQTUiXSwiTSI6WyJNMTUoMTExMTExMTExMTExMTExMTExMTExMTExMSkiXX0seyJTIjpbIlM4Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTUiXSwiTSI6WyJNMiJdfSx7fV19LHsiUiI6W3siQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzgiXSwiQSI6WyJBMSJdLCJGIjpbIkYxNSJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19',
                icon: "clap_lights",
            },
        ]
        return s.map(
            ({ label, ariaId, src, icon, b64 }) =>
                new Sample(label, ariaId, icon, src, b64)
        )
    }
}
