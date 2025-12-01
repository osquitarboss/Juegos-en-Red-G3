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

    }
    
    init() {
        this.commandProcessor = new CommandProcessor();
        this.players = new Map();
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

        this.setUpWorldCollisions();
        this.setUpEnemyCollisions();

        this.physics.world.setBounds(0, 0, 10000, 600);
        this.camera.camera.setBounds(0, 0, 10000, 600);


        // Coso opcional de suavizado
        this.camera.camera.setLerp(0.1, 0.1);
    }

    setUpWorldCollisions() {
        //Set up platforms and collisions

        const plataformas = this.physics.add.staticGroup();
        
        this.suelo1 = new Platform(this, 'suelo', 400, 580, 800, 40, 'suelo');
        this.suelo2 = new Platform(this, 'p1', 200, 450, 200, 30, 'p1');
        //this.physics.add.existing(this.suelo1, true);
        //this.physics.add.existing(suelo2, true);
        
        //plataformas.add(suelo1);
        //plataformas.add(suelo2);
        //tiene q haber una forma de q funcione con el anterior sistema
        this.physics.add.collider(this.arthur.sprite, this.suelo1.sprite);
        this.physics.add.collider(this.lucy.sprite, this.suelo1.sprite);
        this.physics.add.collider(this.enemy1.sprite, this.suelo1.sprite);

        this.physics.add.collider(this.arthur.sprite, this.suelo2.sprite);
        this.physics.add.collider(this.lucy.sprite, this.suelo2.sprite);
        this.physics.add.collider(this.enemy1.sprite, this.suelo2.sprite);

        
        for (let player of this.players.values()) {
            this.physics.add.collider(player.sprite, plataformas);
        }

        this.physics.add.collider(this.enemy1.sprite, plataformas);
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
