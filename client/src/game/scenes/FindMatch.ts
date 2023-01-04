import Phaser from 'phaser';
import { GameButton } from '../shared/GameButton';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld
} from 'bitecs';
import { GuiTransform } from '../components/GuiTransform';
import { GuiRectangle } from '../components/GuiRectangle';
import { GuiParent } from '../components/GuiParent';
import { createGuiTransformSystem } from '../systems/GuiTransformSystem';
import { createGuiRectangleSystem } from '../systems/GuiRectangleSystem';

export class FindMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiTransformSystem!: System;
    private guiRectangleSystem!: System;

    constructor() {
        super("find-match");
    }

    init() {
        console.log('init()');
    }

    preload() {
        console.log('preload()');
    }

    create() {
        console.log('create()');

        const redRing = this.add.circle(320,180, 160, 0x222222, 1);
        redRing.setStrokeStyle(3, 0xff0000);

        const findMatchButton = new GameButton(
            this,
            320, 180,
            180, 40, "FIND MATCH",
            () => {
                console.log("Clicked");
            }
        )

        // create ECS world
        this.world = createWorld();

        // create an ECS Find Match button entity
        const buttonEid = addEntity(this.world);
        addComponent(this.world, GuiTransform, buttonEid);
        GuiTransform.position.x[buttonEid] = 320;
        GuiTransform.position.y[buttonEid] = 200;

        // create an entity with rectangle component and assign button as its parent
        const rectEid = addEntity(this.world);
        addComponent(this.world, GuiTransform, rectEid);
        GuiTransform.origin.x[rectEid] = 0.5;
        GuiTransform.origin.y[rectEid] = 0.5;
        addComponent(this.world, GuiRectangle, rectEid);
        GuiRectangle.width[rectEid] = 200;
        GuiRectangle.height[rectEid] = 100;
        addComponent(this.world, GuiParent, rectEid);
        GuiParent.eid[rectEid] = buttonEid;

        // create the gui transform system
        this.guiTransformSystem = createGuiTransformSystem(this);
        this.guiRectangleSystem = createGuiRectangleSystem(this);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.guiTransformSystem(this.world);
        this.guiRectangleSystem(this.world);
    }
}