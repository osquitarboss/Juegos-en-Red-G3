import Phaser from 'phaser';

import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';
import { PauseScene } from './scene/PauseScene.js';
import { CreditsScene } from './scene/CreditsScene.js';
import { IntroScene } from './scene/IntroScene.js';
import { OptionsScene } from './scene/OptionsScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1 },
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
        }
    },


    scene: [MenuScene, CreditsScene, IntroScene, GameScene, PauseScene, OptionsScene],
    backgroundColor: '#360246ff'
}

const game = new Phaser.Game(config);

