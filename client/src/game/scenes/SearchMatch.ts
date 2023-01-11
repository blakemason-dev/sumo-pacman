import Phaser from 'phaser';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld,
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

export class SearchMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;

    private counter = 1000;
    private counterText!: Phaser.GameObjects.Text;

    constructor() {
        super("search-match");
    }

    init() {
        // console.log('init()');
    }

    preload() {
        // console.log('preload()');

        // load all assets in library
        // AssetLibrary.loadAll(this);
    }

    create() {
        // console.log('create()');
        this.add.text(
            this.scale.width*0.025,
            this.scale.width*0.025,
            "Scene: SearchMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0,0);

        // create searching text
        this.counterText = this.add.text(
            this.scale.width*0.5,
            this.scale.height*0.5,
            "Searching: 3.0",
            {
                fontFamily: 'arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5,0.5);
    }

    update(t: number, dt: number) {
        this.counter -= dt;
        this.counterText.text = "Searching: " + (this.counter*0.001).toFixed(1);

        if (this.counter < 0) {
            this.counter = 1000;
            this.scene.start('play-match');
        }
    }
}