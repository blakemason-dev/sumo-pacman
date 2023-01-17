import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import p2 from 'p2';
import { P2Body } from '../components/P2Body';

export const createP2PhysicsSystem = () => {
    // create our physics world
    const p2World = new p2.World({
        gravity: [0, 0]
    });
    p2World.defaultContactMaterial.friction = 0.3;
    p2World.defaultContactMaterial.restitution = 0.3;
    p2World.defaultContactMaterial.stiffness = 1e7;

    // create a body map
    const p2BodiesById = new Map<number, p2.Body>();
    
    // create our body query
    const p2BodyQuery = defineQuery([P2Body]);
    const p2BodyQueryEnter = enterQuery(p2BodyQuery);
    const p2BodyQueryExit = exitQuery(p2BodyQuery);

    const FIXED_TIME_STEP = 1 / 20;
    let previous_ms = Date.now();

    return defineSystem((ecsWorld: IWorld) => {
        // find time deltas
        const current_ms = Date.now();
        const dt = Date.now() - previous_ms;
        previous_ms = current_ms;

        // // when bodies first run in system
        const enterP2Bodies = p2BodyQueryEnter(ecsWorld);
        enterP2Bodies.map(eid => {
            p2BodiesById.set(eid, new p2.Body({
                mass: P2Body.mass[eid],
                position: [P2Body.position.x[eid], P2Body.position.y[eid]],
                angle: P2Body.angle[eid]
            }));
            const bod = p2BodiesById.get(eid);
            if (bod) {
                switch (P2Body.type[eid]) {
                    case 0: bod.type = p2.Body.STATIC; break;
                    case 1: bod.type = p2.Body.DYNAMIC; break;
                    case 2: bod.type = p2.Body.KINEMATIC; break;
                    default: break;
                }
            }
        });

        // // during update of system
        // const p2Bodies = p2BodyQuery(ecsWorld);
        // p2Bodies.map(eid => {
        //     const { time } = ecsWorld;
        // });



        // step the physics world
        p2World.step(dt, FIXED_TIME_STEP, 10);

        return ecsWorld;
    })
}