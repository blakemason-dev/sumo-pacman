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


import { createPfPlayerPacman } from '../prefabs/pfPlayerPacman';
import { createClientInputSystem } from '../systems/ClientInputSystem';
import { createPlayerMovementSystem } from '../systems/PlayerMovementSystem';
import { Transform } from '../components/Transform';
import { createRingOutCheckSystem } from '../systems/RingOutCheckSystem';
import { BootStrap } from './BootStrap';
import { ClientInput } from '../components/ClientInput';
import { createServerMessageSystem } from '../systems/network/ServerMessageSystem';
import { ServerMessageSender } from '../components/network/ServerMessageSender';
import { createPfServerPacman } from '../prefabs/network/pfServerPacman';

export class PlayMatch extends Phaser.Scene {
    private world!: IWorld;
    private systems: System[] = [];
    private bootStrap!: BootStrap;
    private eventEmitter!: EventEmitter;

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
            this.scale.width*0.025,
            this.scale.width*0.025,
            "Scene: PlayMatch",
            {
                fontFamily: 'arial',
                fontSize: '20px',
                color: '#ffffff'
            }
        ).setOrigin(0,0);

        const redRing = this.add.circle(320,180, 160, 0x222222, 1);
        redRing.setStrokeStyle(3, 0xff0000);

        // create ECS world
        this.world = createWorld();

        // create an input entity
        const eidClientInput = addEntity(this.world);
        addComponent(this.world, ClientInput, eidClientInput);
        addComponent(this.world, ServerMessageSender, eidClientInput);

        // create two server controlled pacmen
        const eidPlayerA = createPfServerPacman(this.world, 0, serverGameConfig);
        const eidPlayerB = createPfServerPacman(this.world, 1, serverGameConfig);

        // CREATE SYSTEMS - ORDER IS IMPORTANT!

        // 1. Inputs
        this.systems.push(createClientInputSystem(this));
        this.systems.push(await createServerMessageSystem(this, this.bootStrap.server));
        
        // 2. Game and UI logic

        // 3. Server to display coordinate conversions

        // 4. Renderers
        this.systems.push(createImageSystem(this));
    }

    update(t: number, dt: number) {
        if (!this.world) return;

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