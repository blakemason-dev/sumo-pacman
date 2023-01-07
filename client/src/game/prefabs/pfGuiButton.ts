import {
    addEntity,
    addComponent,
    IWorld
} from 'bitecs';

import * as AssetLibrary from '../assets/index';

import { GuiRectangle } from '../components/GuiRectangle';
import { GuiTransform } from '../components/GuiTransform';
import { GuiText, TextLibrary } from '../components/GuiText';
import { GuiEvent } from '../components/GuiEvent';

export const createGuiButtonPrefabEntity = (world: IWorld, text: string) => {
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
    TextLibrary.set(eid, {
        text: text,
        style: {
            fontFamily: "arial",
            fontSize: "14px",
            color: "#0000ff"
        }
    });
    GuiText.origin.x[eid] = 0.5;
    GuiText.origin.y[eid] = 0.5;

    addComponent(world, GuiEvent, eid);

    console.log('created button');

    return eid;
}
