import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent
} from 'bitecs';

import { GuiEvent, GuiEventEnum } from '../components/GuiEvent';
import { GuiRectangle } from '../components/GuiRectangle';
import { GuiTransform } from '../components/GuiTransform';

export const createGuiRectangleSystem = (scene: Phaser.Scene) => {
    const rectsById = new Map<number, Phaser.GameObjects.Rectangle>();

    // queries to position and initialise rectangles
    const rectQuery = defineQuery([GuiRectangle, GuiTransform]);
    const rectQueryEnter = enterQuery(rectQuery);
    const rectQueryExit = exitQuery(rectQuery);

    // queries for events attached to rectangles
    const rectEventQuery = defineQuery([GuiRectangle, GuiEvent]);
    const rectEventQueryEnter = enterQuery(rectEventQuery);

    // define the sytem
    return defineSystem((world: IWorld) => {
        // rectangle initialisation with a transform
        const enterRects = rectQueryEnter(world);
        enterRects.map(eid => {
            // create a phaser rect
            rectsById.set(eid, scene.add.rectangle(
                GuiTransform.position.x[eid],
                GuiTransform.position.y[eid],
                GuiRectangle.width[eid],
                GuiRectangle.height[eid],
                GuiRectangle.color[eid],
                GuiRectangle.alpha[eid]
            ));
            rectsById.get(eid)?.setOrigin(
                GuiRectangle.origin.x[eid],
                GuiRectangle.origin.y[eid]
            );
        });

        // initialisation of rectangles with sibling event compoments
        const enterEventRects = rectEventQueryEnter(world);
        enterEventRects.map(eid => {
            rectsById.get(eid)?.setInteractive();
            switch (GuiEvent.type[eid]) {
                case GuiEventEnum.CREATE_PACMAN: {
                    rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
                        scene.events.emit('create-pacman', 1);
                    });
                    break;
                }
                case GuiEventEnum.CREATE_GHOST: {
                    rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
                        scene.events.emit('create-ghost', 1);
                    });
                    break;
                }
                default: break;
            }
        });

        return world;
    });
}