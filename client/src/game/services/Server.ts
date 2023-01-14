import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import Phaser from 'phaser';
import { EventEmitter } from 'events';
import iSumoPacmanState from '../../../../server/types/iSumoPacmanState';

export default class Server {
    private client: Client;
    eventEmitter = new EventEmitter();
    private room?: Room<iSumoPacmanState & Schema>;

    constructor() {
        this.client = new Client('ws://localhost:8500');
    }

    async join() {
        this.room = await this.client.joinOrCreate<iSumoPacmanState & Schema>('sumo-pacman');

        this.room.onStateChange(state => {
            this.eventEmitter.emit("state-changed", state);
        });

        this.room.onMessage('found-match', (state) => {
            this.eventEmitter.emit('found-match', state);
        });

        this.room.onMessage('client-left', (sessionId) => {
            this.eventEmitter.emit('opponent-disconnected');
        });
    }

    leave() {
        this.room?.leave();
    }
}