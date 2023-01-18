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

const PACMAN_SPEED = 5;

export default class SumoPacman extends Room<SumoPacmanState> {
    private world!: IWorld;
    private systems: System[] = [];

    onCreate() {
        console.log("SumoPacman: onCreate()");
        this.maxClients = 2;

        this.setState(new SumoPacmanState());

        // handle movement
        this.onMessage(Message.ClientMoveUp, (client) => {
            this.state.pacmen.map(pacman => {
                if (pacman.sessionId === client.sessionId) {
                    pacman.velocity.y = 1;
                }
            });
        });
        this.onMessage(Message.ClientMoveDown, (client) => {
            this.state.pacmen.map(pacman => {
                if (pacman.sessionId === client.sessionId) {
                    pacman.velocity.y = -1;
                }
            });
        });
        this.onMessage(Message.ClientMoveLeft, (client) => {
            this.state.pacmen.map(pacman => {
                if (pacman.sessionId === client.sessionId) {
                    pacman.velocity.x = -1;
                }
            });
        });
        this.onMessage(Message.ClientMoveRight, (client) => {
            this.state.pacmen.map(pacman => {
                if (pacman.sessionId === client.sessionId) {
                    pacman.velocity.x = 1;
                }
            });
        });

    }

    onJoin(client: Client) {
        console.log(client.sessionId, 'joined');

        // add new pacman with session Id
        const newPacman = new Pacman();
        newPacman.sessionId = client.sessionId;
        this.state.pacmen.push(newPacman);

        // check if ready to start
        if (this.state.pacmen.length === this.maxClients) {
            this.onStartMatch();
        }
    }

    onLeave(client: Client) {
        console.log(client.sessionId, 'left');
        this.state.pacmen.forEach((pacman, index) => {
            if (pacman.sessionId === client.sessionId) {
                this.state.pacmen.deleteAt(index);
            }
        });
    }

    onStartMatch() {
        // set a room game loop
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));

        // ECS
        this.world = createWorld();

        // create pacmen prefabs
        const eidPacmanA = createPfPacmanEntity(this.world);
        P2Body.position.x[eidPacmanA] = -2.5;
        P2Body.position.y[eidPacmanA] = 0;
        P2Body.angle[eidPacmanA] = 0;
        PacmanUpdater.serverIndex[eidPacmanA] = 0;

        const eidPacmanB = createPfPacmanEntity(this.world);
        P2Body.position.x[eidPacmanB] = 2.5;
        P2Body.position.y[eidPacmanB] = 0;
        P2Body.angle[eidPacmanB] = Math.PI;
        PacmanUpdater.serverIndex[eidPacmanB] = 1;

        // create systems
        this.systems.push(createP2PhysicsSystem());
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

    update(dt: number) {
        if (!this.world) return;

        // run systems
        this.systems.map(system => {
            system(this.world);
        });


        // move all pacmen
        // this.state.pacmen.map(pacman => {
        //     // normalise the velocity
        //     let length = 1;
        //     if (Math.abs(pacman.velocity.x) > 0 || Math.abs(pacman.velocity.y) > 0) {
        //         length = Math.sqrt(pacman.velocity.x**2 + pacman.velocity.y**2);

        //         // also calc a new angle while here
        //         pacman.angle = Math.atan2(pacman.velocity.y, pacman.velocity.x);

        //         // set new position
        //         pacman.position.x += pacman.velocity.x / length * dt * 0.001 * PACMAN_SPEED;
        //         pacman.position.y += pacman.velocity.y / length * dt * 0.001 * PACMAN_SPEED;
        //     }

        //     // reset velocity for next input/time step
        //     pacman.velocity.x = 0;
        //     pacman.velocity.y = 0;
        // });
    }
}