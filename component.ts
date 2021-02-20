namespace kojac {
    let id_sequence = 0;

    export type ComponentHandler = (comp: Component) => void;

    export class Component {
        private _id: number;
        private _data: any;
        private _destroyHandlers: ComponentHandler[];

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

        public onDestroy(handler: KelpieHandler) {
            this._destroyHandlers = this._destroyHandlers || [];
            this._destroyHandlers.push(handler);
        }

        destroy() {
            if (this.stage) {
                this.stage.remove(this);
                const handlers = this._destroyHandlers || [];
                for (const handler of handlers) {
                    handler(this);
                }
                this._destroyHandlers = undefined;
                this._data = undefined;
            }
        }

        update(dt: number) {
        }
    }
}
