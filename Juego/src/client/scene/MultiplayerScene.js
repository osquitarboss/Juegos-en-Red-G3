import { GameScene } from "./GameScene.js";
import { Platform } from "../entities/Platform.js";

export class MultiplayerScene extends GameScene {
    constructor() {
        super('MultiplayerScene');
        this.loaded = false; // flag para verificar q ha cargado la escena del compi
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
        this.setupWebSocketListeners();


    }

    create() {
        this.setUpPlayers();
        super.create();

        // Configurar InputManager para multiplayer
        this.inputManager.setWebSocket(this.ws);
        this.inputManager.setLocalPlayerRole(this.playerRole);
        this.inputManager.setUpInputs();


        this.sendMessage({
            type: 'Loaded',
        });
    }


    update() {
        if (!this.loaded) return;

        this.fondo.tilePositionX = this.cameras.main.scrollX * 0.2;

        this.camera.update();
        this.inputManager.update();

        this.arthur.light.update();

        if (this.playerRole === 'player') {  // Jugador 1 actualiza enemigos y reenvia movimientos a jugador 2

            this.enemies.forEach((enemy) => {
                if (!enemy || enemy.isDead) {
                    this.enemies.delete(enemy.id);
                    return;
                }
                enemy.update();
                this.sendMessage({
                    type: 'EnemyMovment',
                    enemyId: enemy.id,
                    movementVector: enemy.movementVector,
                    chasingPlayerId: enemy.chasingPlayerId,
                    x: enemy.sprite.x,
                    y: enemy.sprite.y
                });
            })
        }
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

            case 'EnemyMovment':
                // Remote player hits
                this.recieveEnemyMovment(data);
                break;

            case 'playerDisconnected':
                this.handleDisconnection();
                break;

            case 'Loaded':
                this.loaded = true;
                break;

            case 'GameOver':
                this.handleGameOver();
                break;

            case 'PlayersWin':
                this.handlePlayersWin();
                break;

            case 'Restart':
                this.handleRestart();
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }

    recieveEnemyMovment(data) {
        this.enemies.forEach((enemy) => {
            if (enemy.id === data.enemyId) {
                enemy.receiveEnemyMovment(data.movementVector, data.chasingPlayerId, data.x, data.y);
            }
        });
    }

    setUpEnemyCollisions() {
        this.enemies.forEach((enemy) => {

            // Emeny hits 
            this.physics.add.overlap(enemy.sprite, this.localPlayer.sprite, () => {
                if (enemy && this.localPlayer.health > 0) {
                    let damage = 50;
                    this.localPlayer.getHit(damage);
                    this.checkPlayerStatus();
                    this.sendMessage({
                        type: 'PlayerHit',
                        damage: damage,
                        playerId: this.playerRole,
                    });
                }
            });

            // Repote player hit
            this.physics.add.overlap(enemy.sprite, this.remotePlayer.sprite);

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
            this.physics.add.overlap(enemy.sprite, this.lucy.attackHitbox, () => {
                if (enemy?.weakened && this.lucy.isAttacking) {
                    enemy.die();
                    enemy.isDead = true;
                    enemy = null;
                }
            });
        });
    }

    setUpLibraryCollision() {
        this.libreria = new Platform(this, 'lib', 4000, 208, 100, 150, 'lib');
        this.libreria.sprite.setDepth(2);
        this.physics.add.overlap(this.libreria.sprite, this.localPlayer.sprite, () => {
            this.sendMessage({
                type: 'PlayersWin',
            });
            this.scene.stop();
            this.scene.start('EndScene');
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
        }).setOrigin(0.5).setScrollFactor(0);

        this.createMenuButton();
    }


    handleGameOver() {
        this.gameEnded = true;
        this.physics.pause();

        this.add.text(400, 250, 'Game Over', {
            fontSize: '48px',
            color: '#ff0000'
        }).setOrigin(0.5).setScrollFactor(0);

        this.createMenuButton();
        this.createRetryButton();
    }

    handlePlayersWin() {
        this.scene.stop();
        this.scene.start('EndScene');
    }

    createRetryButton() {
        const retryBtn = this.add.text(400, 350, 'Retry', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5)
            .setScrollFactor(0)
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
            .setScrollFactor(0)
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