import Phaser from 'phaser';

export class InputManager {

    constructor(scene, input) {
        this.scene = scene;
        this.input = input;
        this.players = new Map();
        this.inputsMapping = [];
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.setUpPlayers();
    }

    setUpPlayers() {
    
        
            
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

        // Handle player movements
        this.inputsMapping.forEach(mapping => {
            const player = this.players.get(mapping.playerId);

            if (mapping.leftKeyObj.isDown) {
                player.sprite.setVelocityX(-player.baseSpeed);
            } else if (mapping.rightKeyObj.isDown) {
                player.sprite.setVelocityX(+player.baseSpeed);
            } else if (mapping.upKeyObj.isDown) {
                if (player.canJump) {
                    player.sprite.setVelocityY(-player.baseSpeed - 100); // Magic nu,mber to make jump feel better
                    player.canJump = false;
                }
            } else {
                player.sprite.setVelocityX(0);
            }
        });
    }
}