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
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';
import { RingOutChecker } from '../components/RingOutChecker';


export const createRingOutCheckerSystem = (sumoPacman: SumoPacman) => {
    // create queries
    const rocQuery = defineQuery([RingOutChecker, P2Body, P2ShapeCircle]);
    const rocQueryEnter = enterQuery(rocQuery);
    const rocQueryExit = exitQuery(rocQuery);

    return defineSystem((ecsWorld: IWorld) => {
        
        const rocs = rocQuery(ecsWorld);
        rocs.map(eid => {
            // check body position versus radius of ring
            const dist = Math.sqrt(P2Body.position.x[eid]**2 + P2Body.position.y[eid]**2)
            if (dist - P2ShapeCircle.radius[eid] > RingOutChecker.radius[eid]) {
                console.log(eid, ' ring out!');
                sumoPacman.ringOut(eid);
            }
        });

        return ecsWorld;
    })
}