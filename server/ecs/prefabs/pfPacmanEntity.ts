import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';
import { PacmanUpdater } from '../components/PacmanUpdater';


export const createPfPacmanEntity = (world: IWorld) => {
    const eid = addEntity(world);

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5;
    P2Body.type[eid] = 2;   // 0 = static, 1 = dynamic, 2 = kinematic

    addComponent(world, PacmanUpdater, eid);

    addComponent(world, ClientMovement, eid);

    return eid;
}
