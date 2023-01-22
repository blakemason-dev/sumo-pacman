import {
    IWorld,
    System,
    createWorld
} from 'bitecs';

import { Room, Client } from 'colyseus';

import SumoPacmanState from './SumoPacmanState';
import { Pacman } from '../types/iSumoPacmanState';
import { Message } from '../types/messages';
import { createP2PhysicsSystem } from '../ecs/systems/P2PhysicsSystem';
import { createPfPacmanEntity } from '../ecs/prefabs/pfPacmanEntity';
import { P2Body } from '../ecs/components/P2Body';
import { PacmanUpdater } from '../ecs/components/PacmanUpdater';
import { createSumoPacmanStateSyncSystem } from '../ecs/systems/SumoPacmanStateSyncSystem';
import { createClientMessageSystem } from '../ecs/systems/ClientMessageSystem';
import { createClientMovementSystem } from '../ecs/systems/ClientMovementSystem';
import { createRingOutCheckerSystem } from '../ecs/systems/RingOutCheckerSystem';
import { createShrinkingRingSystem } from '../ecs/systems/ShrinkingRingSystem';


export default class SumoPacman extends Room<SumoPacmanState> {
    private world!: IWorld;
    // private clientMessageSystem!: System;
    private systems: System[] = [];
    private clientByEntityId = new Map<number, Client>();

    private gameOver = false;

    onCreate() {
        console.log("SumoPacman: onCreate()");
        this.maxClients = 2;

        this.setState(new SumoPacmanState());

        // ECS
        this.world = createWorld();
    }

    onJoin(client: Client) {
        console.log(client.sessionId, 'joined');

        // add new pacman with session Id
        const newPacman = new Pacman();
        newPacman.sessionId = client.sessionId;
        this.state.pacmen.push(newPacman);

        // create pacman prefab
        const eidPacman = createPfPacmanEntity(this.world, this.state.ringRadius);
        if (this.state.pacmen.length === 1) {
            P2Body.position.x[eidPacman] = -2.5;
            P2Body.position.y[eidPacman] = 0;
            P2Body.angle[eidPacman] = 0;
            PacmanUpdater.serverIndex[eidPacman] = 0;
        } else if (this.state.pacmen.length === 2) {
            P2Body.position.x[eidPacman] = 2.5;
            P2Body.position.y[eidPacman] = 0;
            P2Body.angle[eidPacman] = Math.PI;
            PacmanUpdater.serverIndex[eidPacman] = 1;
        }

        // tell the client what its server index is
        client.send('pacman-index', this.state.pacmen.length - 1);

        // update the client map
        this.clientByEntityId.set(eidPacman, client);

        // check if ready to start
        if (this.state.pacmen.length === this.maxClients) {
            this.onStartMatch();
        }
    }

    onLeave(client: Client) {
        console.log(client.sessionId, 'left');
        
        // clean up the room state
        this.state.pacmen.forEach((pacman, index) => {
            if (pacman.sessionId === client.sessionId) {
                this.state.pacmen.deleteAt(index);
            }
        });

        // clean up the client entity map
        this.clientByEntityId.forEach((cl, key, map) => {
            if (cl === client) {
                map.delete(key);
            }
        });
    }

    onStartMatch() {

        // set a room game loop
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));

        // process inputs
        this.systems.push(createClientMessageSystem(this, this.clientByEntityId));

        // update game logic
        this.systems.push(createClientMovementSystem());
        this.systems.push(createP2PhysicsSystem());
        this.systems.push(createRingOutCheckerSystem(this));
        this.systems.push(createShrinkingRingSystem(this));

        // send world state
        this.systems.push(createSumoPacmanStateSyncSystem(this.state.pacmen));

        // tell clients match has been found and pass along some game world
        // configuration
        const gameConfig = {
            width: 10 * 1920 / 1080,
            height: 10,
            originX: 0.5,
            originY: 0.5
        }

        // tell the clients match has been started
        this.broadcast('start-match', gameConfig);
    }

    onStopMatch() {
        this.gameOver = true;
    }

    ringOut(eid: number) {
        this.clientByEntityId.forEach((cl, key, map) => {
            if (eid === key) {
                cl.send('game-over', { victory: false });
            } else {
                cl.send('game-over', { victory: true });
            }
        });

        this.onStopMatch();
    }

    update(dt: number) {
        if (!this.world || this.gameOver) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });
    }
}