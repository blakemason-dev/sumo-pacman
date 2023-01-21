import { Message } from "../../../../server/types/messages";
import Server from "./Server";


export class ClientInputSystem {
    private scene!: Phaser.Scene;
    private server!: Server;

    constructor(scene: Phaser.Scene, server: Server) {
        this.scene = scene;
        this.server = server;
    }

    startListening() {
        this.scene.input.keyboard.on('keydown-W', () => {
            this.server.room?.send(Message.ClientMoveUpBegin);
        });
        this.scene.input.keyboard.on('keyup-W', () => {
            this.server.room?.send(Message.ClientMoveUpEnd);
        });
        this.scene.input.keyboard.on('keydown-S', () => {
            this.server.room?.send(Message.ClientMoveDownBegin);
        });
        this.scene.input.keyboard.on('keyup-S', () => {
            this.server.room?.send(Message.ClientMoveDownEnd);
        });
        this.scene.input.keyboard.on('keydown-A', () => {
            this.server.room?.send(Message.ClientMoveLeftBegin);
        });
        this.scene.input.keyboard.on('keyup-A', () => {
            this.server.room?.send(Message.ClientMoveLeftEnd);
        });
        this.scene.input.keyboard.on('keydown-D', () => {
            this.server.room?.send(Message.ClientMoveRightBegin);
        });
        this.scene.input.keyboard.on('keyup-D', () => {
            this.server.room?.send(Message.ClientMoveRightEnd);
        });
    }

    stopListening() {
        this.scene.input.keyboard.off('keydown-W', () => {
            this.server.room?.send(Message.ClientMoveUpBegin);
        });
        this.scene.input.keyboard.off('keyup-W', () => {
            this.server.room?.send(Message.ClientMoveUpEnd);
        });
        this.scene.input.keyboard.off('keydown-S', () => {
            this.server.room?.send(Message.ClientMoveDownBegin);
        });
        this.scene.input.keyboard.off('keyup-S', () => {
            this.server.room?.send(Message.ClientMoveDownEnd);
        });
        this.scene.input.keyboard.off('keydown-A', () => {
            this.server.room?.send(Message.ClientMoveLeftBegin);
        });
        this.scene.input.keyboard.off('keyup-A', () => {
            this.server.room?.send(Message.ClientMoveLeftEnd);
        });
        this.scene.input.keyboard.off('keydown-D', () => {
            this.server.room?.send(Message.ClientMoveRightBegin);
        });
        this.scene.input.keyboard.off('keyup-D', () => {
            this.server.room?.send(Message.ClientMoveRightEnd);
        });
    }
}