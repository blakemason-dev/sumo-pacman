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
import { Message } from '../../types/messages';
import { ClientMovement } from '../components/ClientMovement';

export const createClientMessageSystem = (sumoPacman: SumoPacman, clientsByEid: Map<number, Client>) => {

    sumoPacman.onMessage(Message.ClientMoveUpBegin, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.up[eid] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveUpEnd, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.up[eid] = 0;
            }
        })
    });

    sumoPacman.onMessage(Message.ClientMoveDownBegin, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.down[eid] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveDownEnd, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.down[eid] = 0;
            }
        })
    });

    sumoPacman.onMessage(Message.ClientMoveLeftBegin, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.left[eid] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveLeftEnd, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.left[eid] = 0;
            }
        })
    });

    sumoPacman.onMessage(Message.ClientMoveRightBegin, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.right[eid] = 1;
            }
        })
    });
    sumoPacman.onMessage(Message.ClientMoveRightEnd, (client) => {
        clientsByEid.forEach((cl, eid, map) => {
            if (client === cl) {
                ClientMovement.right[eid] = 0;
            }
        })
    });


    return defineSystem((ecsWorld: IWorld) => {
        return ecsWorld;
    })
}
