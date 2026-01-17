import Phaser from "phaser";
import { InputManager } from "../handlers/InputManager.js";
import { Enemy } from "../entities/Enemy.js";
import { CommandProcessor } from "../command-pattern/CommandProcessor.js";
import { Camera } from "../Components/Camera.js";
import { Platform } from "../entities/Platform.js";
import { Lucy } from "../entities/Lucy.js";
import { Arthur } from "../entities/Arthur.js";
import { connectionManager } from "../services/ConnectionManager.js";
import { clientDataManager } from "../services/clientDataManager.js";


export class GameScene extends Phaser.Scene {
    constructor(name = 'GameScene') {
        super(name)
    }


    preload() {
        this.arthur.preload(300, 400);
        this.lucy.preload(300, 400);
        this.load.audio('ambient', 'assets/sound/ambient-theme.mp3');


        this.load.image('fondo', 'assets/FondoHorizontal.png');
        this.load.image('p1', 'assets/props/plataforma1.png');
        this.load.image('suelo', 'assets/props/suelo.png');
        this.load.image('p2', 'assets/props/plataforma2.png');
        this.load.image('c1', 'assets/props/columna1.png');
        this.load.image('lib', 'assets/props/libreria.png');

        this.enemies.forEach(enemy => enemy.preload());
    }

    init() {
        this.sound.stopAll();
        this.commandProcessor = new CommandProcessor();
        this.players = new Map();
        this.enemies = new Map();
        this.platforms = new Map();
        this.isPaused = false;
        this.inputManager = new InputManager(this, this.scene, this.input, this.commandProcessor);
        this.arthur = new Arthur(this, 'player1', 600, 100, 500, 'spritesheet-arthur-reescalado-mitad');
        this.lucy = new Lucy(this, 'player2', 450, 300, 500, 'spritesheet-lucy-reescalado-mitad');

        this.enemy1 = new Enemy(this, 'enemy1', 400, 100, this.players);
        this.enemy2 = new Enemy(this, 'enemy2', 1200, 100, this.players);
        this.enemy3 = new Enemy(this, 'enemy3', 2000, 100, this.players);
        this.enemy4 = new Enemy(this, 'enemy4', 2800, 100, this.players);
        this.enemy5 = new Enemy(this, 'enemy5', 3500, 100, this.players);


        this.camera = new Camera(this, this.players);

        this.enemies.set(this.enemy1.id, this.enemy1);
        this.enemies.set(this.enemy2.id, this.enemy2);
        this.enemies.set(this.enemy3.id, this.enemy3);
        this.enemies.set(this.enemy4.id, this.enemy4);
        this.enemies.set(this.enemy5.id, this.enemy5);

    }

    create() {
        // Music
        this.music = this.sound.add('ambient');
        this.music.play();
        this.music.setVolume(0.25);

        // Background
        this.fondo = this.add.tileSprite(0, 0, 8000, 2000, 'fondo')
            .setOrigin(0, 0)
            .setScrollFactor(0.2)
            .setScale(0.3);

        //Create the players 
        this.arthur.create();
        this.lucy.create();

        // Set up input and players
        this.players.set('player1', this.arthur);
        this.players.set('player2', this.lucy);

        this.inputManager.players = this.players;
        this.commandProcessor.players = this.players;

        // Set up enemies
        this.enemies.forEach((enemy) => {
            enemy.create();
        });

        this.setUpWorldCollisions();
        this.setUpEnemyCollisions();
        this.setUpReviveCollision();
        this.setUpLibraryCollision();

        this.physics.world.setBounds(0, 0, 4175, 600);
        this.camera.camera.setBounds(0, 0, 4175, 600);

        this.camera.camera.setLerp(0.1, 0.1);

        this.connectionListener = (data) => {
            if (!data.connected && this.scene.isActive()) {
                this.onConnectionLost();
            }
        };
        connectionManager.addListener(this.connectionListener);
    }

    setUpReviveCollision() {
        this.physics.add.overlap(this.players.get('player1').sprite, this.players.get('player2').sprite, () => {
            if (this.players.get('player1').health <= 0 && this.players.get('player2').health > 0) {
                this.players.get('player1').revive();
            }
            else if (this.players.get('player2').health <= 0 && this.players.get('player1').health > 0) {
                this.players.get('player2').revive();
            }
        });
    }

    setUpWorldCollisions() {
        //Set up platforms and collisions

        this.suelo1 = new Platform(this, 's1', 2500, 590, 5000, 40, 'suelo');
        this.plat1 = new Platform(this, 'p1', 200, 450, 200, 30, 'p1');
        this.plat2 = new Platform(this, 'p2', 450, 300, 200, 30, 'p1');
        this.suelo2 = new Platform(this, 's2', 1200, 550, 500, 200, 'p2');
        this.col1 = new Platform(this, 'c1', 700, 450, 70, 300, 'c1');
        this.col2 = new Platform(this, 'c2', 2200, 450, 70, 400, 'c1');
        this.plat3 = new Platform(this, 'p3', 1800, 450, 150, 30, 'p1');
        this.plat4 = new Platform(this, 'p4', 1500, 300, 150, 30, 'p1');
        this.plat5 = new Platform(this, 'p5', 2000, 200, 150, 30, 'p1');
        this.suelo3 = new Platform(this, 's3', 2200, 550, 230, 100, 'p2');
        this.suelo4 = new Platform(this, 's4', 2800, 500, 550, 250, 'p2');
        this.plat6 = new Platform(this, 'p6', 3150, 250, 150, 30, 'p1');
        this.plat7 = new Platform(this, 'p7', 3500, 250, 150, 30, 'p1');
        this.plat8 = new Platform(this, 'p8', 3150, 450, 150, 30, 'p1');
        this.suelo5 = new Platform(this, 's5', 4001, 450, 350, 350, 'p2');


        this.platforms.set('s1', this.suelo1);
        this.platforms.set('p1', this.plat1);
        this.platforms.set('p2', this.plat2);
        this.platforms.set('s2', this.suelo2);
        this.platforms.set('c1', this.col1);
        this.platforms.set('c2', this.col2);
        this.platforms.set('p3', this.plat3);
        this.platforms.set('p4', this.plat4);
        this.platforms.set('p5', this.plat5);
        this.platforms.set('s3', this.suelo3);
        this.platforms.set('s4', this.suelo4);
        this.platforms.set('s5', this.suelo5);
        this.platforms.set('p6', this.plat6);
        this.platforms.set('p7', this.plat7);
        this.platforms.set('p8', this.plat8);

        this.platforms.forEach(p => {
            this.players.forEach(personaje => {
                this.physics.add.collider(personaje.sprite, p.sprite);
            });
            this.enemies.forEach(enemigo => {
                this.physics.add.collider(enemigo.sprite, p.sprite);
            });
        });

        
    }

    setUpLibraryCollision() {
        this.libreria = new Platform(this, 'lib', 4000, 208, 100, 150, 'lib');
        this.libreria.sprite.setDepth(2);
        this.physics.add.overlap(this.libreria.sprite, this.arthur.sprite, () => {
            this.scene.stop();
            this.scene.start('EndScene');
        });
        this.physics.add.overlap(this.libreria.sprite, this.lucy.sprite, () => {
            this.scene.stop();
            this.scene.start('EndScene');
        });
    }

    setUpEnemyCollisions() {
        this.enemies.forEach((enemy) => {

            // Emeny hits 
            this.physics.add.collider(enemy.sprite, this.players.get('player1').sprite, () => {
                if (enemy && this.players.get('player1').health > 0) {
                    this.players.get('player1').getHit(50);
                    this.checkPlayerStatus();
                }
            });

            this.physics.add.collider(enemy.sprite, this.players.get('player2').sprite, () => {
                if (enemy && this.players.get('player2').health > 0) {
                    this.players.get('player2').getHit(50);
                    this.checkPlayerStatus();
                }
            });

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

    checkPlayerStatus() {
        if (this.players.get('player1').health <= 0 && this.players.get('player2').health <= 0) {
            clientDataManager.updateClientDeaths(clientDataManager.deaths + 1);
            clientDataManager.updateClientData({ deaths: clientDataManager.deaths });
            this.scene.stop();
            this.scene.start('GameScene');

        }
    }

    update() {
        this.fondo.tilePositionX = this.cameras.main.scrollX * 0.2;

        this.camera.update();
        this.inputManager.update();

        this.arthur.light.update();

        this.enemies.forEach((enemy) => {
            if (!enemy || enemy.isDead) {
                this.enemies.delete(enemy.id);
                return;
            }
            enemy.update();
        })
    }

    ////////////////// RED //////////////
    onConnectionLost() {
        this.scene.pause();
        this.scene.launch('ConnectionLostScene', { previousScene: 'GameScene' });
    }

}