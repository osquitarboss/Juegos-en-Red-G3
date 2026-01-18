import { Command } from '../command-pattern/Command';
import { PlayerMovmentInputCommand } from '../command-pattern/PlayerMovmentInputCommand';
import { CommandProcessor } from '../command-pattern/CommandProcessor';
import Phaser from 'phaser';
import { PlayerAttackCommand } from '../command-pattern/PlayerAttackCommand';

export class InputManager {
    // Clase que maneja los inputs del jugador y los envia al command processor 
    constructor(scene, sceneManager, input, commandProcessor, localPlayerRole = null, ws = null) {
        this.commandProcessor = new CommandProcessor();
        this.scene = scene;
        this.sceneManager = sceneManager;
        this.input = input;
        this.commandProcessor = commandProcessor;
        this.players = new Map();
        this.inputsMapping = [];
        this.isPaused = false;

        /////////// INPUT MANAGER CON WEBSOCKET ///////////
        this.localPlayerRole = localPlayerRole;
        this.ws = ws;
        this.setUpInputs();
    }

    setUpInputs() {
        this.players = this.scene.players;
        if (this.localPlayerRole === null) {
            this.setUpLocalInputs();
        } else {
            this.setUpRemoteInputs(this.localPlayerRole);
        }
    }

    setWebSocket(ws) {
        this.ws = ws;
    }

    setLocalPlayerRole(role) {
        this.localPlayerRole = role;
    }

    setUpLocalInputs() {

        this.input.keyboard.on('keydown-ESC', () => {
            this.pause();
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

    setUpRemoteInputs(playerRole) {

        this.input.keyboard.on('keydown-ESC', () => {
            this.pause();
        });


        const InputConfig = [
            {
                playerId: this.localPlayerRole,
                leftKey: 'A',
                rightKey: 'D',
                upKey: 'W',
                downKey: 'S',
                attackKey: 'F'
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
        this.sceneManager.launch('PauseScene', { originalScene: 'GameScene' });
        this.sceneManager.pause('GameScene');
        this.isPaused = true;
    }

    update() {

        this.inputsMapping.forEach(mapping => {
            let player = this.players.get(mapping.playerId);
            player.id = mapping.playerId;

            let localCommand = new Command();

            // SALTO
            if (mapping.upKeyObj.isDown) {
                localCommand = new PlayerMovmentInputCommand(player, 'up');
            }

            // MOVIMIENTO
            else if (mapping.leftKeyObj.isDown) {
                localCommand = new PlayerMovmentInputCommand(player, 'left');
            } else if (mapping.rightKeyObj.isDown) {
                localCommand = new PlayerMovmentInputCommand(player, 'right');
            } else {
                localCommand = new PlayerMovmentInputCommand(player, 'idle');
            }

            this.commandProcessor.process(localCommand);
            this.sendMessage(localCommand.serialize());

            if (mapping.attackKeyObj.isDown) {
                let attackCommand = new PlayerAttackCommand(player);
                this.commandProcessor.process(attackCommand);
                this.sendMessage(attackCommand.serialize());
            }


        });
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.log('Sending message:', message);
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Message not sent:', message);
        }
    }

    updateRemotePlayerPosition(data) {
        if (data.type === 'PlayerMovmentInputCommand') {
            //console.log('MultiplayerScene received in input manager msg:', data);
            this.commandProcessor.receiveCommand(data);
        }
    }

    updateRemotePlayerAttack(data) {
        if (data.type === 'PlayerAttackCommand') {
            console.log('MultiplayerScene received in input manager msg:', data);
            this.commandProcessor.receiveCommand(data);
        }
    }

}