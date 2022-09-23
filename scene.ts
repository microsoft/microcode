namespace microcode {
    const INPUT_PRIORITY = 10
    const UPDATE_PRIORITY = 20
    const RENDER_PRIORITY = 30
    const SCREEN_PRIORITY = 100

    export abstract class Scene {
        private xfrm_: Affine
        private color_: number

        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() {
            return this.xfrm_
        }
        //% blockCombine block="color" callInDebugger
        public get color() {
            return this.color_
        }
        public set color(v) {
            this.color_ = v
        }

        constructor(public app: App, public name: string) {
            this.xfrm_ = new Affine()
            this.color_ = 12
        }

        /* abstract */ startup() {}

        /* abstract */ shutdown() {}

        /* override */ activate() {
            pointerevents.pushContext((x, y) => this.handleClick(x, y))
        }

        /* override */ deactivate() {
            pointerevents.popContext()
        }

        /* abstract */ update() {}

        /* abstract */ draw() {}

        protected handleClick(x: number, y: number) {
            console.log(`click ${this.name} ${x}, ${y}`)
        }
        
        __init() {
            control.eventContext().registerFrameHandler(INPUT_PRIORITY, () => {
                const dtms = (control.eventContext().deltaTime * 1000) | 0
                controller.left.__update(dtms)
                controller.right.__update(dtms)
                controller.up.__update(dtms)
                controller.down.__update(dtms)
            })
            // Setup frame callbacks.
            control.eventContext().registerFrameHandler(UPDATE_PRIORITY, () => {
                this.update()
            })
            control.eventContext().registerFrameHandler(RENDER_PRIORITY, () => {
                Screen.image.fill(0)
                this.draw()
                screen.fill(this.color_)
                screen.drawTransparentImage(Screen.image, 0, 0)
            })
            control
                .eventContext()
                .registerFrameHandler(SCREEN_PRIORITY, control.__screen.update)
        }
    }

    export class SceneManager {
        scenes: Scene[]

        constructor() {
            this.scenes = []
        }

        public pushScene(scene: Scene) {
            const currScene = this.currScene()
            if (currScene) {
                currScene.deactivate()
            }
            control.pushEventContext()
            this.scenes.push(scene)
            scene.startup()
            scene.activate()
            scene.__init()
        }

        public popScene() {
            const prevScene = this.scenes.pop()
            if (prevScene) {
                prevScene.deactivate()
                prevScene.shutdown()
                control.popEventContext()
            }
            const currScene = this.currScene()
            if (currScene) {
                currScene.activate()
            }
        }

        private currScene(): Scene {
            if (this.scenes.length) {
                return this.scenes[this.scenes.length - 1]
            }
            return undefined
        }
    }
}
