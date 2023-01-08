import Phaser from 'phaser';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld
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
import { createPfPlayerPacman } from '../prefabs/pfPlayerPacman';
import { createClientInputSystem } from '../systems/ClientInputSystem';
import { createPlayerMovementSystem } from '../systems/PlayerMovementSystem';
import { Transform } from '../components/Transform';

const eventEmitter = new EventEmitter();

export class PlayMatch extends Phaser.Scene {
    private world!: IWorld;
    // private imageSystem!: System;
    // private guiTextSystem!: System;
    private systems: System[] = [];

    constructor() {
        super("play-match");
    }

    init() {
        console.log('init()');
    }

    preload() {
        console.log('preload()');

        // load all assets in library
        // AssetLibrary.loadAll(this);
    }

    create() {
        console.log('create()');
        this.add.text(
            this.scale.width*0.025,
            this.scale.width*0.025,
            "Scene: PlayMatch",
            {
                fontFamily: 'arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0,0);

        const redRing = this.add.circle(320,180, 160, 0x222222, 1);
        redRing.setStrokeStyle(3, 0xff0000);

        // create ECS world
        this.world = createWorld();

        // create find match button
        const eidPlayer = createPfPlayerPacman(this.world);
        Transform.position.x[eidPlayer] = this.scale.width*0.5;
        Transform.position.y[eidPlayer] = this.scale.height*0.5;
        
        // create systems
        this.systems.push(createClientInputSystem(this));
        this.systems.push(createImageSystem(this));
        this.systems.push(createPlayerMovementSystem(this));
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        })
    }
}