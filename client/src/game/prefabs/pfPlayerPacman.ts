import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../libraries/AssetLibrary';

import { Image } from '../components/Image';
import { Transform } from '../components/Transform';
import { ClientInput } from '../components/ClientInput';
import { PlayerMovement } from '../components/PlayerMovement';

export const createPfPlayerPacman = (world: IWorld) => {
    const peid = addEntity(world);

    addComponent(world, Image, peid);
    Image.textureIndex[peid] = AssetLibrary.getIndex('pacman');
    Image.width[peid] = 32;
    Image.height[peid] = 32;

    addComponent(world, Transform, peid);
    Transform.position.x[peid] = 0;
    Transform.position.y[peid] = 0;

    addComponent(world, ClientInput, peid);

    addComponent(world, PlayerMovement, peid);
    PlayerMovement.speed[peid] = 2;

    return peid;
}
