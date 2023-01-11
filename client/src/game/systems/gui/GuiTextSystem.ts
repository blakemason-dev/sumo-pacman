import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
} from 'bitecs';
import { GuiEvent, GuiEventEnum } from '../../components/gui/GuiEvent';

import { GuiText } from '../../components/gui/GuiText';
import { GuiTransform } from '../../components/gui/GuiTransform';

import * as TextLibrary from '../../libraries/TextLibrary';

export const createGuiTextSystem = (scene: Phaser.Scene) => {
    const textsById = new Map<number, Phaser.GameObjects.Text>();
    const textQuery = defineQuery([GuiText, GuiTransform]);
    const textQueryEnter = enterQuery(textQuery);
    const textQueryExit = exitQuery(textQuery);

    let counter = 0;

    return defineSystem((world: IWorld) => {
        const enterTexts = textQueryEnter(world);
        enterTexts.map(eid => {
            // create phaser text
            const text = TextLibrary.library[GuiText.textIndex[eid]].text;
            const style = TextLibrary.library[GuiText.textIndex[eid]].style;
            textsById.set(eid, scene.add.text(
                GuiTransform.position.x[eid],
                GuiTransform.position.y[eid],
                text,
                style
            ));
            textsById.get(eid)?.setOrigin(
                GuiText.origin.x[eid],
                GuiText.origin.y[eid]
            )
        });

        const exitTexts = textQueryExit(world);
        exitTexts.map(eid => {
            textsById.get(eid)?.destroy();
            textsById.delete(eid);
        });

        return world;
    });
}