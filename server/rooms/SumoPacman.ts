import { Room, Client } from 'colyseus';

import SumoPacmanState from './SumoPacmanState';
import { Pacman } from '../../shared/types/iSumoPacmanState';

export default class SumoPacman extends Room<SumoPacmanState> {
    onCreate() {
        console.log("SumoPacman: onCreate()");
        this.maxClients = 2;

        this.setState(new SumoPacmanState());
    }

    onJoin(client: Client) {
        console.log("SumoPacman: onJoin()");

        console.log(client.sessionId, ' joined');
        const pacman = new Pacman();
        pacman.sessionId = client.sessionId;
        console.log(this.state.pacmen);
        this.state.pacmen.push(pacman);
    }

    onLeave(client: Client) {
        console.log(client.sessionId, 'left');
    }

    // update(dt: number) {
    //     console.log(dt);
    // }
}