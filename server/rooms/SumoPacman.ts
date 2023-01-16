import { Room, Client } from 'colyseus';

import SumoPacmanState from './SumoPacmanState';
import { Pacman } from '../types/iSumoPacmanState';
import { Message } from '../types/messages';

const PACMAN_SPEED = 5;

export default class SumoPacman extends Room<SumoPacmanState> {
    onCreate() {
        console.log("SumoPacman: onCreate()");
        this.maxClients = 2;

        this.setState(new SumoPacmanState());

        this.onMessage(Message.ClientEntityID, (data) => {

        });

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

        // set a room game loop
        this.setSimulationInterval((deltaTime) => this.update(deltaTime));
    }

    onJoin(client: Client) {
        console.log(client.sessionId, 'joined');

        const newPacman = new Pacman();
        newPacman.sessionId = client.sessionId;
        this.state.pacmen.push(newPacman);

        // check if ready to start
        if (this.state.pacmen.length === this.maxClients) {
            // set player positions and angle
            this.state.pacmen[0].position.x = -2.5;
            this.state.pacmen[0].position.y = 0;
            this.state.pacmen[0].angle = 0;
            this.state.pacmen[1].position.x = 2.5;
            this.state.pacmen[1].position.y = 0;
            this.state.pacmen[1].angle = Math.PI;

            // tell clients match has been found and pass along some game world
            // configuration
            const gameConfig = {
                width: 10 * 1920/1080,
                height: 10,
                originX: 0.5,
                originY: 0.5
            }
            this.broadcast('start-match', gameConfig);
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

    update(dt: number) {
        // move all pacmen
        this.state.pacmen.map(pacman => {
            // normalise the velocity
            let length = 1;
            if (Math.abs(pacman.velocity.x) > 0 || Math.abs(pacman.velocity.y) > 0) {
                length = Math.sqrt(pacman.velocity.x**2 + pacman.velocity.y**2);

                // also calc a new angle while here
                pacman.angle = Math.atan2(pacman.velocity.y, pacman.velocity.x);

                // set new position
                pacman.position.x += pacman.velocity.x / length * dt * 0.001 * PACMAN_SPEED;
                pacman.position.y += pacman.velocity.y / length * dt * 0.001 * PACMAN_SPEED;
            }
            
            // reset velocity for next input/time step
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        });
    }
}