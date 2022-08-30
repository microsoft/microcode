namespace microcode {
    /**
     * An Agent is an object that can execute a program. In this demo, there is only one agent: the micro:bit.
     */
    export class Agent {
        public prog: Program;

        constructor(public home: Home, public progdef: ProgramDefn) {
            this.prog = new Program(this);
        }

        public destroy() {
            this.prog.destroy();
            this.prog = undefined;
        }

        public update() {
            this.prog.execute();
        }

        public logBoolean(name: string, val: boolean, color: number) {
            this.home.logBoolean(name, val, color);
        }

        public logNumber(name: string, val: number, color: number) {
            this.home.logNumber(name, val, color);
        }

        public logString(name: string, val: string, color: number) {
            this.home.logString(name, val, color);
        }

        public plotBoolean(name: string, val: boolean, color: number) {
            this.home.plotBoolean(name, val, color);
        }

        public plotNumber(name: string, val: number, color: number) {
            this.home.plotNumber(name, val, color);
        }
    }
}