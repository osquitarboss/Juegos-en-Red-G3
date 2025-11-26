import { Animator } from "../Components/Animator";

export class Player {

    constructor(scene, id, x, y, gravity, xPos, yPos, spriteSheet = null) {
        this.id = id;
        this.scene = scene;
        this.gravity = gravity;
        this.baseHeight = 0.15;
        this.baseWidth = 0.15;
        this.baseSpeed = 300;
        this.jumpForce = 450; 
        this.health = 100;
        this.invulnerable = false;
        this.authority = 'LOCAL';
        this.xPos = xPos;
        this.yPos = yPos;

        this.action = null;

        this.currentDirection = 'idle';
        this.currentAnim = null;

        this.animator = new Animator(this.scene, spriteSheet)        
    }

    preload(width, height) {
        this.animator.preload(width, height);
    }

    create() {
        // Crear las animaciones del jugador aquí
        this.sprite = this.animator.assignSpriteToPlayer(this.xPos, this.yPos);
        this.animator.createAnimation('idle', 0, 3, 5);
        this.animator.createAnimation("walk", 4, 7, 5);
        this.animator.createAnimation("jump", 8, 10, 5, 0);

        this.sprite.on("animationcomplete", (anim) => {
            if (anim.key === "jump") {               
                if (this.sprite.body.onFloor()) {
                    this.playAnim("idle");
                } 
                else {
                    this.currentAnim = null;
                    this.sprite.anims.stop();
                    this.sprite.setFrame(anim.frames.at(0).frame);
                }
            }
        });

        this.sprite.setScale(this.baseWidth, this.baseHeight);

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;
        this.sprite.body.setGravityY(this.gravity);
        this.sprite.body.setSize(this.sprite.width - 300, this.sprite.height - 270);
        this.sprite.body.setOffset(150, 270);
        
        this.sprite.play("idle");
    }

    playAnim(key) {
        if (this.currentAnim !== key) {
            this.sprite.play(key, true);
            this.currentAnim = key;
        }
    }

    horizontalMove(direction) {

        this.currentDirection = direction;
        this.sprite.flipX = (direction === 'left');

        // Mover
        this.sprite.setVelocityX(direction === 'left' ? -this.baseSpeed : this.baseSpeed);

        
        if (this.sprite.body.onFloor() && this.currentAnim !== "jump") {
            this.playAnim("walk");
        }
    }

    jump() {
        if (this.canJump()) {

            this.sprite.setVelocityY(-this.jumpForce);
            this.playAnim("jump");
        }
    }

    idle() {
        this.sprite.setVelocityX(0);
        // No poner idle si estás en el aire
        if (this.sprite.body.onFloor() && this.currentAnim !== "jump") {
            this.playAnim("idle");
            this.currentDirection = 'idle';
        }
    }


    getHit(damage) {

        if (this.invulnerable) return;

        this.health -= damage;
        this.invulnerable = true;
        this.sprite.setTint(0xff0000);  // Rojo
        
        if (!this.checkAlive()) {
            this.baseSpeed = 0;
            this.sprite.setTint(0xff00ff); // Magenta
            this.sprite.anims.pause();
            return;
        }

    // Volver vulnerable tras 2 segundos
        this.scene.time.delayedCall(2000, () => {
            this.invulnerable = false;
            this.sprite.clearTint();
        });
    }

    checkAlive() {
        return this.health > 0;
    }

    canJump() {
        return this.sprite.body.onFloor() && this.checkAlive();
    }
}