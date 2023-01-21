

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
import { P2ShapeCircle } from '../components/P2ShapeCircle';

export const createP2PhysicsSystem = () => {
    // create our physics world
    const p2World = new p2.World({
        gravity: [0, -9.81]
    });
    p2World.defaultContactMaterial.friction = 0.3;
    p2World.defaultContactMaterial.restitution = 0.3;
    p2World.defaultContactMaterial.stiffness = 1e7;

    p2World.on('beginContact', (data: any) => {
        console.log('contact');
    })

    // create a body map
    const p2BodiesById = new Map<number, p2.Body>();
    const p2ShapeCirclesById = new Map<number, p2.Circle>();

    // create our body query
    const p2BodyQuery = defineQuery([P2Body]);
    const p2BodyQueryEnter = enterQuery(p2BodyQuery);
    const p2BodyQueryExit = exitQuery(p2BodyQuery);

    const p2ShapeCircleQuery = defineQuery([P2Body, P2ShapeCircle]);
    const p2ShapeCircleQueryEnter = enterQuery(p2ShapeCircleQuery);
    const p2ShapeCircleQueryExit = exitQuery(p2ShapeCircleQuery);

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
            const bod = new p2.Body({
                mass: P2Body.mass[eid],
                position: [P2Body.position.x[eid], P2Body.position.y[eid]],
                angle: P2Body.angle[eid]
            })

            switch (P2Body.type[eid]) {
                case 0: bod.type = p2.Body.STATIC; break;
                case 1: bod.type = p2.Body.DYNAMIC; break;
                case 2: bod.type = p2.Body.KINEMATIC; break;
                default: break;
            }

            bod.addShape(new p2.Circle({ radius: 1 }));

            p2World.addBody(bod);

            p2BodiesById.set(eid, bod);
        });

        // when shapes first run in system
        const enterP2ShapeCircles = p2ShapeCircleQueryEnter(ecsWorld);
        enterP2ShapeCircles.map(eid => {
            console.log('here');
            p2ShapeCirclesById.set(eid, new p2.Circle({
                radius: P2ShapeCircle.radius[eid],
            }));

            // add shape to matching body
            const shape = p2ShapeCirclesById.get(eid);
            if (shape) {
                p2BodiesById.get(eid)?.addShape(shape);
                console.log('and here');
            }
        });

        // 1) apply P2Body actions to bodies
        const p2Bodies = p2BodyQuery(ecsWorld);
        p2Bodies.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                bod.velocity = [P2Body.velocity.x[eid], P2Body.velocity.y[eid]];
                bod.angle = P2Body.angle[eid];
            }
        });

        // 2) step the physics world
        p2World.step(dt / 1000, FIXED_TIME_STEP, 10);

        // 3) apply new physics states to P2Bodies
        p2Bodies.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                P2Body.position.x[eid] = bod.position[0];
                P2Body.position.y[eid] = bod.position[1];
                P2Body.angle[eid] = bod.angle;
            }
        });

        return ecsWorld;
    })
}