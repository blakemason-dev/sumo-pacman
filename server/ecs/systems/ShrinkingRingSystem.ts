import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';
import SumoPacman from '../../rooms/SumoPacman';
import { RingOutChecker } from '../components/RingOutChecker';

export const createShrinkingRingSystem = (sumoPacman: SumoPacman) => {
    
    const rocQuery = defineQuery([RingOutChecker]);
    
    let previous_ms = Date.now();

    const REDUCTION_RATE = 0.05; // units per second

    return defineSystem((ecsWorld: IWorld) => {

        // find time deltas
        const current_ms = Date.now();
        const dt_ms = Date.now() - previous_ms;
        previous_ms = current_ms;

        // update ring size
        sumoPacman.state.ringRadius -= REDUCTION_RATE * dt_ms * 0.001;

        const rocQueries = rocQuery(ecsWorld);
        rocQueries.map(eid => {
            RingOutChecker.radius[eid] = sumoPacman.state.ringRadius;
        });

        return ecsWorld;
    })
}