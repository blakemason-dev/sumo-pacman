

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
import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';

export const createP2PhysicsSystem = () => {
    // create our physics world
    const p2World = new p2.World({
        gravity: [0, 0]
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

    // body only queries
    const p2BodyQuery = defineQuery([P2Body]);
    const p2BodyQueryEnter = enterQuery(p2BodyQuery);
    const p2BodyQueryExit = exitQuery(p2BodyQuery);

    // body and shape queries
    const p2ShapeCircleQuery = defineQuery([P2Body, P2ShapeCircle]);
    const p2ShapeCircleQueryEnter = enterQuery(p2ShapeCircleQuery);
    const p2ShapeCircleQueryExit = exitQuery(p2ShapeCircleQuery);

    // body and client movement queries
    const clientMoveBodyQuery = defineQuery([P2Body, ClientMovement]);

    const FIXED_TIME_STEP = 1 / 20;
    let previous_ms = Date.now();

    return defineSystem((ecsWorld: IWorld) => {
        // find time deltas
        const current_ms = Date.now();
        const dt = Date.now() - previous_ms;
        previous_ms = current_ms;

        // ENTER
        // when bodies first run in system
        const enterP2Bodies = p2BodyQueryEnter(ecsWorld);
        enterP2Bodies.map(eid => {
            // create a p2 body
            const bod = new p2.Body({
                mass: P2Body.mass[eid],
                position: [P2Body.position.x[eid], P2Body.position.y[eid]],
                angle: P2Body.angle[eid]
            })

            // set body type
            switch (P2Body.type[eid]) {
                case 0: bod.type = p2.Body.STATIC; break;
                case 1: bod.type = p2.Body.DYNAMIC; break;
                case 2: bod.type = p2.Body.KINEMATIC; break;
                default: bod.type = 1; break;
            }

            // set collsion response
            bod.collisionResponse = P2Body.collisionResponse ? true : false;

            // add body to the world
            p2World.addBody(bod);

            // set body in our entity map
            p2BodiesById.set(eid, bod);
        });

        // when shapes first run in system
        const enterP2ShapeCircles = p2ShapeCircleQueryEnter(ecsWorld);
        enterP2ShapeCircles.map(eid => {
            // create a new shape
            const shape = new p2.Circle({
                radius: P2ShapeCircle.radius[eid],
            });

            // add shape to matching body
            if (shape) {
                p2BodiesById.get(eid)?.addShape(shape);
            }
            
            // set shape in entity map
            p2ShapeCirclesById.set(eid, shape);
        });

        // UPDATE
        // 1) move any bodies controlled by client movement
        const clientMoveBodiesQuery = clientMoveBodyQuery(ecsWorld);
        clientMoveBodiesQuery.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                bod.velocity = [P2Body.velocity.x[eid], P2Body.velocity.y[eid]];
                bod.angle = P2Body.angle[eid];
            }
        });

        // 2) step the physics world
        p2World.step(dt / 1000, FIXED_TIME_STEP, 10);

        // 3) apply new physics states to P2Bodies
        const p2Bodies = p2BodyQuery(ecsWorld);
        p2Bodies.map(eid => {
            const bod = p2BodiesById.get(eid);
            if (bod) {
                P2Body.position.x[eid] = bod.position[0];
                P2Body.position.y[eid] = bod.position[1];
                P2Body.angle[eid] = bod.angle;
                bod.angularVelocity = 0;
            }
        });

        // EXIT

        return ecsWorld;
    })
}