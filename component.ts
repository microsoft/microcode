namespace kojac {
    let id_sequence = 0;

    export class Component {
        private _id: number;
        private _data: any;

        //% blockCombine block="id" callInDebugger
        get id() { return this._id; }
        get data(): any {
            if (!this._data) { this._data = {}; }
            return this._data;
        }

        constructor(public stage: Stage, public kind: string) {
            this._id = id_sequence++;
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
