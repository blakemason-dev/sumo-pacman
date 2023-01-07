import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import { GuiRectangle } from '../components/GuiRectangle';
import { GuiTransform } from '../components/GuiTransform';
import { GuiText } from '../components/GuiText';
import { GuiEvent } from '../components/GuiEvent';

import * as TextLibrary from '../libraries/TextLibrary';

export const createGuiButtonPrefabEntity = (world: IWorld, textLibraryKey: string) => {
    const eid = addEntity(world);

    addComponent(world, GuiTransform, eid);

    addComponent(world, GuiRectangle, eid);
    GuiRectangle.width[eid] = 128;
    GuiRectangle.height[eid] = 40;
    GuiRectangle.color[eid] = 0xdddddd;
    GuiRectangle.alpha[eid] = 1.0;
    GuiRectangle.origin.x[eid] = 0.5;
    GuiRectangle.origin.y[eid] = 0.5;

    addComponent(world, GuiText, eid);
    GuiText.textIndex[eid] = TextLibrary.getIndex(textLibraryKey);
    GuiText.origin.x[eid] = 0.5;
    GuiText.origin.y[eid] = 0.5;

    addComponent(world, GuiEvent, eid);

    console.log('created button');

    return eid;
}
