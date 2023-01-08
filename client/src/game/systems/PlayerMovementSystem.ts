import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld
} from 'bitecs';
import { ClientInput } from '../components/ClientInput';

import { Image } from '../components/Image';
import { PlayerMovement } from '../components/PlayerMovement';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

export const createPlayerMovementSystem = (scene: Phaser.Scene) => {
    // const imagesById = new Map<number, Phaser.GameObjects.Image>();
    const movementQuery = defineQuery([ClientInput, PlayerMovement, Transform]);
    const movementQueryEnter = enterQuery(movementQuery);
    const movementQueryExit = exitQuery(movementQuery);

    return defineSystem((world: IWorld) => {
        const movements = movementQuery(world);
        movements.map(eid => {
            if (ClientInput.w_key_down[eid]) {
                Transform.position.y[eid] -= PlayerMovement.speed[eid];
            }
            if (ClientInput.a_key_down[eid]) {
                Transform.position.x[eid] -= PlayerMovement.speed[eid];
            }
            if (ClientInput.s_key_down[eid]) {
                Transform.position.y[eid] += PlayerMovement.speed[eid];
            }
            if (ClientInput.d_key_down[eid]) {
                Transform.position.x[eid] += PlayerMovement.speed[eid];
            }
        });

        return world;
    })
}