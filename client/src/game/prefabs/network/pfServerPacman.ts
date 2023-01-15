import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../../libraries/AssetLibrary';

import { Image } from '../../components/Image';
import { Transform } from '../../components/Transform';
import { ServerPacmanController } from '../../components/network/ServerPacmanController';
import { ServerMessageReceiver } from '../../components/network/ServerMessageReceiver';

export const createPfServerPacman = (world: IWorld, serverIndex: number) => {
    const peid = addEntity(world);

    addComponent(world, Image, peid);
    Image.textureIndex[peid] = AssetLibrary.getIndex('pacman');
    Image.width[peid] = 32;
    Image.height[peid] = 32;

    addComponent(world, Transform, peid);
    Transform.position.x[peid] = 0;
    Transform.position.y[peid] = 0;

    addComponent(world, ServerPacmanController, peid);
    ServerPacmanController.serverIndex[peid] = serverIndex;

    addComponent(world, ServerMessageReceiver, peid);

    return peid;
}
