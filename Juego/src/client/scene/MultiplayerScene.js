import { GameScene } from "./GameScene.js";

export class MultiplayerScene extends GameScene {
    constructor() {
        super('MultiplayerScene');
    }

    preload() {
        super.preload();
    }

    init(data) {
        super.init();
        this.ws = data.ws;
        this.playerRole = data.playerRole; // 'player1' or 'player2'
        this.roomId = data.roomId;
        this.localPlayer = null;
        this.remotePlayer = null;
    }

    create() {
        super.create();
        this.setUpPlayers();

        // Configurar InputManager para multiplayer
        this.inputManager.setWebSocket(this.ws);
        this.inputManager.setPlayerRole(this.playerRole);
        this.inputManager.setUpInputs();

        this.setupWebSocketListeners();
    }


    update() {
        super.update();
    }

    ////////////////// RED CON WEBSOCKET //////////////

    setUpPlayers() {
        if (this.playerRole === 'player1') {
            this.localPlayer = this.arthur;
            this.remotePlayer = this.lucy;
        } else {
            this.localPlayer = this.lucy;
            this.remotePlayer = this.arthur;
        }
    }

    setupWebSocketListeners() {
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleServerMessage(data);
            } catch (error) {
                console.error('Error parsing server message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            this.handleDisconnection();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.handleDisconnection();
        };
    }

    handleServerMessage(data) {
        switch (data.type) {
            case 'PlayerMovmentInputCommand':
                //console.log('MultiplayerScene received msg:', data);
                // Remote player movment
                this.inputManager.updateRemotePlayerPosition(data);
                break;

            case 'PlayerAttackCommand':
                console.log('MultiplayerScene received msg:', data);
                // Remote player attacks
                this.inputManager.updateRemotePlayerAttack(data);
                break;

            case 'gameOver':
                // TODO: implementar
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    handleDisconnection() {
        this.gameEnded = true;
        this.physics.pause();

        this.add.text(400, 250, 'Partner Disconnected', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.createMenuButton();
    }

    createMenuButton() {
        const menuBtn = this.add.text(400, 400, 'Return to Main Menu', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setColor('#cccccc'))
            .on('pointerout', () => menuBtn.setColor('#ffffff'))
            .on('pointerdown', () => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.close();
                }
                this.scene.start('MenuScene');
            });
    }

    shutdown() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }
}