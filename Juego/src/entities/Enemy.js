import { Animator } from "../Components/Animator";

export class Enemy {
    constructor(scene, id, x, y, player) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.player = player;
        this.id = id;
        this.baseHeight = 0.17;
        this.baseWidth = 0.17;
        this.baseSpeed = 100;


        this.weakened = false;

        this.animator = new Animator(this.scene, 'spritesheet-enemigo');
    }

    preload() {
        this.animator.preload(600, 800);
    }
 
    create() {
        
        this.sprite = this.animator.assignSpriteToPlayer(this.x, this.y);
        this.animator.createAnimation(`idle-black-${this.id}`, 0, 2, 5);
        this.animator.createAnimation(`idle-white-${this.id}`, 3, 5, 5);
        this.animator.createAnimation(`black-to-white-${this.id}`, 6, 8, 8,0);
        this.animator.createAnimation(`white-to-black-${this.id}`, 6, 8, 8,0);
        this.animator.createAnimation(`die-${this.id}`, 9, 11, 8,0);

        this.sprite.on("animationcomplete", (anim) => {
            if (anim.key === `die-${this.id}`) {               
                this.sprite.destroy();
            }
        });

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
        this.sprite.body.setGravityY(500);
        this.sprite.setDepth(10);
        this.sprite.setScale(this.baseWidth, this.baseHeight);
        this.sprite.body.setSize(this.sprite.width - 300, this.sprite.height - 270);

        this.sprite.anims.play(`idle-black-${this.id}`);
    }
    enemyMovement() {
        // move towards the player
        this.sprite.flipX = this.player.sprite.x < this.sprite.x;

        if (this.weakened || Math.abs(this.player.sprite.x - this.sprite.x) > 500 || Math.abs(this.player.sprite.y - this.sprite.y) > 500){ // Comprobamos que no esté muy lejos
            this.baseSpeed = 0;
        } else {
            this.baseSpeed = 100;
        }


        this.scene.physics.moveToObject(this.sprite, this.player.sprite, this.baseSpeed);
    }

    die() {
        this.sprite.setVelocity(0);
        this.sprite.anims.play(`die-${this.id}`);
    }


    setWeakened(value) {
        this.weakened = value;
        if (value) {
            this.sprite.anims.play(`black-to-white-${this.id}`);

            this.sprite.once("animationcomplete", (anim) => {
                if (anim.key === `black-to-white-${this.id}`) {
                    this.sprite.anims.play(`idle-white-${this.id}`);
                }   
            });
        } else {
            
            this.sprite.anims.play(`idle-black-${this.id}`);
                }   
          
    }

    
    update() {
        this.enemyMovement();
    }
}