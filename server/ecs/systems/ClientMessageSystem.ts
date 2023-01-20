// ClientMessageHandlerSystem.ts
//  - Every component behaviour that reacts to client messages should be defined here

import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed,
    Not,
    System
} from 'bitecs';
import { Client } from 'colyseus';
import SumoPacman from '../../rooms/SumoPacman';

import { Pacman } from '../../types/iSumoPacmanState';
import { Message } from '../../types/messages';
import { ClientMovement } from '../components/ClientMovement';
import { P2Body } from '../components/P2Body';
import { PacmanUpdater } from '../components/PacmanUpdater';



export const createClientMessageSystem = (sumoPacman: SumoPacman, clientsByEid: Map<number, Client>) => {
    const movementQuery = defineQuery([ClientMovement]);

    // handle movement messages
    sumoPacman.onMessage(Message.ClientMoveUp, (client) => {
        clientsByEid.forEach((cl, key, map) => {
            if (client === cl) {
                ClientMovement.up[key] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveDown, (client) => {
        clientsByEid.forEach((cl, key, map) => {
            if (client === cl) {
                ClientMovement.down[key] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveLeft, (client) => {
        clientsByEid.forEach((cl, key, map) => {
            if (client === cl) {
                ClientMovement.left[key] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveRight, (client) => {
        clientsByEid.forEach((cl, key, map) => {
            if (client === cl) {
                ClientMovement.right[key] = 1;
            }
        })
    });


    return defineSystem((ecsWorld: IWorld) => {
        // each loop reset all clientmovement components
        const queryMovements = movementQuery(ecsWorld);
        queryMovements.map(eid => {
            ClientMovement.up[eid] = 0;
            ClientMovement.down[eid] = 0;
            ClientMovement.left[eid] = 0;
            ClientMovement.right[eid] = 0;
        });

        return ecsWorld;
    })
}
