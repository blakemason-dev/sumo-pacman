// SumoPacmanStateSyncSystem.ts
//  - Syncs p2 bodies with pacmen on the colyseus state

import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not
} from 'bitecs';

import { Pacman } from '../../types/iSumoPacmanState';
import { P2Body } from '../components/P2Body';
import { PacmanUpdater } from '../components/PacmanUpdater';

export const createSumoPacmanStateSyncSystem = (pacmen: Pacman[]) => {
    // create queries
    const updaterQuery = defineQuery([PacmanUpdater, P2Body]);
    const updaterQueryEnter = enterQuery(updaterQuery);
    const updaterQueryExit = exitQuery(updaterQuery);

    return defineSystem((ecsWorld: IWorld) => {
        const updaters = updaterQuery(ecsWorld);

        updaters.map(eid => {
            pacmen[PacmanUpdater.serverIndex[eid]].position.x = P2Body.position.x[eid];
            pacmen[PacmanUpdater.serverIndex[eid]].position.y = P2Body.position.y[eid];
            pacmen[PacmanUpdater.serverIndex[eid]].angle = P2Body.angle[eid];
        });

        return ecsWorld;
    })
}