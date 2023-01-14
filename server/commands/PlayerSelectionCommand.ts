import { Command } from '@colyseus/command';
import { Client } from 'colyseus';
import SumoPacman from '../rooms/SumoPacman';


type Payload = {
    client: Client,
    index: number
}

export class PlayerSelectionCommand extends Command<SumoPacman, Payload> {
    execute(data: Payload) {

    }
}