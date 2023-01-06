import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent
} from 'bitecs';
import { GuiInput } from '../components/GuiInput';

import { GuiRectangle } from '../components/GuiRectangle';
import { GuiTransform } from '../components/GuiTransform';

export const createGuiRectangleSystem = (scene: Phaser.Scene) => {
    const rectsById = new Map<number, Phaser.GameObjects.Rectangle>();
    const rectQuery = defineQuery([GuiRectangle, GuiTransform]);
    const rectQueryEnter = enterQuery(rectQuery);
    const rectQueryExit = exitQuery(rectQuery);

    const rectInputQuery = defineQuery([GuiRectangle, GuiInput]);
    const rectInputQueryEnter = enterQuery(rectInputQuery);

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

        // handle rectangle and input cases
        const enterRectInputs = rectInputQueryEnter(world);
        enterRectInputs.map(eid => {
            rectsById.get(eid)?.setInteractive();
            rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
                GuiInput.pointerReleased[eid] = 1;
            });
        });

        const rectInputs = rectInputQuery(world);
        rectInputs.map(eid => {
            if (GuiInput.pointerReleased[eid] === 1) {
                console.log('button clicked');
                GuiInput.pointerReleased[eid] = 0;
            }
        });

        return world;
    });
}