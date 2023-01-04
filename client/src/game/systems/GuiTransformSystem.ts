import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld
} from 'bitecs';

import { GuiTransform } from '../components/GuiTransform';

export const createGuiTransformSystem = (scene: Phaser.Scene) => {
    const transformQuery = defineQuery([GuiTransform]);
    const transformQueryEnter = enterQuery(transformQuery);
    const transformQueryExit = exitQuery(transformQuery);

    return defineSystem((world: IWorld) => {
        const enterTransforms = transformQueryEnter(world);
        enterTransforms.map(eid => {
            console.log('Entity: ', eid, 'has transform');
        });

        return world;
    })
}