import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    addEntity,
    addComponent
} from 'bitecs';
import { GhostGenerator } from '../components/GhostGenerator';

import { Transform } from '../components/Transform';
import { createGhostPrefabEntity } from '../prefabs/pfGhost';

export const createGhostGeneratorSystem = (scene: Phaser.Scene) => {
    const ggQuery = defineQuery([GhostGenerator]);
    const ggEnterQuery = enterQuery(ggQuery);

    return defineSystem((world: IWorld) => {
        const ggsEnter = ggEnterQuery(world);
        ggsEnter.map(eid => {
            // listen out for requests to create more pacmen
            scene.events.on('create-ghost', (num: number) => {
                for (let i = 0; i < num; i++) {
                    const peid = createGhostPrefabEntity(world, Math.floor(Math.random()*3));
                    Transform.position.x[peid] = Math.random()*scene.scale.width;
                    Transform.position.y[peid] = Math.random()*scene.scale.height;
                }
            });
        });

        return world;
    })
}