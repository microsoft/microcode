namespace kojac {
    export class Component {
        private _data: any;

        get data(): any {
            if (!this._data) { this._data = {}; }
            return this._data;
        }

        constructor(public stage: Stage, public kind: string) {
            this.stage.add(this);
        }

        destroy() {
            this._data = undefined;
            this.stage.remove(this);
        }

        update(dt: number) {
        }
    
        notify(event: string, parm: any) {
        }
    }
}
