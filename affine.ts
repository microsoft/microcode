namespace microcode {
    /**
     * An Affine represents a euclidean transformation on a Vec2.
     * At the moment this class only supports translation, but if needed it could easily include:
     * - Rotation
     * - Scaling
     * - Skew (less common)
     * Affine transformations can be chained thru the `parent` property, in which case `worldPos` will report the composed value.
     */
    export class Affine {
        private localPos_: Vec2
        private parent_: Affine
        private dirty_: boolean
        private worldPos_: Vec2
        public tag: string

        //% blockCombine block="dirty" callInDebugger
        public get dirty(): boolean {
            return (
                this.dirty_ ||
                this.localPos_.dirty ||
                (this.parent && this.parent.dirty)
            )
        }

        //% blockCombine block="worldPos" callInDebugger
        public get worldPos() {
            if (this.dirty) {
                this.recalc()
            }
            return this.worldPos_
        }

        //% blockCombine block="localPos" callInDebugger
        public get localPos(): Vec2 {
            return this.localPos_
        }
        public set localPos(v: Vec2) {
            this.localPos_.copyFrom(v)
            this.dirty_ = true
        }

        //% blockCombine block="parent" callInDebugger
        public get parent() {
            return this.parent_
        }
        public set parent(p: Affine) {
            this.parent_ = p
            this.dirty_ = true
        }

        //% blockCombine block="root" callInDebugger
        public get root() {
            let node = this.parent
            while (node && node.parent) {
                node = node.parent
            }
            return node
        }

        constructor() {
            this.localPos_ = new Vec2()
            this.worldPos_ = new Vec2()
            this.dirty_ = true
        }

        public copyFrom(src: Affine): this {
            this.localPos.copyFrom(src.localPos)
            return this
        }

        public clone(): Affine {
            const aff = new Affine()
            aff.copyFrom(this)
            return aff
        }

        public recalc(force = false) {
            if (this.dirty || force) {
                this.dirty_ = false
                if (this.parent) {
                    Vec2.TranslateToRef(this.localPos_, this.parent.worldPos, this.worldPos_)
                } else {
                    this.worldPos_.copyFrom(this.localPos)
                }
            }
        }

        public transformToRef(v: Vec2, ref: Vec2): Vec2 {
            return Vec2.TranslateToRef(v, this.worldPos, ref)
        }
    }
}
