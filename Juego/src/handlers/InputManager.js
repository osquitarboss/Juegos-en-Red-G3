import { Command } from '../command-pattern/Command';
import { PlayerMovmentInputCommand } from '../command-pattern/PlayerMovmentInputCommand';
import { CommandProcessor } from '../command-pattern/CommandProcessor';
import Phaser from 'phaser';

export class InputManager {

    constructor(scene, input, commandProcessor) {
        this.commandProcessor = new CommandProcessor();
        this.scene = scene;
        this.input = input;
        this.commandProcessor = commandProcessor;
        this.players = new Map();
        this.inputsMapping = [];
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        // Detectar F solo cuando se presiona (evento)
        this.input.keyboard.on('keydown-F', () => {
            
                this.players.get('player1').action.perform();
        });

        this.setUpInputs();
    }

    setUpInputs() {
    
        
            
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
            let player = this.players.get(mapping.playerId);

            let command = new Command();

            // SALTO
            if (mapping.upKeyObj.isDown) {
                this.commandProcessor.process(
                    new PlayerMovmentInputCommand(player, 'up')
                );
            }

            // MOVIMIENTO
            if (mapping.leftKeyObj.isDown) {
                this.commandProcessor.process(
                    new PlayerMovmentInputCommand(player, 'left')
                );
            } else if (mapping.rightKeyObj.isDown) {
                this.commandProcessor.process(
                    new PlayerMovmentInputCommand(player, 'right')
                );
            } else {
                this.commandProcessor.process(
                    new PlayerMovmentInputCommand(player, 'idle')
                );
            }
            this.commandProcessor.process(command);
            });
        }
}