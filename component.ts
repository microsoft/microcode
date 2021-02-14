namespace kojac {
    export class Component {
        private _data: any;

        get data(): any {
            if (!this._data) this._data = {};
            return this._data;
        }
        set data(value: any) {
            this._data = value;
        }

        constructor(public stage: Stage, public kind: string) {
            this.stage.add(this);
        }

        destroy() {
            this._data = undefined;
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
