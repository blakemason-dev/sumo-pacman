import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';
import { P2ShapeCircle } from '../components/P2ShapeCircle';
import { PacmanUpdater } from '../components/PacmanUpdater';
import { RingOutCheck } from '../components/RingOutCheck';


export const createPfShrinkingRing = (world: IWorld) => {
    const eid = addEntity(world);

    addComponent(world, RingOutCheck, eid);
    RingOutCheck.radius[eid] = 5;

    return eid;
}
