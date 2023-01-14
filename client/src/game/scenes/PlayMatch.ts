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
import { ServerLink, ServerLinkType } from '../components/network/ServerLink';
import { createServerLinkSystem } from '../systems/network/ServerLinkSystem';
import { EntityServerLinkType } from '../../../../server/types/entities';

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

    async create() {
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

        // create player pacman
        const eidPlayer = createPfPlayerPacman(this.world);
        Transform.position.x[eidPlayer] = this.scale.width*0.5;
        Transform.position.y[eidPlayer] = this.scale.height*0.5;
        addComponent(this.world, ServerLink, eidPlayer);
        ServerLink.linkType[eidPlayer] = EntityServerLinkType.Player;

        // create systems
        this.systems.push(createClientInputSystem(this));
        this.systems.push(await createServerLinkSystem(this));
        this.systems.push(createPlayerMovementSystem(this));
        this.systems.push(createRingOutCheckSystem(this, this.eventEmitter));
        this.systems.push(createImageSystem(this));

        // listen for playe ring out event
        this.eventEmitter.on('RingOutCheck-ENTITY_OUT', (eid) => {
            if (eid === eidPlayer) {
                removeEntity(this.world, eidPlayer);
                this.switchScene = true;
                this.eventEmitter.removeAllListeners();
            }
        })
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