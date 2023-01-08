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

    const eventTextQuery = defineQuery([GuiText, GuiEvent]);
    const eventTextQueryEnter = enterQuery(eventTextQuery);

    let counter = 0;

    return defineSystem((world: IWorld) => {
        const enterRects = textQueryEnter(world);
        enterRects.map(eid => {
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

        // handle new event text
        const eventTexts = eventTextQueryEnter(world);
        eventTexts.map(eid => {
            switch(GuiEvent.type[eid]) {
                case GuiEventEnum.UPDATE_COUNTER: {
                    scene.events.on('create-pacman', () => {
                        textsById.get(eid)?.setText(`Counter: ${++counter}`); 
                    });
                    scene.events.on('create-ghost', () => {
                        textsById.get(eid)?.setText(`Counter: ${++counter}`);
                    });
                    break;
                }
                default: break;
            }
        });

        return world;
    });
}