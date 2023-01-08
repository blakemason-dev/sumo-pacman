import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld
} from 'bitecs';
import { EventEmitter } from 'events';
import { ClientInput } from '../components/ClientInput';

import { Image } from '../components/Image';
import { PlayerMovement } from '../components/PlayerMovement';
import { RingOutCheck } from '../components/RingOutCheck';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

export const createRingOutCheckSystem = (scene: Phaser.Scene, eventEmitter: EventEmitter) => {
    // const imagesById = new Map<number, Phaser.GameObjects.Image>();
    const rocQuery = defineQuery([RingOutCheck, Transform]);
    const rocQueryEnter = enterQuery(rocQuery);
    const rocQueryExit = exitQuery(rocQuery);

    return defineSystem((world: IWorld) => {
        const rocs = rocQuery(world);
        rocs.map(eid => {
            let center = {
                x: scene.scale.width * 0.5,
                y: scene.scale.height * 0.5
            }
            let position = {
                x: Transform.position.x[eid],
                y: Transform.position.y[eid]
            }
            let distance = Math.sqrt((center.x - position.x)**2 + (center.y - position.y)**2);
            if (distance > 160) {
                eventEmitter.emit('RingOutCheck-ENTITY_OUT', eid);
                console.log('OUTSIDE!!!');
            }
        });

        return world;
    })
}