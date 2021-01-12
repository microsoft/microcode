namespace kojac {
    export class Component {
        constructor(public stage: Stage, public kind: string) {
            this.stage.add(this);
        }
        destroy() {
            if (this.stage) {
                this.stage.remove(this);
            } else {
                let fff = 0;
            }
        }
        update(dt: number) {}
        notify(event: string, parm: any) {}
    }

    export abstract class ActorComponent extends Component {
        x: number;
        y: number;
        pos: Vec2;
    }
}
