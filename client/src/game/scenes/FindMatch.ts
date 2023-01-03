import Phaser from 'phaser';
import { GameButton } from '../shared/GameButton';

export class FindMatch extends Phaser.Scene {
    constructor() {
        super("find-match");
    }

    init() {
        console.log('init()');
    }

    preload() {
        console.log('preload()');
    }

    create() {
        console.log('create()');

        const redRing = this.add.circle(320,180, 160, 0x222222, 1);
        redRing.setStrokeStyle(3, 0xff0000);

        const findMatchButton = new GameButton(
            this,
            320, 180,
            180, 40, "FIND MATCH",
            () => {
                console.log("Clicked");
            }
        )
    }

    
}