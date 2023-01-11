import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    Changed
} from 'bitecs';

import { Image } from '../components/Image';
import { Transform } from '../components/Transform';

import * as AssetLibrary from '../libraries/AssetLibrary';

export const createImageSystem = (scene: Phaser.Scene) => {
    const imagesById = new Map<number, Phaser.GameObjects.Image>();
    const imageQuery = defineQuery([Transform, Image]);
    const imageQueryEnter = enterQuery(imageQuery);
    const imageQueryExit = exitQuery(imageQuery);

    const imageMovedQuery = defineQuery([Changed(Transform), Image]);

    return defineSystem((world: IWorld) => {
        const enterImages = imageQueryEnter(world);
        enterImages.map(eid => {
            imagesById.set(eid, scene.add.sprite(
                Transform.position.x[eid],
                Transform.position.y[eid],
                AssetLibrary.getKey(Image.textureIndex[eid])
            ));
            imagesById.get(eid)?.setDisplaySize(
                Image.width[eid],
                Image.height[eid]
            );
            imagesById.get(eid)?.setOrigin(
                Image.origin.x[eid],
                Image.origin.y[eid]
            )
        });

        const imagesMoved = imageMovedQuery(world);
        imagesMoved.map(eid => {
            imagesById.get(eid)?.setPosition(
                Transform.position.x[eid],
                Transform.position.y[eid]
            );
            imagesById.get(eid)?.setRotation(Transform.rotation[eid]);
        });

        const exitImages = imageQueryExit(world);
        exitImages.map(eid => {
            imagesById.get(eid)?.destroy();
            imagesById.delete(eid);
        });

        return world;
    })
}