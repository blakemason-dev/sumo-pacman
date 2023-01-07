import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent
} from 'bitecs';
import { GuiEvent } from '../components/GuiEvent';


import { GuiInput } from '../components/GuiInput';

import { GuiRectangle } from '../components/GuiRectangle';
import { GuiTransform } from '../components/GuiTransform';

export const createGuiRectangleSystem = (scene: Phaser.Scene) => {
    const rectsById = new Map<number, Phaser.GameObjects.Rectangle>();
    const rectQuery = defineQuery([GuiRectangle, GuiTransform]);
    const rectQueryEnter = enterQuery(rectQuery);
    const rectQueryExit = exitQuery(rectQuery);

    // handle rectangle and event pointer up cases
    const rectEventQuery = defineQuery([GuiRectangle, GuiEvent]);
    const rectEventQueryEnter = enterQuery(rectEventQuery);

    return defineSystem((world: IWorld) => {
        // handle rectangle and transform cases
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

        
        const eventEntities = rectEventQueryEnter(world);
        eventEntities.map(eid => {
            console.log('check');
            rectsById.get(eid)?.setInteractive();
            switch (GuiEvent.type[eid]) {
                case 0: {
                    rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
                        scene.events.emit('create-pacman', 1);
                    });
                    break;
                }
                case 1: {
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