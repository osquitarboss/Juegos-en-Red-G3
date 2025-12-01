import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Lucy } from "../entities/Lucy.js";
import { Light } from "../entities/Light.js";
import { InputManager } from "../handlers/InputManager.js";
import { Enemy } from "../entities/Enemy.js";
import { CommandProcessor } from "../command-pattern/CommandProcessor.js";
import { Camera } from "../Components/Camera.js";

export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
        
    }

    init() {
        this.commandProcessor = new CommandProcessor();
        this.players = new Map();
        this.isPaused = false;
        this.inputManager = new InputManager(this, this.scene, this.input, this.commandProcessor);
        this.arthur = new Player(this, 'player1', 50, 300, 600, 100, 100, 'spritesheet-arthur');
        this.light = new Light(this, 'light1', this.arthur, 75, 0xffffff)
        this.arthur.action = this.light;

        this.lucy = new Lucy(this, 'player2', 750, 300, 300, 300, 100, 'spritesheet-lucy');

        this.enemy1 = new Enemy(this, 'enemy1', 400, 100, this.arthur);
        this.enemies = [this.enemy1];

        this.camera = new Camera(this, this.players);
        
    }

    preload() {
        this.arthur.preload(600, 800);
        this.lucy.preload(600, 800);

        for (let enemy of this.enemies) {
            enemy.preload();
        }
        this.load.image('fondo', 'assets/FondoHorizontal.png');
    }

    create() {
        
        

        this.fondo = this.add.tileSprite(0, 0, 8000, 2000, 'fondo')
            .setOrigin(0, 0)
            .setScrollFactor(0.2)
            .setScale(0.3);
        
        //Create tplayers and enemies 
        this.arthur.create();
        this.lucy.create();
        this.arthur.action.create(); // Create de la luz
    
        for (let enemy of this.enemies) {
            enemy.create();
        }

        // Set up input and players - IMPORTANTE: poblamos el Map ANTES de crear colisiones
        this.players.set('player1', this.arthur);
        this.players.set('player2', this.lucy);
        this.inputManager.players = this.players;

        // Ahora sí creamos las colisiones con el Map ya poblado
        this.setUpWorldCollisions();
        this.setUpEnemyCollisions();
        this.setUpReviveCollision();

        this.physics.world.setBounds(0, 0, 10000, 600);
        this.camera.camera.setBounds(0, 0, 10000, 600);


        // Cosa opcional de suavizado
        this.camera.camera.setLerp(0.1, 0.1);
    }

    setUpReviveCollision() {
        this.physics.add.overlap(this.players.get('player1').sprite, this.players.get('player2').sprite, () => {
            if (this.players.get('player1').health <= 0 && this.players.get('player2').health > 0) {
                this.players.get('player1').revive();
            } else if (this.players.get('player2').health <= 0 && this.players.get('player1').health > 0) {
                this.players.get('player2').revive();
            }
        });
    }

    setUpWorldCollisions() {
        //Set up platforms and collisions

        const plataformas = this.physics.add.staticGroup();
        
        const suelo1 = this.add.rectangle(400, 580, 800, 40, 0xffffff);
        const suelo2 = this.add.rectangle(200, 450, 200, 30, 0xffffff);

        this.physics.add.existing(suelo1, true);
        this.physics.add.existing(suelo2, true);
        
        plataformas.add(suelo1);
        plataformas.add(suelo2);

        for (let player of this.players.values()) {
            this.physics.add.collider(player.sprite, plataformas);
        }

        for (let enemy of this.enemies) {
            this.physics.add.collider(enemy.sprite, plataformas);
        }
    }

    setUpEnemyCollisions() {
        this.physics.add.collider(this.enemies[0].sprite, this.players.get('player1').sprite, () => {
            this.arthur.getHit(50);
        });

        this.physics.add.overlap(this.enemies[0].sprite, this.light.colliderCircle, () => { // Hacemos que el enemigo se debilite si la luz está activa pero q despues de un tiempo vuelva a la normalidad
            if (this.light.isOn) {
                this.enemies[0]?.setWeakened(true);
                this.time.delayedCall(2000, () => {
                    this.enemies[0]?.setWeakened(false);
                });
            }
        });

        this.physics.add.overlap(this.enemies[0].sprite, this.players.get('player2').attackHitbox, () => {
            if (this.enemies[0]?.weakened && this.players.get('player2').isAttacking) {
                this.enemies[0].die();
                this.enemies[0] = null;
            }
        });

    }

    update() {
        this.fondo.tilePositionX = this.cameras.main.scrollX * 0.2;

        this.camera.update();
        this.inputManager.update();
        
       
        this.light.update();
        this.enemies = this.enemies.filter(enemy => {
            if (!enemy) return false;
            enemy.update();
            return true;
        });
    }
}
