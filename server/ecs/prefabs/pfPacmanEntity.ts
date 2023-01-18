import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';
import { P2Body } from '../components/P2Body';
import { PacmanUpdater } from '../components/PacmanUpdater';


export const createPfPacmanEntity = (world: IWorld) => {
    const eid = addEntity(world);

    addComponent(world, P2Body, eid);
    P2Body.mass[eid] = 5;
    P2Body.type[eid] = 1;

    addComponent(world, PacmanUpdater, eid);

    return eid;
}
