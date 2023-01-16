import Phaser from "phaser";
import { ServerGameConfig } from "../../../../server/types/game-config";

const xToPhaser = (serverX: number, serverGameConfig: ServerGameConfig, phaserScale: Phaser.Scale.ScaleManager) => {
    const { width } = phaserScale;

    return serverX * width / serverGameConfig.width + serverGameConfig.originX * width;
}

const yToPhaser = (serverY: number, serverGameConfig: ServerGameConfig, phaserScale: Phaser.Scale.ScaleManager) => {
    const { height } = phaserScale;

    return height - serverY * height / serverGameConfig.height - serverGameConfig.originY * height;
}

// const dimToPhaser = (p2_dim: number, p2_width: number, phaser_scale: Phaser.Scale.ScaleManager) => {
//     const { width } = phaser_scale;

//     return p2_dim * width / p2_width;
// }

const radToPhaserAngle = (p2_rad: number) => {
    p2_rad = p2_rad % (2*Math.PI);
    if (p2_rad < 0) {
        p2_rad += (2*Math.PI);
    }
    return Phaser.Math.RadToDeg(-p2_rad);
}

export { xToPhaser, yToPhaser, radToPhaserAngle };