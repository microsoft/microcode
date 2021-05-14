namespace kojac {
    let id_sequence = 0;

    export type ComponentHandler = (comp: Component) => void;

    export interface IKindable {
        kind: string;
    }

    export abstract class Component implements IKindable {
        private id_: number;
        private data_: any;
        private _destroyHandlers: ComponentHandler[];

        //% blockCombine block="id" callInDebugger
        get id() { return this.id_; }
        get data(): any {
            if (!this.data_) { this.data_ = {}; }
            return this.data_;
        }

        constructor(public kind: string) {
            this.id_ = id_sequence++;
        }

        onDestroy(handler: ComponentHandler) {
            this._destroyHandlers = this._destroyHandlers || [];
            this._destroyHandlers.push(handler);
        }

        /* virtual */ destroy() {
            const handlers = this._destroyHandlers || [];
            this._destroyHandlers = undefined;
            for (const handler of handlers) {
                handler(this);
            }
            this.data_ = undefined;
        }

        /* abstract */ update() { }
        /* abstract */ draw() { }
    }

    export interface IPlaceable {
        xfrm: Affine;
    }

    export interface ISizable {
        width: number;
        height: number;
    }

    export class Placeable extends Component implements IPlaceable {
        private xfrm_: Affine;
        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() { return this.xfrm_; }
        constructor(parent?: IPlaceable) {
            super("placeable");
            this.xfrm_ = new Affine();
            this.xfrm_.parent = parent && parent.xfrm;
        }
    }
}
