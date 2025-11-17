import Phaser from "phaser";
import { Player } from "../entities/Player.js";


export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    init() {
        this.players = new Map();
        this.inputsMapping = [];
        this.isPaused = false;
        this.escWasDown = false;
    }

    create() {
        this.setUpPlayers();

        const plataformas = this.physics.add.staticGroup();
        
        const suelo1 = this.add.rectangle(400, 580, 800, 40, 0xffffff);
        const suelo2 = this.add.rectangle(200, 450, 200, 30, 0xffffff);

        this.physics.add.existing(suelo1, true);
        this.physics.add.existing(suelo2, true);
        
        plataformas.add(suelo1);
        plataformas.add(suelo2);

        this.physics.add.collider(this.players.get('player1').sprite, plataformas);
        this.physics.add.collider(this.players.get('player2').sprite, plataformas);

        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    setUpPlayers() {

        const player1 = new Player(this, 'player1', 50, 300);
        const player2 = new Player(this, 'player2', 750, 300);
        this.players.set('player1', player1);
        this.players.set('player2', player2);
        
        const InputConfig = [
            {
                playerId: 'player1',
                leftKey: 'A',
                rightKey: 'D',
                upKey: 'W',
                downKey: 'S',
            },
            {
                playerId: 'player2',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                upKey: 'UP',
                downKey: 'DOWN',
            }
        ];

        this.inputsMapping = InputConfig;
        this.inputsMapping = this.inputsMapping.map(config => {
            return {
                playerId: config.playerId,
                leftKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.leftKey]),
                rightKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.rightKey]),
                upKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.upKey]),
                downKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.downKey]),
            }
        });
        
    }

    

    setPauseState(isPaused) {
        this.isPaused = isPaused;

        if (this.isPaused) {
            this.scene.launch('PauseScene', {originalScene: 'GameScene'});
            this.scene.pause();
        }
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        const newPausedState = !this.isPaused;
        this.setPauseState(newPausedState);
    }

    update() {

        if (this.escKey.isDown) {
            this.togglePause();
        }

        this.inputsMapping.forEach(mapping => {
            const player = this.players.get(mapping.playerId);

            if (mapping.leftKeyObj.isDown) {
                player.sprite.setVelocityX(-player.baseSpeed);
            } else if (mapping.rightKeyObj.isDown) {
                player.sprite.setVelocityX(+player.baseSpeed);
            } else {
                player.sprite.setVelocityX(0);
            }
        });
    }
}
