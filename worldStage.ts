namespace kojac {

    const SAVEGAME = "sg0";

    export type SavedGame = {
        agents: AgentState[];
    };

    function mkSavedGame(): SavedGame {
        return {
            agents: [],
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

        constructor(app: App) {
            super(app, STAGE_ID);
        }

        initScene() {
            super.initScene();
            scene.setBackgroundColor(13);
            this.start();
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
            const agents = this.components
                .filter(comp => comp.kind === "agent")
                .map(comp => comp as Agent);
            agents.forEach(agent => agent.destroy());
            try {
                if (settings.exists(SAVEGAME)) {
                    const s = settings.readString(SAVEGAME);
                    //console.logValue("load", s);
                    if (s) {
                        const savedGame: SavedGame = JSON.parse(s);
                        if (savedGame) {
                            this.components.forEach(comp => comp.notify("load", savedGame));
                            if (savedGame.agents) {
                                savedGame.agents.forEach(state => this.spawnAgent(BrainDefn.FromObj(state.bdefn)));
                                }
                        }
                    } else {
                        this.camera.x = 0;
                        this.camera.y = 0;
                    }
                }
            } catch { }
        }

        public spawnAgent(type: string, bdefn?: BrainDefn): Agent {
            bdefn = bdefn || new BrainDefn();
            const agent = Agent.Spawn(this, type, bdefn);
            this.save();
            return agent;
        }

        public handleCursorButtonClick(button: Button) {
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