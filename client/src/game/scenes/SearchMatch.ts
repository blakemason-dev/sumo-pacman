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
import { BootStrap } from './BootStrap';

const eventEmitter = new EventEmitter();

export class SearchMatch extends Phaser.Scene {
    private world!: IWorld;
    private guiRectangleSystem!: System;
    private guiTextSystem!: System;

    private counter = 300;
    private counterText!: Phaser.GameObjects.Text;

    private sceneText!: Phaser.GameObjects.Text;

    private switchScene = false;

    private bootStrap!: BootStrap;

    constructor() {
        super("search-match");
        console.log('SearchMatch: constructor()');
    }

    init(data: any) {
        console.log('SearchMatch: init()');

        this.bootStrap = data.bootStrap;
    }

    preload() {
        console.log('SearchMatch: preload()');
    }

    create() {
        console.log('SearchMatch: create()');

        this.sceneText = this.add.text(
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
            "Searching",
            {
                fontFamily: 'arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5,0.5);

        // try join the server i.e. find a match
        this.bootStrap.server.join();

        // once we get a match started message, we can switch scenes
        this.bootStrap.server.eventEmitter.on('start-match', (gameConfig) => {
            console.log('SearchMath: Starting Match')
            this.bootStrap.switch('search-match', 'play-match', gameConfig);
        });
    }
}