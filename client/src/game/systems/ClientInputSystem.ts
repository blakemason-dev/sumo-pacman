import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld
} from 'bitecs';
import { ClientInput } from '../components/ClientInput';

import { Image } from '../components/Image';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

export const createClientInputSystem = (scene: Phaser.Scene) => {
    // const imagesById = new Map<number, Phaser.GameObjects.Image>();
    const inputQuery = defineQuery([ClientInput]);
    const inputQueryEnter = enterQuery(inputQuery);
    const inputQueryExit = exitQuery(inputQuery);

    const W_KEY = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const A_KEY = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const S_KEY = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const D_KEY = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    return defineSystem((world: IWorld) => {
        const inputs = inputQuery(world);
        inputs.map(eid => {
            ClientInput.w_key_down[eid] = 0;
            ClientInput.a_key_down[eid] = 0;
            ClientInput.s_key_down[eid] = 0;
            ClientInput.d_key_down[eid] = 0;

            if (scene.input.keyboard.checkDown(W_KEY)) {
                ClientInput.w_key_down[eid] = 1;
            }
            if (scene.input.keyboard.checkDown(A_KEY)) {
                ClientInput.a_key_down[eid] = 1;
            }
            if (scene.input.keyboard.checkDown(S_KEY)) {
                ClientInput.s_key_down[eid] = 1;
            }
            if (scene.input.keyboard.checkDown(D_KEY)) {
                ClientInput.d_key_down[eid] = 1;
            }
        });

        return world;
    })
}