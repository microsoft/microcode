namespace kojac {
    export type CharacterDefn = {
        id: string;
        name: string;
        weight: number; // Informs sorting in menus.
        defaults: {
            mass: number;
            friction: number;
            restitution: number;    // bounciness
            bumpCanMove: boolean;
            speed: number;
        }
    };

    export type CharacterMap = {
        [id: string]: CharacterDefn;
    };

    export class Characters {
        public static getCharacters(): CharacterDefn[] {
            const chars = Object.keys(chardb.characters)
                .map(id => chardb.characters[id])
                .sort((a, b) => a.weight - b.weight);
            return chars;
        }
    }

    export type CharacterDatabase = {
        characters: CharacterMap;
    };

    export const chardb: CharacterDatabase = {
        characters: {
            "kodu": {
                id: "kodu",
                name: "Kodu",
                weight: 0,
                defaults: {
                    mass: 5,
                    friction: 0.2,
                    restitution: 0.5,
                    bumpCanMove: true,
                    speed: 0.25,
                }
            },
            "tree": {
                id: "tree",
                name: "Tree",
                weight: 1,
                defaults: {
                    mass: 100,
                    friction: 0.2,
                    restitution: 1,
                    bumpCanMove: false,
                    speed: 0.1,
                }
            },
            "apple": {
                id: "apple",
                name: "Apple",
                weight: 2,
                defaults: {
                    mass: 1,
                    friction: 0.1,
                    restitution: 0.5,
                    bumpCanMove: true,
                    speed: 0.1,
                }
            },
        }
    };
}