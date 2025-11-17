import Phaser from "phaser";
import { Player } from "../entities/Player.js";
import { InputManager } from "../handlers/InputManager.js";
import { Enemy } from "../entities/Enemy.js";

export class GameScene extends Phaser.Scene{
    constructor() {
        super('GameScene')
    }

    init() {
        this.players = new Map();
        this.isPaused = false;
        this.inputManager = new InputManager(this, this.input);

        this.arthur = new Player(this, 'player1', 50, 300, 600);
        this.lucy = new Player(this, 'player2', 750, 300, 500);

        this.enemy1 = new Enemy(this, 'enemy1', 400, 100, this.arthur);
    }

    create() {
        // Set up input and players
        this.players.set('player1', this.arthur);
        this.players.set('player2', this.lucy);
        this.inputManager.players = this.players;

        //Set up platforms and collisions

        const plataformas = this.physics.add.staticGroup();
        
        const suelo1 = this.add.rectangle(400, 580, 800, 40, 0xffffff);
        const suelo2 = this.add.rectangle(200, 450, 200, 30, 0xffffff);

        this.physics.add.existing(suelo1, true);
        this.physics.add.existing(suelo2, true);
        
        plataformas.add(suelo1);
        plataformas.add(suelo2);

        this.physics.add.collider(this.players.get('player1').sprite, plataformas, () => {
            this.players.get('player1').canJump = true;
        });
        this.physics.add.collider(this.players.get('player2').sprite, plataformas, () => {
            this.players.get('player2').canJump = true;
        });
        this.physics.add.collider(this.enemy1.sprite, plataformas);
    }


    update() {
        this.inputManager.update();
        this.enemy1.update();
    }
}
