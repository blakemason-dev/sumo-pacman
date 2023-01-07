import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../assets/index';

import { Image } from '../components/Image';
import { Transform } from '../components/Transform';

export const createPacmanPrefabEntity = (world: IWorld) => {
    const peid = addEntity(world);

    addComponent(world, Image, peid);
    Image.texture[peid] = AssetLibrary.getIndex('pacman');
    Image.width[peid] = 32;
    Image.height[peid] = 32;
    
    addComponent(world, Transform, peid);
    Transform.position.x[peid] = 0;
    Transform.position.y[peid] = 0;

    return peid;
}
