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

    export function rawSamples() {
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
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkYzIl0sIk0iOlsiTTE1KDAwMDAwMDEwMTAwMDAwMDEwMDAxMDExMTApIl19LHsiUyI6WyJTMiJdLCJBIjpbIkEyIl0sIkYiOlsiRjMiXSwiTSI6WyJNMTlnaWdnbGUiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC43In0",
            },
            {
                label: "flashing heart",
                ariaId: "N2",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMTAxMDEwMTAxMTAwMDEwMTAxMDAwMTAwKSIsIk0xNSgwMDAwMDAxMDEwMDExMTAwMDEwMDAwMDAwKSJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWdpZ2dsZSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX1dfSwidmVyc2lvbiI6InYyLjQuNyJ9",
                icon: "flashing_heart",
            },
            {
                label: "smiley buttons",
                ariaId: "N3",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkYzIl0sIk0iOlsiTTE1KDExMDExMTEwMTEwMDAwMDEwMDAxMDExMTApIiwiTTE1KDExMDExMDAwMDAxMDAwMTAxMTEwMDAwMDApIl19LHsiUyI6WyJTMiJdLCJBIjpbIkEyIl0sIkYiOlsiRjMiXSwiTSI6WyJNMTloYXBweSJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBNSJdLCJGIjpbIkY0Il0sIk0iOlsiTTE1KDExMDExMTEwMTEwMDAwMDAxMTEwMTAwMDEpIiwiTTE1KDExMDExMTEwMTEwMDAwMDAwMDAwMTExMTEpIl19LHsiUyI6WyJTMiJdLCJBIjpbIkEyIl0sIkYiOlsiRjQiXSwiTSI6WyJNMTlzYWQiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC43In0=",
                icon: "smiley_buttons",
            },
            {
                label: "counter",
                ariaId: "N14",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMyJdLCJNIjpbIk0yMEEiLCJNNiJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQSJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTloZWxsbyJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi40LjgifQ==",
            },
            {
                label: "times table",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUIiXSwiRiI6WyJGMTdfc2hha2UiXSwiTSI6WyJNMjIiLCJNOSIsIk0xMCJdfSx7IlMiOlsiUzlCIl0sIkEiOlsiQTlBIl0sIk0iOlsiTTIwQiJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMyJdLCJNIjpbIk0yMEEiLCJNMjBCIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBMTAiXSwiTSI6WyJNMjBBIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjQuOCJ9",
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
                label: "head or tail",
                ariaId: "N9",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiTSI6WyJNMjIiLCJNNyJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBNCJdLCJNIjpbIk0yNCgwMjQyMCwxMjApIiwiTTI0KDAuLi4wLDEyMCkiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkE1Il0sIkYiOlsiRjgiXSwiTSI6WyJNMTUoMTExMTExMDEwMTExMTExMDExMTAwMTExMCkiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkE1Il0sIkYiOlsiRjkiXSwiTSI6WyJNMTUoMTExMTExMDAwMTEwMDAxMTAwMDExMTExMSkiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC4xNSJ9",
                icon: "heads_tails",
            },
            {
                label: "rock, paper, scissors",
                ariaId: "N8",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMTdfc2hha2UiXSwiTSI6WyJNMjIiLCJNOCJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBMiJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0xOXNsaWRlIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkY4Il0sIk0iOlsiTTE1KDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApIiwiTTE1KDAwMDAwMDExMTAwMTExMDAxMTEwMDAwMDApIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkY5Il0sIk0iOlsiTTE1KDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApIiwiTTE1KDExMTExMTAwMDExMDAwMTEwMDAxMTExMTEpIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkYxMCJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSIsIk0xNSgxMTAwMTExMDEwMDAxMDAxMTAxMDExMDAxKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi40LjcifQ==",
                icon: "rock_paper_scissors",
            },
            {
                label: "hot potato",
                ariaId: "N7",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOCIsIkYxOCJdLCJNIjpbIk0yIl19LHsiUyI6WyJTNCJdLCJBIjpbIkE1Il0sIk0iOlsiTTE1KDAwMDAwMDAwMDAwMDEwMDAwMDAwMDAwMDApIiwiTTE1KDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMTExMTExMDEwMTExMTExMDExMTAwMTExMCkiXX0seyJTIjpbIlMxIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTlzYWQiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjQuNyJ9",
                icon: "hot_potato",
            },
            {
                label: "clap lights",
                ariaId: "N10",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgxMTExMTExMTExMTExMTExMTExMTExMTExKSJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHsiUyI6WyJTOCJdLCJBIjpbIkExIl0sIkYiOlsiRjE1Il0sIk0iOlsiTTIiXX0se31dfSx7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwKSJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOXlhd24iXX0seyJTIjpbIlM4Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTUiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC43In0=",
                icon: "clap_lights",
            },
            {
                label: "24 7 clap",
                ariaId: "N13",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHsiUyI6WyJTMSJdLCJBIjpbIkE5QSJdLCJNIjpbIk02Il19LHsiUyI6WyJTMSJdLCJBIjpbIkE1Il0sIk0iOlsiTTE1KDAxMDEwMDEwMTAwMTAxMDExMDExMDEwMTApIiwiTTE1KDAwMTEwMDAxMTAwMDExMDAxMTExMDAxMTApIiwiTTIzIl19LHsiUyI6WyJTOCJdLCJBIjpbIkE5QSJdLCJGIjpbIkYxNSJdLCJNIjpbIk0yMEEiLCJNNiJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxNCIsIkYxNCJdLCJNIjpbIk0yIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBMSJdLCJGIjpbIkYxMiIsIkYxMiIsIkYxMiIsIkYxMiIsIkYxMiJdLCJNIjpbIk0zIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTlnaWdnbGUiXX0seyJTIjpbIlMxIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQSJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOSJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTIiXSwiTSI6WyJNMTlzYWQiXX0seyJTIjpbIlMxIl0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMTExMTExMDEwMTAxMTEwMDAwMDAwMTExMCkiLCJNMTUoMTExMTExMDEwMTAxMTEwMDExMTAwMDAwMCkiLCJNMjMiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTkiLCJGMTkiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjMuMCJ9",
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
            {
                label: "inchworm",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBMjFfIl0sIk0iOlsiTTYiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTMiLCJGMTMiXSwiTSI6WyJNMiJdfSx7fV19LHsiUiI6W3siUyI6WyJTMSJdLCJBIjpbIkEyMV8iXSwiTSI6WyJNMTAiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTMiLCJGMTMiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuMy4wIn0=",
            },
            {
                label: "head guess",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWhlbGxvIl19LHsiUyI6WyJTMSJdLCJBIjpbIkE5QSJdLCJNIjpbIk0yMiIsIk04Il19LHsiUyI6WyJTMSJdLCJBIjpbIkE5QiJdLCJNIjpbIk02Il19LHsiUyI6WyJTMyJdLCJBIjpbIkE5QSJdLCJGIjpbIkYxN190aWx0X2Rvd24iXSwiTSI6WyJNMjIiLCJNOCJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMTdfdGlsdF91cCJdLCJNIjpbIk0yMiIsIk04Il19LHsiUyI6WyJTMyJdLCJBIjpbIkE5QiJdLCJGIjpbIkYxN190aWx0X3VwIl0sIk0iOlsiTTIwQiIsIk02Il19LHsiUyI6WyJTNCJdLCJBIjpbIkExIl0sIkYiOlsiRjE5IiwiRjE5IiwiRjE5IiwiRjE5Il0sIk0iOlsiTTIiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkE1Il0sIkYiOlsiRjgiXSwiTSI6WyJNMTUoMDExMDAxMTExMDAxMTExMDExMTAwMDAwMCkiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkE1Il0sIkYiOlsiRjkiXSwiTSI6WyJNMTUoMTExMTAxMDAwMDEwMDAwMTAwMDAxMTExMCkiLCJNMTUoMTExMTAxMDAxMDExMTEwMTAwMTAxMDAxMCkiLCJNMTUoMTExMTEwMDEwMDAwMTAwMDAxMDAwMDEwMCkiLCJNMjMiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkE1Il0sIkYiOlsiRjEwIl0sIk0iOlsiTTE1KDExMTAwMTAwMTAxMDAxMDEwMDEwMTExMDApIiwiTTE1KDExMTEwMTAwMTAxMDAxMDEwMDEwMTExMTApIiwiTTE1KDExMTEwMTAwMDAxMDExMDEwMDEwMTExMTApIiwiTTIzIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQiJdfSx7IlMiOlsiUzEiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOWdpZ2dsZSJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBMSJdLCJGIjpbIkYxOSIsIkYxOSJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX1dfSwidmVyc2lvbiI6InYyLjMuNyJ9",
            },
            {
                label: "battery charger prank",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBNSJdLCJNIjpbIk0xNSgwMTExMDAxMDEwMDEwMTAwMTAxMDAxMTEwKSIsIk0xNSgwMTExMDAxMDEwMDEwMTAwMTAxMDAxMDEwKSIsIk0yMyJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBMSJdLCJGIjpbIkYxN19zaGFrZSJdLCJNIjpbIk0yIl19LHt9XX0seyJSIjpbeyJTIjpbIlMxIl0sIkEiOlsiQTUiXSwiTSI6WyJNMTUoMDExMTAwMTAxMDAxMDEwMDEwMTAwMTExMCkiLCJNMTUoMDExMTAwMTAxMDAxMDEwMDExMTAwMTExMCkiLCJNMTUoMDExMTAwMTAxMDAxMTEwMDExMTAwMTExMCkiLCJNMTUoMDExMTAwMTExMDAxMTEwMDExMTAwMTExMCkiLCJNMjMiXX0seyJTIjpbIlM0Il0sIkEiOlsiQTEiXSwiRiI6WyJGMTkiXSwiTSI6WyJNMSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuMy43In0=",
            },
            {
                label: "green light red light",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBMSJdLCJGIjpbIkY3Il0sIk0iOlsiTTIiXX0seyJTIjpbIlM3Il0sIkEiOlsiQTEiXSwiRiI6WyJGOSJdLCJNIjpbIk0zIl19LHsiUyI6WyJTMSJdLCJBIjpbIkE1Il0sIk0iOlsiTTE1KDEwMTAwMTExMTEwMDEwMTAxMTEwMDEwMDApIiwiTTE1KDAwMTAwMTExMTEwMDEwMDAxMTEwMDAwMDApIiwiTTE1KDAwMTAxMTExMTExMDEwMDAxMTEwMDAwMTApIiwiTTIzIl19LHsiUyI6WyJTMSJdLCJBIjpbIkEyIl0sIk0iOlsiTTE5aGVsbG8iXX0se31dfSx7IlIiOlt7IlMiOlsiUzEiXSwiQSI6WyJBOUEiXSwiTSI6WyJNNiJdfSx7IlMiOlsiUzQiXSwiQSI6WyJBNiJdLCJNIjpbIk0yMEEiXX0seyJTIjpbIlMyIl0sIkEiOlsiQTlBIl0sIkYiOlsiRjMiXSwiTSI6WyJNNiJdfSx7IlMiOlsiUzIiXSwiQSI6WyJBOUEiXSwiRiI6WyJGNCJdLCJNIjpbIk03Il19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkY4Il0sIk0iOlsiTTE1KDEwMTAwMTExMTEwMDEwMTAxMTEwMDEwMDApIiwiTTE1KDAwMTAwMTExMTEwMDEwMDAxMTEwMDAwMDApIiwiTTE1KDAwMTAxMTExMTExMDEwMDAxMTEwMDAwMTApIiwiTTIzIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkY5Il0sIk0iOlsiTTE1KDEwMDAxMDEwMTAwMDEwMDAxMDEwMTAwMDEpIl19LHt9XX0seyJSIjpbeyJTIjpbIlMzIl0sIkEiOlsiQTIiXSwiRiI6WyJGMTdfc2hha2UiXSwiTSI6WyJNMTlzYWQiXX0seyJTIjpbIlMzIl0sIkEiOlsiQTUiXSwiRiI6WyJGMTdfc2hha2UiXSwiTSI6WyJNMTUoMTExMTExMDEwMTAxMTEwMDAwMDAwMTExMCkiLCJNMTUoMTExMTExMDEwMTAxMTEwMDExMTAwMDAwMCkiLCJNMjMiXX0seyJTIjpbIlM3Il0sIkEiOlsiQTEiXSwiRiI6WyJGOCJdLCJNIjpbIk0xIl19LHt9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC4wIn0=",
            },
            {
                label: "crooked head or tail",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiTSI6WyJNMjIiLCJNOCJdfSx7IlMiOlsiUzMiXSwiQSI6WyJBMiJdLCJNIjpbIk0xOXNsaWRlIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkY4Il0sIk0iOlsiTTE1KDExMTExMTAxMDExMTExMTAxMTEwMDExMTApIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkY5Il0sIk0iOlsiTTE1KDExMTExMTAwMDExMDAwMTEwMDAxMTExMTEpIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBNSJdLCJGIjpbIkYxMCJdLCJNIjpbIk0xNSgxMTExMTEwMDAxMTAwMDExMDAwMTExMTExKSJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi40LjExIn0=",
            },
            {
                label: "step counter",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzMiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMTdfc2hha2UiXSwiTSI6WyJNMjBBIiwiTTYiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkExMCJdLCJNIjpbIk0yMEEiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkEyIl0sIk0iOlsiTTE5aGVsbG8iXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC4xOSJ9",
            },
            {
                label: "clap counter",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzgiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMTUiXSwiTSI6WyJNMjBBIiwiTTYiXX0seyJTIjpbIlM5QSJdLCJBIjpbIkExMCJdLCJNIjpbIk0yMEEiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC4xOSJ9",
            },
            {
                label: "random counter",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzIiXSwiQSI6WyJBOUEiXSwiRiI6WyJGMyJdLCJNIjpbIk02IiwiTTIyIiwiTTEwIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE5QiJdLCJGIjpbIkYzIl19LHsiUyI6WyJTOUEiXSwiQSI6WyJBMTAiXSwiTSI6WyJNMjBBIl19LHsiUyI6WyJTMiJdLCJBIjpbIkE5QiJdLCJGIjpbIkY0Il0sIk0iOlsiTTIwQiIsIk02Il19LHsiUyI6WyJTOUIiXSwiQSI6WyJBNSJdLCJGIjpbIkYyMEEiXSwiTSI6WyJNMTUoMDAwMDAwMTAxMDAwMDAwMTAwMDEwMTExMCkiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC4yNyJ9",
            },
            {
                label: "slider levels",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzExIl0sIkEiOlsiQTEwIl0sIkYiOlsiRjgiXSwiTSI6WyJNNiJdfSx7IlMiOlsiUzExIl0sIkEiOlsiQTEwIl0sIkYiOlsiRjkiXSwiTSI6WyJNNyJdfSx7IlMiOlsiUzExIl0sIkEiOlsiQTEwIl0sIkYiOlsiRjEwIl0sIk0iOlsiTTgiXX0seyJTIjpbIlMxMSJdLCJBIjpbIkExMCJdLCJGIjpbIkYxMSJdLCJNIjpbIk05Il19LHsiUyI6WyJTMTEiXSwiQSI6WyJBMTAiXSwiRiI6WyJGMTIiXSwiTSI6WyJNMTAiXX0se31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7fV19LCJ2ZXJzaW9uIjoidjIuNC4yOCJ9",
            },
            {
                label: "light levels",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzUiXSwiQSI6WyJBMTAiXSwiRiI6WyJGOCJdLCJNIjpbIk02Il19LHsiUyI6WyJTNSJdLCJBIjpbIkExMCJdLCJGIjpbIkY5Il0sIk0iOlsiTTciXX0seyJTIjpbIlM1Il0sIkEiOlsiQTEwIl0sIkYiOlsiRjEwIl0sIk0iOlsiTTgiXX0seyJTIjpbIlM1Il0sIkEiOlsiQTEwIl0sIkYiOlsiRjExIl0sIk0iOlsiTTkiXX0seyJTIjpbIlM1Il0sIkEiOlsiQTEwIl0sIkYiOlsiRjEyIl0sIk0iOlsiTTEwIl19LHt9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHsiUiI6W3t9XX0se31dfSwidmVyc2lvbiI6InYyLjQuMjgifQ==",
            },
            {
                label: "count turns",
                b64: "eyJwcm9nZGVmIjp7IlAiOlt7IlIiOlt7IlMiOlsiUzEyIl0sIkEiOlsiQTlBIl0sIkYiOlsiRjIxTCJdLCJNIjpbIk0yMEEiLCJNNiJdfSx7IlMiOlsiUzEyIl0sIkEiOlsiQTlCIl0sIkYiOlsiRjIxUiJdLCJNIjpbIk0yMEIiLCJNNiJdfSx7IlMiOlsiUzlBIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQSJdfSx7IlMiOlsiUzlCIl0sIkEiOlsiQTEwIl0sIk0iOlsiTTIwQiJdfSx7fV19LHsiUiI6W3t9XX0seyJSIjpbe31dfSx7IlIiOlt7fV19LHt9XX0sInZlcnNpb24iOiJ2Mi40LjI4In0=",
            },
            // TODO: keys
            // TODO: magnet sensor
            // TODO: light sensor
        ]
        return s
    }

    export function samples(withIcon: boolean): Sample[] {
        const s = rawSamples()
        return s
            .filter(({ icon }) => !withIcon || !!icon)
            .map(
                ({ label, ariaId, icon, b64 }) =>
                    new Sample(label, ariaId, icon, b64)
            )
    }
}
