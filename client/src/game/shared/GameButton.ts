import Phaser from 'phaser';

export class GameButton {
    // constructor variables
    private phaserScene!:  Phaser.Scene;
    private x!: number;
    private y!: number;
    private width!: number;
    private height!: number;
    private text!: string;
    private onClick!: () => void;

    // phaser variables
    private phaserBg!: Phaser.GameObjects.Rectangle;
    private phaserText!: Phaser.GameObjects.Text;

    constructor(
        phaserScene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        onClick: () => void
    ) {
        // save constructor variables
        this.phaserScene = phaserScene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;    

        // make the rectangle
        this.phaserBg = this.phaserScene.add.rectangle(
            this.x, this.y, 
            this.width, this.height, 
            0xcccccc);
        this.phaserText = this.phaserScene.add.text(this.x, this.y, text, {
            fontSize: (this.height * 0.6).toString() + "px",
            color: "#000"
        });
        this.phaserText.setOrigin(0.5,0.5);

        // set interactivity
        this.phaserBg.setInteractive();
        this.phaserBg.on(Phaser.Input.Events.POINTER_UP, this.onClick);
    }

    destroy() {
        this.phaserBg.destroy();
        this.phaserText.destroy();
    }
}