import Phaser from "phaser";
import { InputManager } from "../handlers/InputManager.js";
import { Enemy } from "../entities/Enemy.js";
import { CommandProcessor } from "../command-pattern/CommandProcessor.js";
import { Camera } from "../Components/Camera.js";
import { Platform } from "../entities/Platform.js";
import { Lucy } from "../entities/Lucy.js";
import { Arthur } from "../entities/Arthur.js";


export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    preload() {
        this.arthur.preload(600, 800);
        this.lucy.preload(600, 800);

        this.load.image('fondo', 'assets/FondoHorizontal.png');
        this.load.image('p1', 'assets/plataforma1.png');
        this.load.image('suelo', 'assets/suelo.png');
        this.load.image('p2', 'assets/plataforma2.png');
        this.load.image('c1', 'assets/columna1.png');

        this.enemies.forEach(enemy =>  enemy.preload() );
    }
    
    init() {
        this.commandProcessor = new CommandProcessor();
        this.players = new Map();
        this.enemies = new Map();
        this.platforms = new Map();
        this.isPaused = false;
        this.inputManager = new InputManager(this, this.scene, this.input, this.commandProcessor);
        this.arthur = new Arthur(this, 'player1', 50, 300, 600, 100, 100, 'spritesheet-arthur');
        
        

        this.lucy = new Lucy(this, 'player2', 750, 300, 300, 300, 100, 'spritesheet-lucy');

        this.enemy1 = new Enemy(this, 'enemy1', 400, 100, this.players);

        this.camera = new Camera(this, this.players);

        this.enemies.set(this.enemy1.id, this.enemy1);

    }

    create() {

        this.fondo = this.add.tileSprite(0, 0, 8000, 2000, 'fondo')
            .setOrigin(0, 0)
            .setScrollFactor(0.2)
            .setScale(0.3);
        
        //Create the animations 
        this.arthur.create();
        this.lucy.create();

        // Set up input and players
        this.players.set('player1', this.arthur);
        this.players.set('player2', this.lucy);
        
        this.inputManager.players = this.players;

        // Set up de enemies
        this.enemies.forEach( (enemy) => {
            enemy.create();
        });

        this.setUpWorldCollisions();
        this.setUpEnemyCollisions();
        this.setUpReviveCollision();

        this.physics.world.setBounds(0, 0, 10000, 600);
        this.camera.camera.setBounds(0, 0, 10000, 600);

        this.camera.camera.setLerp(0.1, 0.1);

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

        this.suelo1 = new Platform(this, 'suelo', 200, 590, 600, 40, 'suelo');
        this.suelo2 = new Platform(this, 'p1', 200, 450, 200, 30, 'p1');
        this.suelo3 = new Platform(this, 'p2', 450, 300, 200, 30, 'p1');
        this.suelo4 = new Platform(this, 'p3', 1200, 550, 500, 200, 'p2');
        this.col1 = new Platform(this, 'c1', 700, 450, 50, 300, 'c1');

        this.platforms.set('suelo', this.suelo1);
        this.platforms.set('p1', this.suelo2);
        this.platforms.set('p2', this.suelo3);
        this.platforms.set('p3', this.suelo4);
        this.platforms.set('c1', this.col1);

        this.platforms.forEach(p => {
            this.players.forEach(personaje => {
                this.physics.add.collider(personaje.sprite, p.sprite);
            });
            this.enemies.forEach(enemigo => {
                this.physics.add.collider(enemigo.sprite, p.sprite);
            });
        });
    }

    setUpEnemyCollisions() {
        this.enemies.forEach((enemy) => {
            
            this.physics.add.collider(enemy.sprite, this.players.get('player1').sprite, () => {
                if (enemy &&  this.players.get('player1').health > 0) {
                    this.players.get('player1').getHit(50);
                }
            });
            
            this.physics.add.collider(enemy.sprite, this.players.get('player2').sprite, () => {
                if (enemy &&  this.players.get('player2').health > 0) {
                     this.players.get('player2').getHit(50);
                }
            });

            
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

            this.physics.add.overlap(enemy.sprite, this.players.get('player2').attackHitbox, () => {
                if (enemy?.weakened && this.players.get('player2').isAttacking) {
                    enemy.die();
                    enemy.isDead = true;
                    enemy = null;
                }
            });
        });
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
}