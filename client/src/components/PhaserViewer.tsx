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
        width: 640,
        height: 360,
        parent: "phaser-viewer",
        scene: [ BootStrap, FindMatch, SearchMatch, PlayMatch ]
    }

    useEffect(() => {
        if (gameInitialised.current) return;

        new Phaser.Game(config);

        gameInitialised.current = true;
    });


    return <div id="phaser-viewer"></div>
}

export default PhaserViewer;
