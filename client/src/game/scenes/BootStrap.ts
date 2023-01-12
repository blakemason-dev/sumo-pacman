// Bootstrap.ts
// Handles scene management and global assets

import Phaser from "phaser";

import * as AssetLibrary from '../libraries/AssetLibrary';
import { FindMatch } from "./FindMatch";
import { PlayMatch } from "./PlayMatch";
import { SearchMatch } from "./SearchMatch";

export class BootStrap extends Phaser.Scene {
    constructor() {
        super('boot-strap');
        console.log('BootStrap: constructor()');
    }

    init() {
        console.log('BootStrap: init()');
    }

    preload() {
        console.log('BootStrap: preload()');

        // load all assets for global use
        AssetLibrary.loadAll(this);
    }

    create() {
        console.log('Bootstrap: create()');
        this.scene.launch('find-match', { 
            bootStrap: this,
        });
    }

    switch(oldScene: string, newScene: string, data: any = {}) {
        this.scene.remove(oldScene);

        if (!this.scene.get(newScene)) {
            switch (newScene) {
                case 'find-match': { 
                    this.scene.add(
                        newScene,
                        FindMatch, 
                        false,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                case 'search-match': { 
                    this.scene.add(
                        newScene,
                        SearchMatch, 
                        false,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                case 'play-match': { 
                    this.scene.add(
                        newScene,
                        PlayMatch, 
                        false,
                        { bootStrap: this, ...data }
                    );
                    break;
                }
                default: break;
            }
        } else {
            this.scene.launch(newScene, {
                bootStrap: this,
                ...data
            });
        }
    }
}