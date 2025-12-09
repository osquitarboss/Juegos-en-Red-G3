import Phaser from 'phaser';
import { OptionsScene } from './scene/OptionsScene.js';
import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';
import { PauseScene } from './scene/PauseScene.js';
import { CreditsScene } from './scene/CreditsScene.js';
import { IntroScene } from './scene/IntroScene.js';
import { EndScene } from './scene/EndScene.js';
import { GameScene2 } from './scene/GameScene2.js';

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
            debugShowBody: false,
            debugShowStaticBody: false,
        }
    },


    scene: [MenuScene, CreditsScene, OptionsScene, IntroScene, GameScene, PauseScene, EndScene, GameScene2],
    backgroundColor: '#360246ff'
}

const game = new Phaser.Game(config);

