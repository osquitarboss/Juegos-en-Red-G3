import { Command } from '../command-pattern/Command';
import { PlayerMovmentInputCommand } from '../command-pattern/PlayerMovmentInputCommand';
import { CommandProcessor } from '../command-pattern/CommandProcessor';
import Phaser from 'phaser';

export class InputManager {

    constructor(scene, sceneManager, input, commandProcessor) {
        this.commandProcessor = new CommandProcessor();
        this.scene = scene;
        this.sceneManager = sceneManager;
        this.input = input;
        this.commandProcessor = commandProcessor;
        this.players = new Map();
        this.inputsMapping = [];
        this.isPaused = false;

        this.setUpInputs();
    }

    setUpInputs() {
        
        this.input.keyboard.on('keydown-ESC', () => {
            this.pause();
        });

        // Detectar F solo cuando se presiona (evento)
        this.input.keyboard.on('keydown-F', () => {
            
            this.players.get('player1').attack();
        });
            
        const InputConfig = [
            {
                playerId: 'player1',
                leftKey: 'A',
                rightKey: 'D',
                upKey: 'W',
                downKey: 'S',
                attackKey: 'F'
            },
            {
                playerId: 'player2',
                leftKey: 'LEFT',
                rightKey: 'RIGHT',
                upKey: 'UP',
                downKey: 'DOWN',
                attackKey: 'ENTER'
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
                attackKeyObj: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[config.attackKey])
            }
        });
            
    }

    pause() {
        this.sceneManager.launch('PauseScene', {originalScene: 'GameScene'});
        this.sceneManager.pause('GameScene');
        this.isPaused = true;
    }

    update() {
        
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

            if (mapping.attackKeyObj.isDown) {
                player.attack();
            }

            this.commandProcessor.process(command);
            });
        }
}