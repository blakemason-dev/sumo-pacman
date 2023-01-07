import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent
} from 'bitecs';

import { GuiText, TextLibrary } from '../components/GuiText';
import { GuiTransform } from '../components/GuiTransform';

export const createGuiTextSystem = (scene: Phaser.Scene) => {
    const textsById = new Map<number, Phaser.GameObjects.Text>();
    const textQuery = defineQuery([GuiText, GuiTransform]);
    const textQueryEnter = enterQuery(textQuery);
    const textQueryExit = exitQuery(textQuery);

    return defineSystem((world: IWorld) => {
        const enterRects = textQueryEnter(world);
        enterRects.map(eid => {
            // create phaser text
            const text = TextLibrary.get(eid)?.text;
            const style = TextLibrary.get(eid)?.style;
            textsById.set(eid, scene.add.text(
                GuiTransform.position.x[eid],
                GuiTransform.position.y[eid],
                text ? text : "",
                style
            ));
            textsById.get(eid)?.setOrigin(
                GuiText.origin.x[eid],
                GuiText.origin.y[eid]
            )
        });

        return world;
    });
}