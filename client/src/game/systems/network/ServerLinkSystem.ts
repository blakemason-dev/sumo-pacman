import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';

import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import iSumoPacmanState from '../../../../../shared/types/iSumoPacmanState';
import { ServerLink } from '../../components/network/ServerLink';

export const createServerLinkSystem = async (scene: Phaser.Scene) => {
    // establish link to colyseus
    const client = new Client('ws://localhost:8500');
    let room: any = undefined;
    room = await client.joinOrCreate<iSumoPacmanState & Schema>('sumo-pacman');
    
    let connections = 0;

    const connectionQuery = defineQuery([ServerLink]);
    const connectionQueryEnter = enterQuery(connectionQuery);
    const connectionQueryExit = exitQuery(connectionQuery);

    return defineSystem((world: IWorld) => {
        const enterConnections = connectionQueryEnter(world);
        enterConnections.map(eid => {
            console.log('Entered ServerConnection: ', eid);
            connections++;
        });

        const exitConnections = connectionQueryExit(world);
        exitConnections.map(eid => {
            console.log('Exited ServerConnection: ', eid);
            connections--;
            if (connections === 0) {
                room.leave();
            }
        });

        return world;
    })
}