namespace kojac {
    export type AgentState = {
        id: string;
        bdefn: string;
    }

    /**
     * An Agent is the context upon which a brain executes.
     * For this project that is a device like a microbit.
     * For a project like makekodu it would be an entity in a simulation.
     */
    export class Agent extends Component {
        public bdefn: BrainDefn;
    }
}
