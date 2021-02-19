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
    }
}