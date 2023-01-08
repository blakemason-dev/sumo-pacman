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
            let velocity = {
                x: 0, y: 0
            }
            if (ClientInput.w_key_down[eid]) {
                // Transform.position.y[eid] -= PlayerMovement.speed[eid];
                velocity.y = -1;
            }
            if (ClientInput.a_key_down[eid]) {
                // Transform.position.x[eid] -= PlayerMovement.speed[eid];
                velocity.x = -1;
            }
            if (ClientInput.s_key_down[eid]) {
                // Transform.position.y[eid] += PlayerMovement.speed[eid];
                velocity.y = 1;
            }
            if (ClientInput.d_key_down[eid]) {
                // Transform.position.x[eid] += PlayerMovement.speed[eid];
                velocity.x = 1;
            }

            const length = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            if (length > 0) {
                velocity.x /= length;
                velocity.y /= length;
                const angle = Math.atan2(velocity.y, velocity.x);

                Transform.position.x[eid] += velocity.x * PlayerMovement.speed[eid];
                Transform.position.y[eid] += velocity.y * PlayerMovement.speed[eid];
                Transform.rotation[eid] = angle;
            }
        });

        return world;
    })
}