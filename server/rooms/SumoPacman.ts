import { Room, Client } from 'colyseus';

import SumoPacmanState from './SumoPacmanState';
import { Pacman } from '../types/iSumoPacmanState';
import { Message } from '../types/messages';

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
                    pacman.velocity.y = -1;
                }
            });
        });
        this.onMessage(Message.ClientMoveDown, (client) => {
            this.state.pacmen.map(pacman => {
                if (pacman.sessionId === client.sessionId) {
                    pacman.velocity.y = 1;
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
            this.state.pacmen[0].position.x = -100;
            this.state.pacmen[0].position.y = 180;
            this.state.pacmen[0].angle = 0;
            this.state.pacmen[1].position.x = 100;
            this.state.pacmen[1].position.y = 180;
            this.state.pacmen[1].angle = 180;

            // tell clients match has been found
            this.broadcast('found-match');
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
        // console.log('test');
        // move all pacmen
        this.state.pacmen.map(pacman => {
            pacman.position.x += pacman.velocity.x * dt;
            pacman.position.y += pacman.velocity.y * dt;
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        });
    }
}