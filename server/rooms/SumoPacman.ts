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

        this.onMessage(Message.ClientMoveUp, (client) => {
            console.log(client.sessionId, ' says: Message.ClientMoveUp');
            this.state.pacmen.map(pacman => {
                if (pacman.sessionId === client.sessionId) {
                    pacman.velocity.y = 1;
                }
            })
        })
    }

    onJoin(client: Client) {
        console.log(client.sessionId, 'joined');

        const newPacman = new Pacman();
        newPacman.sessionId = client.sessionId;
        this.state.pacmen.push(newPacman);

        console.log(this.state.pacmen.length);

        // check if ready to start
        if (this.state.pacmen.length === this.maxClients) {
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
        // move all pacmen
        this.state.pacmen.map(pacman => {
            pacman.position.x += pacman.velocity.x * dt;
            pacman.position.y += pacman.velocity.y * dt;
            pacman.velocity.x = 0;
            pacman.velocity.y = 0;
        });
    }
}