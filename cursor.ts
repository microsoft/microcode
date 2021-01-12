namespace kojac {
    export type CursorMode = "free" | "burdened";

    const maxCursorSpeed = 120 / 1000;       // pixels/milli
    const startCursorSpeed = 10 / 1000;      //
    const cursorSpeedInc = 10 / 1000;        // 
    const shiftGearsAt = 1000;               // millis

    export class Cursor extends Component {
        cursorMode: CursorMode;
        kel0: Kelpie;
        kel1: Kelpie;
        disabled: boolean;
        moveStartMs: number;    // millis at move start
        cursorSpeed: number;    // pixels/milli

        public get x() { return this.kel0.x; }
        public get y() { return this.kel0.y; }
        public set x(v: number) {
            this.kel0.x = v;
            this.kel1.x = v;
        }
        public set y(v: number) {
            this.kel0.y = v;
            this.kel1.y = v;
        }

        constructor(stage: Stage) {
            super(stage, "cursor");
            this.kel0 = new Kelpie(icons.get("cursor"));
            this.kel1 = new Kelpie(icons.get("carry"));
            this.kel0.invisible = true;
            this.kel1.invisible = true;
            this.kel0.z = 1000;
            this.kel1.z = 1000;
            this.kel0.data["kind"] = "cursor";
            this.kel0.data["component"] = this;
            this.setCursorMode("free");
            this.moveStartMs = 0;
            this.cursorSpeed = 0;
        }

        public setCursorMode(mode: CursorMode) {
            this.cursorMode = mode;
            this.kel0.invisible = mode !== "free";
            this.kel1.invisible = mode !== "burdened";
        }

        public moveTo(x: number, y: number) {
            if (this.disabled) { return; }
            this.x = x;
            this.y = y;
        }

        public disable() {
            this.disabled = true;
            this.kel0.invisible = true;
            this.kel1.invisible = true;
        }

        public enable() {
            this.disabled = false;
            this.setCursorMode(this.cursorMode);
        }

        getAllOverlapping() {
            return util.getAllOverlapping(this.kel0)
                .filter(spr => util.pointInSprite(spr, this.x, this.y))
                .sort((a, b) => b.z - a.z);
        }

        handleAPressed() {
            if (this.disabled) { return; }
            const overlaps = this.getAllOverlapping();
            if (!overlaps.length) {
                // Click the canvas.
                this.stage.notify("cursor:canvasClick", { x: this.x, y: this.y });
                return;
            }
            {   // Click a button?
                const buttons = (overlaps
                    .filter(value => value.data["kind"] === "button")
                    .map(value => value.data["component"]) as Button[])
                    .filter(value => value.clickable());
                const button = buttons.shift();
                if (button) {
                    this.stage.notify("cursor:buttonClick", { button, x: this.x, y: this.y });
                    return;
                }
            }
            {
                // Click a character?
                const chars = overlaps
                    .filter(value => value.data["kind"] === "character")
                    .map(value => value.data["component"]) as Character[];
                const char = chars.shift();
                if (char) {
                    this.stage.notify("cursor:characterClick", { char, x: this.x, y: this.y });
                    return;
                }
            }
        }

        handleBPressed() {
            if (this.disabled) { return; }
            this.stage.notify("cursor:cancel", { x: this.x, y: this.y });
        }

        update(dt: number) {
            if (this.disabled) { return; }
            let x = 0;
            let y = 0;
            if (controller.up.isPressed()) {
                y -= 1;
            }
            if (controller.down.isPressed()) {
                y += 1;
            }
            if (controller.left.isPressed()) {
                x -= 1;
            }
            if (controller.right.isPressed()) {
                x += 1;
            }
            if (x || y) {
                const t = control.millis();
                if (t + shiftGearsAt > this.moveStartMs) {
                    this.moveStartMs = t;
                    this.cursorSpeed += cursorSpeedInc;
                    this.cursorSpeed = Math.min(this.cursorSpeed, maxCursorSpeed);
                }
                this.x += x * this.cursorSpeed * dt;
                this.y += y * this.cursorSpeed * dt;
                this.stage.notify("cursor:moved", { x: this.x, y: this.y });
            } else {
                this.moveStartMs = control.millis();
                this.cursorSpeed = startCursorSpeed;
            }
        }

        notify(event: string, parm: any) {
            if (event === "save") {
                const savedGame = parm as SavedGame;
                savedGame.cursor = { x: this.x, y: this.y };
            } else if (event === "load") {
                const savedGame = parm as SavedGame;
                if (savedGame.cursor) {
                    this.x = savedGame.cursor.x;
                    this.y = savedGame.cursor.y;
                }
                this.disabled = false;
                this.setCursorMode(this.cursorMode);
            }
        }
    }
}
