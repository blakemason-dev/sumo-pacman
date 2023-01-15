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
import Server from '../../services/Server';
import { ServerMessageSender } from '../../components/network/ServerMessageSender';
import { ServerPacmanController } from '../../components/network/ServerPacmanController';
import { ServerMessageReceiver } from '../../components/network/ServerMessageReceiver';

export const createServerMessageSystem = async (scene: Phaser.Scene, server: Server) => {

    const senderQuery = defineQuery([ClientInput, ServerMessageSender]);
    const senderQueryEnter = enterQuery(senderQuery);
    const senderQueryExit = exitQuery(senderQuery);

    const receiverQuery = defineQuery([ServerPacmanController, ServerMessageReceiver]);
    const receiverQueryEnter = enterQuery(receiverQuery);
    const receiverQueryExit = exitQuery(receiverQuery);

    let numReceivers = 0;

    const room = server.room;

    return defineSystem((world: IWorld) => {
        // make sure we have a room
        if (!room) return world;

        // Handle ServerLink's
        const enterSenders = senderQueryEnter(world);
        enterSenders.map(eid => {
            console.log('Entered ServerMessenger: ', eid);
            room.send(Message.ClientEntityID, {eid: eid, serverLinkType: ServerLink.linkType[eid]});
        });

        const senders = senderQuery(world);
        senders.map(eid => {
            if (ClientInput.w_key_down[eid]) {
                room.send(Message.ClientMoveUp);
            }
            if (ClientInput.s_key_down[eid]) {
                room.send(Message.ClientMoveDown);
            }
            if (ClientInput.a_key_down[eid]) {
                room.send(Message.ClientMoveLeft);
            }
            if (ClientInput.d_key_down[eid]) {
                room.send(Message.ClientMoveRight);
            }
        })

        const exitSenders = senderQueryExit(world);
        exitSenders.map(eid => {
            console.log('Exited ServerMessenger: ', eid);
        });

        const enterReceivers = receiverQueryEnter(world);
        enterReceivers.map(eid => {
            if (numReceivers === 0) {
                server.eventEmitter.on('state-changed', (state) => {
                    state.pacmen.map((pacman: Pacman, index: number) => {
                        if (ServerPacmanController.serverIndex[eid] === index) {
                            Transform.position.x[eid] = pacman.position.x;
                            Transform.position.y[eid] = pacman.position.y;
                        }
                    })
                });
            }
        });

        const receivers = receiverQuery(world);
        receivers.map(eid => {

        });

        return world;
    })
}