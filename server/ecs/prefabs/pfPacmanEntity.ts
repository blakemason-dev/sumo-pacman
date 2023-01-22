import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';
import { PacmanUpdater } from '../components/PacmanUpdater';
import { RingOutChecker } from '../components/RingOutChecker';


export const createPfPacmanEntity = (world: IWorld, ringStartRadius: number) => {
    const eid = addEntity(world);

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5;
    P2Body.type[eid] = 1;   // 0 = static, 1 = dynamic, 2 = kinematic

    addComponent(world, P2ShapeCircle, eid);
    P2ShapeCircle.radius[eid] = 0.5;
    // need to add offset code

    addComponent(world, PacmanUpdater, eid);

    addComponent(world, ClientMovement, eid);

    addComponent(world, RingOutChecker, eid);
    RingOutChecker.radius[eid] = ringStartRadius;

    return eid;
}
