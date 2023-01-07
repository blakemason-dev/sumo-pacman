import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../assets/index';

import { Image } from '../components/Image';
import { Transform } from '../components/Transform';

export const createGhostPrefabEntity = (world: IWorld, color: number) => {
    const peid = addEntity(world);

    addComponent(world, Image, peid);
    switch (color) {
        case 0: Image.texture[peid] = AssetLibrary.getIndex('red-ghost'); break;
        case 1: Image.texture[peid] = AssetLibrary.getIndex('yellow-ghost'); break;
        case 2: Image.texture[peid] = AssetLibrary.getIndex('pink-ghost'); break;
        default: break;
    }
    Image.width[peid] = 32;
    Image.height[peid] = 32;
    
    addComponent(world, Transform, peid);
    Transform.position.x[peid] = 0;
    Transform.position.y[peid] = 0;

    return peid;
}
