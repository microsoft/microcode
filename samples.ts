namespace microcode {
    export class Sample {
        constructor(
            public label: string,
            public ariaId: string,
            public icon: string,
            private b64: string
        ) {}

        get source() {
            return Buffer.fromBase64(this.b64).toString()
        }
    }

    export function samples(withIcon: boolean): Sample[] {
        const s: {
            label: string
            ariaId?: string
            b64?: string
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
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkYzIl0sIk0iOlsiTTE1KDExMDExMTEwMTEwMDAwMDEwMDAxMDExMTApIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE1Il0sIkYiOlsiRjQiXSwiTSI6WyJNMTUoMTEwMTExMTAxMTAwMDAwMDExMTAxMDAwMSkiLCJNMTUoMTEwMTExMTAxMTAwMDAwMDAwMDAxMTExMSkiLCJNMjMiLCJNOCJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX19",
                icon: "smiley_buttons",
            },
            {
                label: "counter",
                ariaId: "N14",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMyJdLCJNIjpbIk0yMEEiLCJNNiJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi4yLjE1In0=",
            },
            {
                label: "double counter",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhhcHB5Il19LHsiUyI6WyJTMSJdLCJBIjpbIkExMCJdLCJNIjpbIk0yMEEiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTlBIl0sIkYiOlsiRjMiXSwiTSI6WyJNMjBBIiwiTTYiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkExMCJdLCJNIjpbIk0yMEEiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTEiXSwiRiI6WyJGNCJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTloZWxsbyJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBMTAiXSwiTSI6WyJNMjBCIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE5QiJdLCJGIjpbIkY0Il0sIk0iOlsiTTIwQiIsIk02Il19LHsiUyI6WyJTOUIiXSwiQSI6WyJBMTAiXSwiTSI6WyJNMjBCIl19LHsiUyI6WyJTMiJdLCJBIjpbIkExIl0sIkYiOlsiRjMiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuMi4xNSJ9",
            },
            {
                label: "pet hamster",
                ariaId: "N4",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDExMDExMDAwMDAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkY3Il0sIk0iOlsiTTE1KDAwMDAwMDEwMTAwMDAwMDEwMDAxMDExMTApIiwiTTE1KDAwMDAwMTEwMTEwMDAwMDAxMTEwMDAwMDApIiwiTTIzIiwiTTgiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTIiXSwiRiI6WyJGNyJdLCJNIjpbIk0xOWdpZ2dsZSJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0xNSgwMDAwMDAxMDEwMDAwMDAwMTExMDEwMDAxKSIsIk0xNSgwMDAwMDExMDExMDAwMDAwMTExMDAwMDAwKSIsIk0yMyIsIk04Il19LHsiUyI6WyJTMyJdLCJBIjpbIkEyIl0sIkYiOlsiRjE3X3NoYWtlIl0sIk0iOlsiTTE5c2FkIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjIuNSJ9",
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
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiTSI6WyJNMjIiLCJNNyJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOCJdLCJNIjpbIk0xNSgxMTExMTEwMTAxMTExMTEwMTExMDAxMTEwKSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTUiXSwiRiI6WyJGOSJdLCJNIjpbIk0xNSgxMTExMTEwMDAxMTAwMDExMDAwMTExMTExKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi4yLjE1In0=",
                icon: "heads_tails",
            },
            {
                label: "hot potato",
                ariaId: "N7",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOCJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMTExMTExMDEwMTExMTExMDExMTAwMTExMCkiXX0seyJTIjpbIlMxIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTlzYWQiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjIuNSJ9",
                icon: "hot_potato",
            },
            {
                label: "clap lights",
                ariaId: "N10",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTExMTExMTExMTExMTExMTExMTExKSJdfSx7IlMiOlsiUzgiXSwiQSI6WyJBMSJdLCJGIjpbIkYxNSJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCkiXX0seyJTIjpbIlM4Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTUiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuMi41In0=",
                icon: "clap_lights",
            },
            {
                label: "7 seconds clap",
                ariaId: "N13",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHsiUyI6WyJTMSJdLCJBIjpbIkE5QSJdLCJNIjpbIk02Il19LHsiUyI6WyJTMSJdLCJBIjpbIkE1Il0sIk0iOlsiTTE1KDAxMDEwMDEwMTAwMTAxMDExMDExMDEwMTApIiwiTTE1KDAwMTEwMDAxMTAwMDExMDAxMTExMDAxMTApIiwiTTIzIl19LHsiUyI6WyJTOCJdLCJBIjpbIkE5QSJdLCJGIjpbIkYxNSJdLCJNIjpbIk0yMEEiLCJNNiJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxNCIsIkYxNCJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTlnaWdnbGUiXX0seyJTIjpbIlMxIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQSJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOSJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi4yLjE0In0=",
            },
            {
                label: "reaction time",
                ariaId: "N6",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDEwMDAwMDAwMDAwMDAwKSIsIk0xNSgwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwKSIsIk0xNSgwMDAwMDAwMDAwMDAwMTAwMDAwMDAwMDAwKSIsIk0yMyJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOCIsIkYxOCIsIkYxOCIsIkYxOCIsIkYxOCJdLCJNIjpbIk0yIl19LHsiUyI6WyJTMiJdLCJBIjpbIkExIl0sIkYiOlsiRjMiXSwiTSI6WyJNNCJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMSJdLCJGIjpbIkY0Il0sIk0iOlsiTTMiXX0se31dfSx7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTExMTExMTExMTExMTExMTExMTExKSJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHsiUyI6WyJTMiJdLCJBIjpbIkExIl0sIkYiOlsiRjMiXSwiTSI6WyJNMyJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMSJdLCJGIjpbIkY0Il0sIk0iOlsiTTQiXX0se31dfSx7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDEwMDAxMDAwMTExMTAwMTAwMDAwMTAwKSIsIk0xNSgwMDAxMDAwMTAwMDExMTEwMDEwMDAwMDEwKSIsIk0yMyJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAxMDAwMDAxMDExMTExMDAwMTAwMDEwMCkiLCJNMTUoMDEwMDAwMDEwMDExMTEwMDAxMDAwMTAwMCkiLCJNMjMiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTkiXSwiTSI6WyJNMSJdfSx7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi4yLjEyIn0=",
                icon: "reaction_time",
            },
            {
                label: "chuck a duck",
                ariaId: "N5",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBNSJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNiJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk02Il19LHsiUyI6WyJTNyJdLCJBIjpbIkE1Il0sIkYiOlsiRjgiXSwiTSI6WyJNMTUoMDExMDAxMTEwMDAxMTExMDExMTAwMDAwMCkiXX0seyJTIjpbIlM3Il0sIkEiOlsiQTIiXSwiRiI6WyJGOCJdLCJNIjpbIk0xOWhlbGxvIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=",
                icon: "teleport_duck",
            },
            {
                label: "zombie detector",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwKSIsIk0xNSgwMDAwMDAxMDEwMDAwMDAwMTAxMDAwMDAwKSIsIk0xNSgxMDAwMTAwMDAwMDAwMDAwMDAwMDEwMDAxKSIsIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzciXSwiQSI6WyJBMSJdLCJGIjpbIkY4Il0sIk0iOlsiTTIiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTEiXSwiRiI6WyJGNyJdLCJNIjpbIk0zIl19LHt9XX0seyJSIjpbeyJTIjpbIlM0Il0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMDAxMDAwMDEwMDAwMTAwMDAwMDAwMDEwMCkiLCJNMTUoMDEwMTAwMTAxMDAxMDEwMDAwMDAwMTAxMCkiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTIiXSwiRiI6WyJGMTQiXSwiTSI6WyJNMTlteXN0ZXJpb3VzIl19LHsiUyI6WyJTNCJdLCJBIjpbIkExIl0sIkYiOlsiRjE5Il0sIk0iOlsiTTEiXX0se31dfSx7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTEwMTAxMDExMTAwMDAwMDAxMTEwKSIsIk0xNSgxMTExMTEwMTAxMDExMTAwMTExMDAwMDAwKSJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBNiJdLCJNIjpbIk02Il19LHt9XX0seyJSIjpbe31dfSx7fV19fQ==",
            },
            {
                label: "firefly",
                ariaId: "N11",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAxMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzciXSwiQSI6WyJBOUEiXSwiTSI6WyJNMjBBIiwiTTYiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTlBIl0sIkYiOlsiRjEzIl0sIk0iOlsiTTIwQSIsIk02Il19LHsiUyI6WyJTOUEiXSwiQSI6WyJBMSJdLCJGIjpbIkYxMCIsIkYxMiJdLCJNIjpbIk0yIl19LHsiUyI6WyJTNCJdLCJBIjpbIkExIl0sIkYiOlsiRjE0IiwiRjE0IiwiRjE0Il0sIk0iOlsiTTIiXX0se31dfSx7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNiJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBOUEiXSwiTSI6WyJNNiJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTExMTExMTEwMTExMTExMTExMTExKSJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHsiUyI6WyJTNCJdLCJBIjpbIkExIl0sIkYiOlsiRjEzIl0sIk0iOlsiTTEiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjIuNSJ9",
                icon: "firefly",
            },
            {
                label: "railroad crossing",
                ariaId: "N12",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBMjFfIl0sIkYiOlsiRjMiXSwiTSI6WyJNNiJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBOCJdLCJGIjpbIkYzIl0sIk0iOlsiQTIwXzEiLCJBMjBfNiIsIk0yMyJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBMjFfIl0sIkYiOlsiRjQiXSwiTSI6WyJNMTAiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTgiXSwiRiI6WyJGNCJdLCJNIjpbIkEyMF8zIiwiQTIwXzYiLCJNMjMiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTgiXSwiRiI6WyJGNyJdLCJNIjpbIkEyMF9yYWluYm93IiwiTTIzIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfX0=",
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
                ({ label, ariaId, icon, b64 }) =>
                    new Sample(label, ariaId, icon, b64)
            )
    }
}
