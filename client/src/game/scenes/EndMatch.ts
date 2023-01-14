import Phaser from 'phaser';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld,
    deleteWorld,
    resetWorld,
    removeEntity,
    getEntityComponents,
    removeComponent
} from 'bitecs';

import { EventEmitter } from 'events';

import { GuiTransform } from '../components/gui/GuiTransform';
import { createGuiRectangleSystem } from '../systems/gui/GuiRectangleSystem';
import { createGuiTextSystem } from '../systems/gui/GuiTextSystem';

import * as AssetLibrary from '../libraries/AssetLibrary';
import * as TextLibrary from '../libraries/TextLibrary';

import { createPfGuiFindMatchButton } from '../prefabs/gui/pfGuiFindMatchButton';
import { BootStrap } from './BootStrap';
import { GuiText } from '../components/gui/GuiText';
import { GuiRectangle } from '../components/gui/GuiRectangle';

export class EndMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;

    private sceneText!: Phaser.GameObjects.Text;

    private bootStrap!: BootStrap;

    private switchScene = false;

    private eventEmitter!: EventEmitter;

    constructor() {
        super("end-match");
        console.log('EndMatch: constructor()');
    }

    init(data: any) {
        console.log('EndMatch: init()');

        this.bootStrap = data.bootStrap;
    }

    preload() {
        console.log('EndMatch: preload()');
    }

    create() {
        console.log('EndMatch: create()');

        this.eventEmitter = new EventEmitter();

        this.sceneText = this.add.text(
            this.scale.width*0.025,
            this.scale.width*0.025,
            "Scene: EndMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0,0);

        // create ECS world
        this.world = createWorld();

        // create find match button
        const eidFindNewMatchButton = createPfGuiFindMatchButton(this.world);
        GuiTransform.position.x[eidFindNewMatchButton] = this.scale.width*0.5;
        GuiTransform.position.y[eidFindNewMatchButton] = this.scale.height*0.5;
        GuiRectangle.width[eidFindNewMatchButton] = this.scale.width*0.33;
        GuiText.textIndex[eidFindNewMatchButton] = TextLibrary.getIndex('find-new-match');
        this.eventEmitter.on('GuiRectangle-POINTER_UP', (eid) => {
            if (eid === eidFindNewMatchButton) {
                this.sceneText.destroy();
                removeEntity(this.world, eidFindNewMatchButton);
                this.switchScene = true;
                this.eventEmitter.removeAllListeners();
            }
        });
        
        // create systems
        this.guiRectangleSystem = createGuiRectangleSystem(this, this.eventEmitter);
        this.guiTextSystem = createGuiTextSystem(this);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.guiRectangleSystem(this.world);
        this.guiTextSystem(this.world);

        // if we got a switchscene message at some stage, change scenes
        if (this.switchScene) {
            this.bootStrap.switch('end-match', 'search-match');
        }
    }
}