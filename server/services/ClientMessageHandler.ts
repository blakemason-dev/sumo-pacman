import { Client } from "colyseus";
import SumoPacman from "../rooms/SumoPacman";

export class ClientMessageHandler {
    private room!: SumoPacman;
    private clientsByEid!: Map<number, Client>;

    constructor(room: SumoPacman, clientsByEid: Map<number, Client>) {
        this.room = room;   
        this.clientsByEid = clientsByEid;
    }

    init() {
        // create all our message receipt functions
        
    }

    clear() {

    }

}