import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { Light } from "../entities/Light.js";
import { InputManager } from "../handlers/InputManager.js";
import { Enemy } from "../entities/Enemy.js";
import { CommandProcessor } from "../command-pattern/CommandProcessor.js";

export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
        this.commandProcessor = new CommandProcessor();
    }

    init() {
        this.players = new Map();
        this.isPaused = false;
        this.inputManager = new InputManager(this, this.input, this.commandProcessor);

        this.arthur = new Player(this, 'player1', 50, 300, 600, 100, 100, 'spritesheet-arthur');
        this.light = new Light(this, 'light1', this.arthur, 75, 0xffffff)

        this.arthur.action = this.light;

        // Cambiatr a Lucy con otro sprite cuando esté disponible !!!!!!!!!!!!!!!!!!!
        this.lucy = new Player(this, 'player2', 750, 300, 300, 300, 100, 'spritesheet-arthur');
        //this.lucy = new Player(this, 'player2', 750, 300, 300, 300, 100, 'spritesheet-lucy');

        this.enemy1 = new Enemy(this, 'enemy1', 400, 100, this.arthur);
    }

    preload() {
        this.arthur.preload(600, 800);
        this.lucy.preload(600, 800);
    }

    create() {
        //Create the animations 
        this.arthur.create();
        this.lucy.create();
        // Set up input and players
        this.players.set('player1', this.arthur);
        this.players.set('player2', this.lucy);
        this.inputManager.players = this.players;

        /*this.light = this.add.graphics();
        this.light.fillStyle(0xff0000, 0.5); // color + alpha
        this.light.fillCircle(0, 0, 50); // radio del círculo

        this.lightOn = false;

        this.keyF = this.input.keyboard.addKey('F');*/

        this.setUpWorldCollisions();
        this.setUpEnemyCollisions();

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

        this.physics.add.collider(this.enemy1.sprite, plataformas);
    }

    setUpEnemyCollisions() {
        this.physics.add.collider(this.enemy1.sprite, this.players.get('player1').sprite, () => {
            this.arthur.getHit(50);
        });

    }

    update() {
        this.inputManager.update();
        
       
        this.light.update();
        this.enemy1.update();
    }
}
