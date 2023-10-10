namespace microcode {
    export interface IKindable {
        kind: string
    }

    export abstract class Component implements IKindable {
        /* abstract */ destroy() { }
        /* abstract */ update() {}
        /* abstract */ draw() {}
    }

    export interface IPlaceable {
        xfrm: Affine
    }

    export interface ISizable {
        width: number
        height: number
    }

    export class Placeable extends Component implements IPlaceable {
        private xfrm_: Affine
        //% blockCombine block="xfrm" callInDebugger
        public get xfrm() {
            return this.xfrm_
        }
        constructor(parent?: IPlaceable) {
            super("placeable")
            this.xfrm_ = new Affine()
            this.xfrm_.parent = parent && parent.xfrm
        }
    }
}
