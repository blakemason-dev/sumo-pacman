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

export class PlayMatch extends Phaser.Scene {
    private world!: IWorld;
    private systems: System[] = [];
    private bootStrap!: BootStrap;
    private eventEmitter!: EventEmitter;
    private clientInputSystem!: ClientInputSystem;

    private switchScene = false;

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

        this.eventEmitter = new EventEmitter();

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

        const redRing = this.add.circle(320, 180, 160, 0x222222, 1);
        redRing.setStrokeStyle(3, 0xff0000);

        // create ECS world
        this.world = createWorld();

        // create two server controlled pacmen
        const eidPlayerA = createPfServerPacman(this.world, 0, serverGameConfig);
        const eidPlayerB = createPfServerPacman(this.world, 1, serverGameConfig);
        
        // 1) Process server messages
        this.systems.push(await createServerMessageSystem(this, this.bootStrap.server));

        // 2) Process client inputs
        this.clientInputSystem = new ClientInputSystem(this, this.bootStrap.server);
        this.clientInputSystem.startListening();

        // 3) Update visuals
        // 3a) Interpolate entities
        // 3b) Update game visuals
        // 3c) Update UI

        this.systems.push(createImageSystem(this));
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

        // if time to switch scene, do it
        if (this.switchScene) {
            this.bootStrap.switch('play-match', 'end-match');
        }
    }
}