import Phaser from 'phaser';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld
} from 'bitecs';

import { GuiTransform } from '../components/GuiTransform';
import { GuiRectangle } from '../components/GuiRectangle';
import { createGuiRectangleSystem } from '../systems/GuiRectangleSystem';
import { GuiText } from '../components/GuiText';
import { createGuiTextSystem } from '../systems/GuiTextSystem';
import { GuiInput } from '../components/GuiInput';
import { PacmanGenerator } from '../components/PacmanGenerator';
import { createPacmanGeneratorSystem } from '../systems/PacmanGeneratorSystem';
import { createImageSystem } from '../systems/ImageSystem';

import * as AssetLibrary from '../assets/index';
import { GhostGenerator } from '../components/GhostGenerator';
import { createGuiButtonPrefabEntity } from '../prefabs/pfGuiButton';
import { createGhostGeneratorSystem } from '../systems/GhostGeneratorSystem';
import { GuiEvent } from '../components/GuiEvent';

export class FindMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiTransformSystem!: System;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;
    private pacmanGeneratorSystem!: System;
    private ghostGeneratorSystem!: System;
    private imageSystem!: System;

    constructor() {
        super("find-match");
    }

    init() {
        console.log('init()');
    }

    preload() {
        console.log('preload()');

        // load all assets in library
        AssetLibrary.library.map(asset => {
            switch (asset.type) {
                case 'IMAGE': {
                    this.load.image(asset.key, asset.src);
                    break;
                }
                default: {
                    break;
                }
            }
        })
    }

    create() {
        console.log('create()');

        const redRing = this.add.circle(320,180, 160, 0x222222, 1);
        redRing.setStrokeStyle(3, 0xff0000);

        // create ECS world
        this.world = createWorld();

        // create pacman generator button entity
        const eidPacmanButton = createGuiButtonPrefabEntity(this.world, "Generate Pacman");
        GuiTransform.position.x[eidPacmanButton] = this.scale.width*0.15;
        GuiTransform.position.y[eidPacmanButton] = this.scale.height*0.75;
        GuiEvent.type[eidPacmanButton] = 0;

        // create ghost generator button entity
        const eidGhostButton = createGuiButtonPrefabEntity(this.world, "Generate Ghost");
        GuiTransform.position.x[eidGhostButton] = this.scale.width*0.85;
        GuiTransform.position.y[eidGhostButton] = this.scale.height*0.75;
        GuiEvent.type[eidGhostButton] = 1;
        
        // make a pacman generator entity
        const eidPacmanGenerator = addEntity(this.world);
        addComponent(this.world, PacmanGenerator, eidPacmanGenerator);
        
        // make a ghost generator entity
        const eidGhostGenerator = addEntity(this.world);
        addComponent(this.world, GhostGenerator, eidGhostGenerator);
        
        // create systems
        this.pacmanGeneratorSystem = createPacmanGeneratorSystem(this);
        this.ghostGeneratorSystem = createGhostGeneratorSystem(this);
        this.guiRectangleSystem = createGuiRectangleSystem(this);
        this.guiTextSystem = createGuiTextSystem(this);
        this.imageSystem = createImageSystem(this);
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.pacmanGeneratorSystem(this.world);
        this.ghostGeneratorSystem(this.world);
        this.guiRectangleSystem(this.world);
        this.guiTextSystem(this.world);
        this.imageSystem(this.world);
    }
}