import { Client, Room } from 'colyseus.js';
import { Schema } from '@colyseus/schema';
import Phaser from 'phaser';
import { EventEmitter } from 'events';
import iSumoPacmanState from '../../../../server/types/iSumoPacmanState';

export default class Server {
    private client: Client;
    eventEmitter = new EventEmitter();
    room?: Room<iSumoPacmanState & Schema>;
    pacmanIndex = -1;

    constructor() {
        this.client = new Client('ws://localhost:8500');
    }

    async join() {
        this.room = await this.client.joinOrCreate<iSumoPacmanState & Schema>('sumo-pacman');

        this.room.onStateChange(state => {
            this.eventEmitter.emit("state-changed", state);
        });

        this.room.onMessage('start-match', (serverGameConfig) => {
            this.eventEmitter.emit('start-match', serverGameConfig);
        });

        this.room.onMessage('client-left', (sessionId) => {
            this.eventEmitter.emit('opponent-disconnected');
        });

        this.room.onMessage('game-over', (data) => {
            console.log("Server.ts received game-over message");
            this.eventEmitter.emit('game-over', data);
        });

        this.room.onMessage('pacman-index', (index) => {
            this.pacmanIndex = index;
        });
    }

    startClientInputListener() {

    }

    leave() {
        this.room?.leave();
    }
}