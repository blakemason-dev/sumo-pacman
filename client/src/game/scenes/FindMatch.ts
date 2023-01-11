import Phaser from 'phaser';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld,
    deleteWorld,
    resetWorld
} from 'bitecs';

import { EventEmitter } from 'events';

import { GuiTransform } from '../components/gui/GuiTransform';
import { createGuiRectangleSystem } from '../systems/gui/GuiRectangleSystem';
import { createGuiTextSystem } from '../systems/gui/GuiTextSystem';
import { PacmanGenerator } from '../components/PacmanGenerator';
import { createPacmanGeneratorSystem } from '../systems/PacmanGeneratorSystem';
import { createImageSystem } from '../systems/ImageSystem';

import * as AssetLibrary from '../libraries/AssetLibrary';
import { GhostGenerator } from '../components/GhostGenerator';
import { createGuiButtonPrefabEntity } from '../prefabs/gui/pfGuiButton';
import { createGhostGeneratorSystem } from '../systems/GhostGeneratorSystem';
import { GuiEvent, GuiEventEnum } from '../components/gui/GuiEvent';
import { GuiText } from '../components/gui/GuiText';
import { createGuiCounterPrefabEntity } from '../prefabs/gui/pfGuiCounter';
import { createPfGuiFindMatchButton } from '../prefabs/gui/pfGuiFindMatchButton';

const eventEmitter = new EventEmitter();

export class FindMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;

    constructor() {
        super("find-match");
        console.log('constructor()');
    }

    init() {
        console.log('init()');
        console.log(this.world);
    }

    preload() {
        console.log('preload()');

        // load all assets in library
        AssetLibrary.loadAll(this);
    }

    create() {
        console.log('create()');
        this.add.text(
            this.scale.width*0.025,
            this.scale.width*0.025,
            "Scene: FindMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0,0);

        // create ECS world
        this.world = createWorld();

        // create find match button
        const eidFindMatchButton = createPfGuiFindMatchButton(this.world);
        GuiTransform.position.x[eidFindMatchButton] = this.scale.width*0.5;
        GuiTransform.position.y[eidFindMatchButton] = this.scale.height*0.5;
        eventEmitter.on('GuiRectangle-POINTER_UP', (eid) => {
            if (eid === eidFindMatchButton) {
                resetWorld(this.world);
                this.scene.start('search-match');
            }
        });
        
        // create systems
        this.guiRectangleSystem = createGuiRectangleSystem(this, eventEmitter);
        this.guiTextSystem = createGuiTextSystem(this);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.guiRectangleSystem(this.world);
        this.guiTextSystem(this.world);
    }
}