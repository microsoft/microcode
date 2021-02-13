namespace kojac {
    export class Camera extends Component {
        camera_movement_x: number;
        camera_movement_y: number;
        x: number;
        y: number;

        public get pos(): Vec2 { return mkVec2(this.x, this.y); }
        public set pos(v: Vec2) { this.x = v.x; this.y = v.y; }
        
        constructor(stage: Stage) {
            super(stage, "camera");
            this.x = scene.cameraProperty(CameraProperty.X);
            this.y = scene.cameraProperty(CameraProperty.Y);
        }

        public setScreenRelativePosition(k: SpriteLike, x: number, y: number) {
            const s = k as any;
            s.x = scene.cameraProperty(CameraProperty.X) - scene.screenWidth() / 2 + x + this.camera_movement_x;
            s.y = scene.cameraProperty(CameraProperty.Y) - scene.screenHeight() / 2 + y + this.camera_movement_y;
        }

        public moveTo(x: number, y: number) {
            this.x = x;
            this.y = y;
            scene.centerCameraAt(this.x, this.y);
        }

        update(dt: number) {
            this.camera_movement_x = 0;
            this.camera_movement_y = 0;
            // TODO: Keep in frame stuff
        }

        keepInFrame(x: number, y: number) {
            const camX = this.x;
            const camY = this.y;
            let nxtX = camX;
            let nxtY = camY;
            const dx = x - camX;
            const dy = y - camY;
            if (dx < -80) {
                nxtX = x + 80;
            }
            if (dx >= 80) {
                nxtX = x - 80;
            }
            if (dy < -60) {
                nxtY = y + 60;
            }
            if (dy >= 60) {
                nxtY = y - 60;
            } 
            this.x = nxtX;
            this.y = nxtY;
            this.camera_movement_x = this.x - camX;
            this.camera_movement_y = this.y - camY;
            scene.centerCameraAt(this.x, this.y);
        }

        notify(event: string, parm: any) {
            if (event === "save") {
                const savedGame = parm as SavedGame;
                savedGame.camera.x = this.x;
                savedGame.camera.y = this.y;
            } else if (event === "load") {
                const savedGame = parm as SavedGame;
                this.x = savedGame.camera.x;
                this.y = savedGame.camera.y;
                scene.centerCameraAt(this.x, this.y);
            }
        }
    }
}