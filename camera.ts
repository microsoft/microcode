namespace kojac {
    export class Camera extends Component {
        camera_movement_x: number;
        camera_movement_y: number;
        x: number;
        y: number;
        widthOver2: number;
        heightOver2: number;

        //% blockCombine block="pos" callInDebugger
        public get pos(): Vec2 { return mkVec2(this.x, this.y); }
        public set pos(v: Vec2) { this.x = v.x; this.y = v.y; }

        constructor(stage: Stage) {
            super(stage, StageLayer.HUD, "camera");
            this.x = scene.cameraProperty(CameraProperty.X);
            this.y = scene.cameraProperty(CameraProperty.Y);
            this.widthOver2 = scene.screenWidth() >> 1;
            this.heightOver2 = scene.screenHeight() >> 1;
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
            if (dx < -this.widthOver2) {
                nxtX = x + this.widthOver2;
            }
            if (dx >= this.widthOver2) {
                nxtX = x - this.widthOver2;
            }
            if (dy < -this.heightOver2) {
                nxtY = y + this.heightOver2;
            }
            if (dy >= this.heightOver2) {
                nxtY = y - this.heightOver2;
            }
            this.x = nxtX;
            this.y = nxtY;
            this.camera_movement_x = this.x - camX;
            this.camera_movement_y = this.y - camY;
            scene.centerCameraAt(this.x, this.y);
        }
    }
}