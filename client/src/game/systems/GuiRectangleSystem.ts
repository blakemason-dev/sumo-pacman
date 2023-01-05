import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent
} from 'bitecs';
import { GuiParent } from '../components/GuiParent';

import { GuiRectangle } from '../components/GuiRectangle';
import { GuiTransform } from '../components/GuiTransform';

export const createGuiRectangleSystem = (scene: Phaser.Scene) => {
    const rectsById = new Map<number, Phaser.GameObjects.Rectangle>();
    const rectQuery = defineQuery([GuiRectangle, GuiTransform]);
    const rectQueryEnter = enterQuery(rectQuery);
    const rectQueryExit = exitQuery(rectQuery);

    return defineSystem((world: IWorld) => {
        const enterRects = rectQueryEnter(world);
        enterRects.map(eid => {
            // create a phaser rect
            console.log(GuiRectangle.color[eid])
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
            )
        });

        return world;
    });
}