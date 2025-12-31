import Phaser from 'phaser';
import { OptionsScene } from './scene/OptionsScene.js';
import { MenuScene } from './scene/MenuScene.js';
import { GameScene } from './scene/GameScene.js';
import { PauseScene } from './scene/PauseScene.js';
import { CreditsScene } from './scene/CreditsScene.js';
import { IntroScene } from './scene/IntroScene.js';
import { EndScene } from './scene/EndScene.js';
import { GameScene2 } from './scene/GameScene2.js';
import { ConnectionLostScene } from './scene/ConnectionLostScene.js';
import { LoginScene } from './scene/LoginScene.js';
import { MatchMakingScene } from './scene/MatchMakingScene.js';
import {MultiplayerScene} from './scene/MultiplayerScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800, // Ancho de la ventana
    height: 600, // Alto de la ventana
    parent: 'game-container',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1 },
            debug: true,
            debugShowBody: false,
            debugShowStaticBody: false,
        }
    },
    dom: {
        createContainer: true
    },

// LoginScene poner como escena inicial, ahora esta quitado pq es un coñazo para hacer pruebas
    scene: [MenuScene, MatchMakingScene, CreditsScene, OptionsScene, IntroScene, GameScene, MultiplayerScene, PauseScene, EndScene, GameScene2, ConnectionLostScene],
    backgroundColor: '#360246ff'
}

const game = new Phaser.Game(config);

