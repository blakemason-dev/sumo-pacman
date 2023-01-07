import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import { GuiTransform } from '../components/GuiTransform';
import { GuiText } from '../components/GuiText';
import { GuiEvent } from '../components/GuiEvent';

import * as TextLibrary from '../libraries/TextLibrary';

export const createGuiCounterPrefabEntity = (world: IWorld, text: string) => {
    const eid = addEntity(world);

    addComponent(world, GuiTransform, eid);

    addComponent(world, GuiText, eid);
    GuiText.textIndex[eid] = TextLibrary.getIndex('counter');
    GuiText.origin.x[eid] = 0.5;
    GuiText.origin.y[eid] = 0.5;

    addComponent(world, GuiEvent, eid);

    return eid;
}
