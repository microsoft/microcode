namespace kojac {

    const SAVEGAME = "saveGame5";

    export type SavedGame = {
        chars: CharacterState[];
        camera: { x: number, y: number },
        cursor: { x: number, y: number }
    };

    function mkSavedGame(): SavedGame {
        return {
            chars: [],
            camera: { x: 0, y: 0 },
            cursor: { x: 0, y: 0 }
        }
    }

    export enum GameMode {
        Edit,
        Play
    }

    const STAGE_ID = "world";

    export class WorldStage extends Stage {
        static ID = STAGE_ID;
        gameMode: GameMode;
        playBtn: Button;
        stopBtn: Button;
        //objectModeBtn: Button;
        //terrainModeBtn: Button;
        newBtn: Button;
        createMenu: Menu;
        charMenu: Menu;
        carryTarget: Character;
        physics: Physics;

        constructor(app: App) {
            super(app, STAGE_ID);
        }

        initScene() {
            super.initScene();
            this.physics = new Physics(this);
            scene.setBackgroundColor(13);
            this.playBtn = new Button(this, "white", "play", "Play", 8, 112, true, () => this.handlePlayClicked());
            this.stopBtn = new Button(this, "white", "stop", "Stop", 8, 112, true, () => this.handleStopClicked());
            //this.objectModeBtn = new Button(this, "white", "object_mode", "Objects", 25, 112, true, () => {});
            //this.terrainModeBtn = new Button(this, "white", "terrain_mode", "Terrain", 42, 112, true, () => {});
            this.newBtn = new Button(this, "danger", "new_file", "New", 8, 8, true, () => this.handleNewFileClicked());
            const createMenuItems = Characters.getCharacters().map(char => {
                return {
                    icon: char.id,
                    label: char.name
                };
            });
            this.createMenu = new Menu(this, createMenuItems, false);
            const charMenuItems: MenuItemDefn[] = [
                { icon: "edit", label: "Edit" },
                { icon: "move", label: "Move" },
                { icon: "duplicate", label: "Duplicate" },
                { icon: "delete", label: "Delete", style: "danger" }
            ];
            this.charMenu = new Menu(this, charMenuItems, false);
            this.setGameMode(GameMode.Edit);

            this.start();



            /*
            game.onUpdateInterval(5000, function () {
                // Watch for sprite leaks.
                console.log("# sprites: " + game.currentScene().allSprites.length);
                // Watch for memory leaks.
                // control.heapSnapshot()
            });
            */
        }

        handleMenuPressed() {
            this.toggleGameMode();
        }

        private toggleGameMode() {
            if (this.gameMode === GameMode.Play) {
                this.setGameMode(GameMode.Edit);
            } else {
                this.setGameMode(GameMode.Play);
            }
        }

        private handlePlayClicked() {
            this.setGameMode(GameMode.Play);
        }

        private handleStopClicked() {
            this.setGameMode(GameMode.Edit);
        }

        private handleNewFileClicked() {
            setTimeout(() => {
                if (game.ask("New Game", "Are you sure?")) {
                    settings.writeString(SAVEGAME, null);
                    this.load();
                }
            }, 1);
        }

        private setGameMode(mode: GameMode) {
            if (this.gameMode === mode) { return; }
            if (mode === GameMode.Play) { this.save(); }
            this.gameMode = mode;
            if (mode === GameMode.Edit) { this.load(); }
            this.playBtn.setVisible(mode === GameMode.Edit);
            this.newBtn.setVisible(mode === GameMode.Edit);
            this.stopBtn.setVisible(mode === GameMode.Play);
            //this.objectModeBtn.setVisible(mode === GameMode.Edit);
            //this.terrainModeBtn.setVisible(mode === GameMode.Edit);
            this.createMenu.hide();
            this.charMenu.hide();
            this.components.forEach(comp => comp.notify("gameModeChanged", mode));
        }

        save() {
            if (this.gameMode === GameMode.Play) {
                throw "aah!";
            }
            const savedGame = mkSavedGame();
            this.components.forEach(comp => comp.notify("save", savedGame));
            const s = JSON.stringify(savedGame, (key: string, value: any) => { return value != null ? value : undefined });
            //console.logValue("save", s);
            settings.writeString(SAVEGAME, s);
        }

        private load() {
            const chars = this.components
                .filter(comp => comp.kind === "character")
                .map(comp => comp as Character);
            chars.forEach((char) => char.destroy());
            try {
                if (settings.exists(SAVEGAME)) {
                    const s = settings.readString(SAVEGAME);
                    //console.logValue("load", s);
                    if (s) {
                        const savedGame: SavedGame = JSON.parse(s);
                        if (savedGame) {
                            this.components.forEach(comp => comp.notify("load", savedGame));
                            if (savedGame.chars) {
                                savedGame.chars.forEach(state => this.spawnCharacter(
                                    state.x,
                                    state.y,
                                    chardb.characters[state.id],
                                    BrainDefn.FromObj(state.bdefn)));
                                }
                        }
                    } else {
                        this.camera.x = 0;
                        this.camera.y = 0;
                        this.cursor.x = 0;
                        this.cursor.y = 0;
                    }
                }
            } catch { }
        }

        public handleCursorCanvasClick(x: number, y: number) {
            if (this.gameMode === GameMode.Edit) {
                this.editModeHandleCanvasClick(x, y);
            }
        }

        private editModeHandleCanvasClick(x: number, y: number) {
            if (this.carryTarget) {
                this.cursorDrop();
            } else {
                this.closeMenus();
                this.createMenu.show(x, y, "right", (button) => this.handleCreateMenuSelection(x, y, button));
                this.updateHover();
            }
        }

        private handleCreateMenuSelection(x: number, y: number, selection: Button) {
            this.closeMenus();
            this.cursor.moveTo(x, y);
            const charDefn = chardb.characters[selection.id];
            if (charDefn) {
                this.spawnCharacter(x, y, charDefn);
            }
        }

        public spawnCharacter(x: number, y: number, defn: CharacterDefn, bdefn?: BrainDefn): Character {
            bdefn = bdefn || new BrainDefn();
            const char = new Character(this, x, y, defn, bdefn);
            this.save();
            return char;
        }

        public handleCursorCharacterClick(char: Character, x: number, y: number) {
            if (this.gameMode === GameMode.Edit) {
                if (this.carryTarget) {
                    this.cursorDrop();
                } else {
                    this.closeMenus();
                    x = char.x;
                    y = char.y;
                    this.cursor.moveTo(x, y);
                    this.charMenu.show(x + 16, y, "down", (button) => this.handleCharacterMenuSelection(x, y, button, char));
                    this.updateHover();
                }
            }
        }

        private handleCharacterMenuSelection(x: number, y: number, selection: Button, char: Character) {
            this.closeMenus();
            this.cursor.moveTo(x, y);
            switch (selection.id) {
                case "edit": {
                    this.app.pushStage(new KodeStage(this.app, char));
                    break;
                }
                case "move": {
                    this.cursorPickUp(char);
                    break;
                }
                case "duplicate": {
                    this.duplicate(char);
                    break;
                }
                case "delete": {
                    char.destroy();
                    this.save();
                    break;
                }
            }
        }

        public handleCursorButtonClick(button: Button) {
            if (!this.carryTarget) {
                button.click();
            }
        }

        public handleCursorCancel() {
            this.closeMenus();
        }

        public closeMenus() {
            this.createMenu.hide();
            this.charMenu.hide();
        }

        public cursorPickUp(char: Character) {
            this.cursorDrop();
            this.carryTarget = char;
            this.carryTarget.x = this.cursor.x;
            this.carryTarget.y = this.cursor.y;
            this.cursor.setCursorMode("burdened");
        }

        public cursorDrop() {
            this.carryTarget = null;
            this.cursor.setCursorMode("free");
            this.save();
        }

        public duplicate(char: Character) {
            this.spawnCharacter(char.x + 8, char.y + 8, char.defn, char.bdefn);
        }

        update(dt: number) {
            super.update(dt);
            if (this.gameMode === GameMode.Play) {
                this.physics.simulate();
                this.cursor.enable();
                const chars = this.components.filter(comp => comp.kind === "character") as Character[];
                chars.forEach(char => char.think());
            }
        }

        updateHover() {
            const buttons = this.components
                .filter(comp => comp.kind === "button") as Button[];
            const overlapping = this.cursor.getAllOverlapping()
                .filter(spr => spr.data["kind"] === "button")
                .sort((a, b) => b.z - a.z)
                .map(spr => spr.data["component"] as Button);
            const button = overlapping.shift();
            buttons.forEach(elem => elem.hover(elem === button));
        }

        get<T>(field: string): T {
            switch (field) {
                case "gameMode": return this.gameMode as any as T;
                case "physics": return this.physics as any as T;
                default: return super.get(field);
            }
        }

        notify(event: string, parm?: any) {
            switch (event) {
                case "cursor:moved": {
                    if (this.carryTarget) {
                        this.carryTarget.x = this.cursor.x;
                        this.carryTarget.y = this.cursor.y;
                    } else {
                        this.updateHover();
                    }
                    break;
                }
                case "physics:collision": {
                    const { body1, body2 } = parm;
                    const char1 = body1.kelpie.data["component"] as Character;
                    const char2 = body2.kelpie.data["component"] as Character;
                    char1.addBump(char2);
                    char2.addBump(char1);
                    break;
                }
                case "camera:follow": {
                    const char: Character = parm;
                    this.camera.follow(char);
                    break;
                }
                case "char:has-input": {
                    this.cursor.disable();
                    break;
                }
                case "character:destroying": {
                    const char: Character = parm;
                    if (this.camera.following === char) {
                        this.camera.follow(null);
                    }
                    break;
                }
                case "project:save": {
                    this.save();
                    break;
                }
                case "project:load": {
                    this.load();
                    break;
                }
                default: {
                    super.notify(event, parm);
                }
            }
        }
    }
}