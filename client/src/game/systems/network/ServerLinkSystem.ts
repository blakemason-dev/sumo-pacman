import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';

import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import iSumoPacmanState, { Pacman } from '../../../../../server/types/iSumoPacmanState';
import { Message } from '../../../../../server/types/messages';
import { ServerLink } from '../../components/network/ServerLink';
import { ClientInput } from '../../components/ClientInput';
import { Transform } from '../../components/Transform';

export const createServerLinkSystem = async (scene: Phaser.Scene) => {
    // establish link to colyseus
    const client = new Client('ws://localhost:8500');
    const room = await client.joinOrCreate<iSumoPacmanState & Schema>('sumo-pacman');

    // const pacmen = new Map<number, Pacman>();

    // room.state.pacmen.onAdd = (player, key) => {
    //     console.log(player, ' has been added at ', key);
        
    //     player.onChange = (changes) => {
    //         changes.map(change => {
    //             console.log('field: ', change.field);
    //             console.log('value: ', change.value);
    //             console.log('previousValue: ', change.previousValue);
    //         });
    //     }
    // }

    // ServerLink component workflow
    // 1) Connect to room
    // 2) Room stores sessionId
    // 3) Once room is full it sends out all entities and their session id's
    // 4) Client draws all entities received

    room.onMessage('start', () => {
        console.log('room is ready');
    });

    
    let connections = 0;

    const connectionQuery = defineQuery([ServerLink]);
    const connectionQueryEnter = enterQuery(connectionQuery);
    const connectionQueryExit = exitQuery(connectionQuery);

    const inputQuery = defineQuery([ClientInput, ServerLink]);

    const movementQuery = defineQuery([ServerLink, Transform]);
    const movementQueryEnter = enterQuery(movementQuery);

    return defineSystem((world: IWorld) => {
        // Handle ServerLink's
        const enterConnections = connectionQueryEnter(world);
        enterConnections.map(eid => {
            console.log('Entered ServerConnection: ', eid);
            room.send(Message.ClientEntityID, {eid: eid, serverLinkType: ServerLink.linkType[eid]});
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

        // Handle ClientInput's
        const inputs = inputQuery(world);
        inputs.map(eid => {
            if (ClientInput.w_key_down[eid]) {
                room.send(Message.ClientMoveUp);
            }
            if (ClientInput.s_key_down[eid]) {
                room.send(Message.ClientMoveDown);
            }
            if (ClientInput.a_key_down[eid]) {
                room.send(Message.ClientMoveRight);
            }
            if (ClientInput.d_key_down[eid]) {
                room.send(Message.ClientMoveLeft);
            }
        });

        // Handle movements
        const enterMovements = movementQueryEnter(world);
        enterMovements.map(eid => {

        });

        return world;
    })
}