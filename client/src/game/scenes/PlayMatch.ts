import Phaser from 'phaser';

import {
    createWorld,
    addEntity,
    addComponent,
    System,
    IWorld,
    deleteWorld,
    resetWorld,
    removeEntity
} from 'bitecs';

import { EventEmitter } from 'events';

import { createImageSystem } from '../systems/ImageSystem';

import { BootStrap } from './BootStrap';
import { createPfServerPacman } from '../prefabs/network/pfServerPacman';
import { ClientInputSystem } from '../services/ClientInputSystem';
import { createServerMessageSystem } from '../systems/network/ServerMessageSystem';

import * as ConvertServer from '../utilities/ConvertServer';
import { NameTag } from '../components/NameTag';
import { createNameTagSystem } from '../systems/NameTagSystem';

export class PlayMatch extends Phaser.Scene {
    private world!: IWorld;
    private systems: System[] = [];
    private bootStrap!: BootStrap;
    private clientInputSystem!: ClientInputSystem;

    private ring!: Phaser.GameObjects.Arc;
    private serverGameConfig!: any;

    private switchScene = false;
    private victory = false;

    constructor() {
        super("play-match");
        console.log('PlayMatch: constructor()');
    }

    init(data: any) {
        console.log('PlayMatch: init()');

        this.bootStrap = data.bootStrap;
    }

    preload() {
        console.log('PlayMatch: preload()');
    }

    async create(serverGameConfig: any) {
        console.log('PlayMatch: create()');

        this.serverGameConfig = serverGameConfig;

        this.add.text(
            this.scale.width * 0.025,
            this.scale.width * 0.025,
            "Scene: PlayMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0, 0);

        this.ring = this.add.circle(this.scale.width/2, this.scale.height/2, 160, 0x333333, 1);
        this.ring.setStrokeStyle(3, 0xff0000);

        // create ECS world
        this.world = createWorld();

        // create two server controlled pacmen
        const eidPlayerA = createPfServerPacman(this.world, 0, serverGameConfig);
        const eidPlayerB = createPfServerPacman(this.world, 1, serverGameConfig);
        
        // add a name tag to this clients entity
        if (this.bootStrap.server.pacmanIndex === 0) {
            addComponent(this.world, NameTag, eidPlayerA);
        } else {
            addComponent(this.world, NameTag, eidPlayerB);
        }

        // 1) Process server messages
        this.systems.push(createServerMessageSystem(this, this.bootStrap.server));

        // 2) Process client inputs
        this.clientInputSystem = new ClientInputSystem(this, this.bootStrap.server);
        this.clientInputSystem.startListening();

        // 3) Update visuals
        // 3a) Interpolate entities
        // 3b) Update game visuals
        // 3c) Update UI

        this.systems.push(createImageSystem(this));
        this.systems.push(createNameTagSystem(this));

        // listen for a victory/defeat
        this.bootStrap.server.eventEmitter.on('game-over', (data) => {
            console.log(data);
            this.victory = data.victory;
            this.switchScene = true;
        });
    }

    update(t: number, dt: number) {
        if (!this.world) return;

        // 1) Process server messages

        // 2) Process client inputs

        // 3) Update visuals
        // 3a) Interpolate entities
        // 3b) Update game visuals
        // 3c) Update UI

        // run systems
        this.systems.map(system => {
            system(this.world);
        });

        // update ring size
        const radius = this.bootStrap.server.room?.state.ringRadius;
        if (radius) {
            this.ring.setRadius(ConvertServer.dimToPhaser(
                radius,
                this.serverGameConfig,
                this.scale
            ));
        }


        // if time to switch scene, do it
        if (this.switchScene) {
            console.log(this.victory);
            this.bootStrap.switch('play-match', 'end-match', { victory: this.victory });
        }
    }
}