import {
    defineSystem,
    defineQuery,
    enterQuery,
    exitQuery,
    IWorld,
    hasComponent
} from 'bitecs';
import { EventEmitter } from 'events';
import { Scene } from 'phaser';

import { GuiEvent, GuiEventEnum } from '../../components/gui/GuiEvent';
import { GuiRectangle } from '../../components/gui/GuiRectangle';
import { GuiTransform } from '../../components/gui/GuiTransform';

export const createGuiRectangleSystem = (scene: Phaser.Scene, eventEmitter: EventEmitter) => {
    const rectsById = new Map<number, Phaser.GameObjects.Rectangle>();

    // queries to position and initialise rectangles
    const rectQuery = defineQuery([GuiRectangle, GuiTransform]);
    const rectQueryEnter = enterQuery(rectQuery);
    const rectQueryExit = exitQuery(rectQuery);

    // queries for events attached to rectangles
    // const rectEventQuery = defineQuery([GuiRectangle, GuiEvent]);
    // const rectEventQueryEnter = enterQuery(rectEventQuery);

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

            // set origin
            rectsById.get(eid)?.setOrigin(
                GuiRectangle.origin.x[eid],
                GuiRectangle.origin.y[eid]
            );
            
            // if interactive make an event emitter
            if (GuiRectangle.interactive[eid]) {
                rectsById.get(eid)?.setInteractive();
                rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
                    eventEmitter.emit('GuiRectangle-POINTER_UP', eid);
                    // scene.events.emit('GuiRectangle-POINTER_UP', eid);
                });
            }
        });

        // initialisation of rectangles with sibling event compoments
        // const enterEventRects = rectEventQueryEnter(world);
        // enterEventRects.map(eid => {
        //     if (GuiRectangle.interactive[eid]) {
        //         rectsById.get(eid)?.setInteractive();
        //         rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
        //             scene.events.emit('GuiRectangle-POINTER_UP', eid);
        //         });
        //     }

            // rectsById.get(eid)?.setInteractive();
            // switch (GuiEvent.type[eid]) {
            //     case GuiEventEnum.CREATE_PACMAN: {
            //         rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
            //             scene.events.emit('create-pacman', 1);
            //         });
            //         break;
            //     }
            //     case GuiEventEnum.CREATE_GHOST: {
            //         rectsById.get(eid)?.on(Phaser.Input.Events.POINTER_UP, () => {
            //             scene.events.emit('create-ghost', 1);
            //         });
            //         break;
            //     }
            //     default: break;
            // }
        // });

        return world;
    });
}