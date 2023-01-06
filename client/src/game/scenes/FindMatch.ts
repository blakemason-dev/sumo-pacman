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
import { createGuiTransformSystem } from '../systems/GuiTransformSystem';
import { createGuiRectangleSystem } from '../systems/GuiRectangleSystem';
import { GuiText } from '../components/GuiText';
import { createGuiTextSystem } from '../systems/GuiTextSystem';
import { GuiInput } from '../components/GuiInput';

const textSlots = new Map<number, {text: string, style: {}}>();
// const textStyleSlots = new Map<number, {}>();

export class FindMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiTransformSystem!: System;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;

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

        // const findMatchButton = new GameButton(
        //     this,
        //     320, 180,
        //     180, 40, "FIND MATCH",
        //     () => {
        //         console.log("Clicked");
        //     }
        // )

        // create ECS world
        this.world = createWorld();

        // create an ECS Find Match button entity
        const buttonEid = addEntity(this.world);
        addComponent(this.world, GuiTransform, buttonEid);
        GuiTransform.position.x[buttonEid] = this.scale.width/2;
        GuiTransform.position.y[buttonEid] = this.scale.height/2;
        addComponent(this.world, GuiRectangle, buttonEid);
        GuiRectangle.width[buttonEid] = 200;
        GuiRectangle.height[buttonEid] = 100;
        GuiRectangle.color[buttonEid] = 0xff0000;
        GuiRectangle.alpha[buttonEid] = 1.0;
        GuiRectangle.origin.x[buttonEid] = 0.5;
        GuiRectangle.origin.y[buttonEid] = 0.5;
        addComponent(this.world, GuiText, buttonEid);
        textSlots.set(buttonEid, {
            text: "FIND MATCH",
            style: {
                fontFamily: "mono",
                fontSize: "16px",
                color: "#0000ff"
            }
        });
        GuiText.origin.x[buttonEid] = 0.5;
        GuiText.origin.y[buttonEid] = 0.5;
        addComponent(this.world, GuiInput, buttonEid);
        GuiInput.pointerDown[buttonEid] = 0;
        GuiInput.pointerReleased[buttonEid] = 0;

        // create the gui transform system
        this.guiTransformSystem = createGuiTransformSystem(this);
        this.guiRectangleSystem = createGuiRectangleSystem(this);
        this.guiTextSystem = createGuiTextSystem(this, textSlots);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.guiTransformSystem(this.world);
        this.guiRectangleSystem(this.world);
        this.guiTextSystem(this.world);
    }
}