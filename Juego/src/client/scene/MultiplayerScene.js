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
        this.setUpPlayers();
        super.create();

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
        console.log('Local player:', this.localPlayer);
        console.log('Remote player:', this.remotePlayer);
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

            case 'PlayerHit':
                console.log('MultiplayerScene received msg:', data);
                // Remote player hits
                this.updateRemotePlayerHit(data);
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            case 'GameOver':
                this.handleGameOver();
                break;

            case 'Restart':
                this.handleRestart();
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    setUpEnemyCollisions() {
        this.enemies.forEach((enemy) => {

            // Emeny hits 
            this.physics.add.collider(enemy.sprite, this.localPlayer.sprite, () => {
                if (enemy && this.localPlayer.health > 0) {
                    let damage = 50;
                    this.localPlayer.getHit(damage);
                    this.sendMessage({
                        type: 'PlayerHit',
                        damage: damage,
                        playerId: this.playerRole,
                    });
                    this.checkPlayerStatus();
                }
            });

            // Remote player raw collisions with enemies (no callbacks)
            this.physics.add.collider(enemy.sprite, this.remotePlayer.sprite);


            // Player lights enemy
            this.physics.add.overlap(enemy.sprite, this.arthur.light.colliderCircle, () => {
                if (this.arthur.light.isOn && enemy) {
                    enemy.setWeakened(true);
                    this.time.delayedCall(4000, () => {
                        if (enemy) {
                            enemy.setWeakened(false);
                        }
                    });
                }
            });

            // Player attacks enemy
            this.physics.add.overlap(enemy.sprite, this.players.get('player2').attackHitbox, () => {
                if (enemy?.weakened && this.players.get('player2').isAttacking) {
                    enemy.die();
                    enemy.isDead = true;
                    enemy = null;
                }
            });
        });
    }

    updateRemotePlayerHit(data) {
        this.players.get(data.playerId).getHit(data.damage);
        this.checkPlayerStatus();
    }

    checkPlayerStatus() { // This will be broadcasted to both players 
        if (this.players.get('player1').health <= 0 && this.players.get('player2').health <= 0) {
            this.sendMessage({
                type: 'GameOver',
            });
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


    handleGameOver() {
        this.gameEnded = true;
        this.physics.pause();

        this.add.text(400, 250, 'Game Over', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.createMenuButton();
        this.createRetryButton();
    }

    createRetryButton() {
        const retryBtn = this.add.text(400, 350, 'Retry', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => retryBtn.setColor('#cccccc'))
            .on('pointerout', () => retryBtn.setColor('#ffffff'))
            .on('pointerdown', () => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.sendMessage({
                        type: 'Restart',
                    });
                }
                

            });
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
                    this.sendMessage({
                        type: 'PlayerDisconnected',
                    });
                    this.ws.close();
                }
                this.scene.start('MenuScene');
            });
    }

    handleRestart() {
        this.scene.start('MultiplayerScene');
    }

    sendMessage(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    shutdown() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
        }
    }
}