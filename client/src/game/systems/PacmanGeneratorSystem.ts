import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    addEntity,
    addComponent
} from 'bitecs';
import { PacmanGenerator } from '../components/PacmanGenerator';
import { Transform } from '../components/Transform';

import { createPacmanPrefabEntity } from '../prefabs/pfPacman';

export const createPacmanGeneratorSystem = (scene: Phaser.Scene) => {
    const pgQuery = defineQuery([PacmanGenerator]);
    const pgEnterQuery = enterQuery(pgQuery);

    return defineSystem((world: IWorld) => {
        const pgsEnter = pgEnterQuery(world);
        pgsEnter.map(eid => {
            if (!PacmanGenerator.limit[eid]) {
                PacmanGenerator.limit[eid] = 10;
            }

            // listen out for requests to create more pacmen
            scene.events.on('create-pacman', (num: number) => {
                for (let i = 0; i < num; i++) {
                    const peid = createPacmanPrefabEntity(world);
                    Transform.position.x[peid] = Math.random()*scene.scale.width;
                    Transform.position.y[peid] = Math.random()*scene.scale.height;
                }
            });
        });

        const pgs = pgQuery(world);
        pgs.map(eid => {

        });

        return world;
    })
}