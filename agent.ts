namespace kojac {
    export class Agent {
        public prog: Program;

        constructor(public home: Home, public progdef: ProgramDefn) {
            this.prog = new Program(this);
        }

        public destroy() {
            this.prog.destroy();
            this.prog = undefined;
        }

        public update(dt: number) {
            this.prog.execute();
        }

        public logBoolean(val: boolean, color: number) {
            this.home.logBoolean(val, color);
        }

        public logNumber(val: number, color: number) {
            this.home.logNumber(val, color);
        }

        public logString(val: string, color: number) {
            this.home.logString(val, color);
        }

        public plotBoolean(val: boolean, color: number) {
            this.home.plotBoolean(val, color);
        }

        public plotNumber(val: number, color: number) {
            this.home.plotNumber(val, color);
        }
    }
}