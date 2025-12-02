import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Light } from "../entities/Light.js";
import { InputManager } from "../handlers/InputManager.js";
import { Enemy } from "../entities/Enemy.js";
import { CommandProcessor } from "../command-pattern/CommandProcessor.js";
import { Camera } from "../Components/Camera.js";
import { Platform } from "../entities/Platform.js";


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
    }
    
    init() {
        this.commandProcessor = new CommandProcessor();
        this.players = new Map();
        this.enemies = new Map();
        this.platforms = new Map();
        this.isPaused = false;
        this.inputManager = new InputManager(this, this.scene, this.input, this.commandProcessor);
        this.arthur = new Player(this, 'player1', 50, 300, 600, 100, 100, 'spritesheet-arthur');
        this.light = new Light(this, 'light1', this.arthur, 75, 0xffffff)
        this.arthur.action = this.light;

        this.lucy = new Player(this, 'player2', 750, 300, 300, 300, 100, 'spritesheet-lucy');

        this.enemy1 = new Enemy(this, 'enemy1', 400, 100, this.arthur);

        this.camera = new Camera(this, this.players);

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

        this.enemies.set('enemy1', this.enemy1)

        this.setUpWorldCollisions();
        this.setUpEnemyCollisions();

        this.physics.world.setBounds(0, 0, 10000, 600);
        this.camera.camera.setBounds(0, 0, 10000, 600);

        this.camera.camera.setLerp(0.1, 0.1);

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
        this.physics.add.collider(this.enemy1.sprite, this.players.get('player1').sprite, () => {
            this.arthur.getHit(50);
        });
    }

    update() {
        this.fondo.tilePositionX = this.cameras.main.scrollX * 0.2;

        this.camera.update();
        this.inputManager.update();
        
        this.light.update();
        //this.enemy1.update();
    }
}