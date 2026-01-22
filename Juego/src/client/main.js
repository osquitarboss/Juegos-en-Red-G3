import Phaser from 'phaser';
import { OptionsScene } from './scene/OptionsScene.js';
import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';
import { PauseScene } from './scene/PauseScene.js';
import { CreditsScene } from './scene/CreditsScene.js';
import { IntroScene } from './scene/IntroScene.js';
import { EndScene } from './scene/EndScene.js';
import { GameScene2 } from './scene/GameScene2.js';
import { EndScene2 } from './scene/EndScene2.js';

const config = {
    type: Phaser.AUTO,
    width: 800, // Ancho de la ventana
    height: 600, // Alto de la ventana
    parent: 'game-container',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1 },
            debug: false,
            debugShowBody: false,
            debugShowStaticBody: false,
        }
    },
    dom: {
        createContainer: true
    },

    // LoginScene poner como escena inicial, ahora esta quitado pq es un coñazo para hacer pruebas
    scene: [MenuScene, CreditsScene, OptionsScene, IntroScene, GameScene, EndScene, GameScene2, EndScene2, PauseScene],
    backgroundColor: '#360246ff'
}

const game = new Phaser.Game(config);

