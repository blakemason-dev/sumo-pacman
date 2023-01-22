import React, { useEffect, useRef } from "react";
import Phaser from 'phaser';
import { FindMatch } from "../game/scenes/FindMatch";
import { SearchMatch } from "../game/scenes/SearchMatch";
import { PlayMatch } from "../game/scenes/PlayMatch";
import { BootStrap } from "../game/scenes/BootStrap";

const PhaserViewer = () => {
    const gameInitialised = useRef(false);

    const config = {
        type: Phaser.CANVAS,
        width: window.innerWidth*0.9,
        height: window.innerWidth*0.9 * 1080 / 1960,
        // width: 640,
        // height: 360,
        parent: "phaser-viewer",
        scene: [ BootStrap ]
    }

    useEffect(() => {
        if (gameInitialised.current) return;

        new Phaser.Game(config);

        gameInitialised.current = true;
    });


    return <div id="phaser-viewer"></div>
}

export default PhaserViewer;
