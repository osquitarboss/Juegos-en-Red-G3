import { Animator } from "../Components/Animator";

export class Player {

    constructor(scene, id, x, y, gravity, xPos, yPos, spriteSheet = null) {
        this.id = id;
        this.scene = scene;
        this.gravity = gravity;
        this.baseHeight = 0.15;
        this.baseWidth = 0.15;
        this.baseSpeed = 300;
        this.health = 100;
        this.invulnerable = false;
        this.authority = 'LOCAL';
        this.xPos = xPos;
        this.yPos = yPos;
        this.action = null;

        this.animator = new Animator(this.scene, spriteSheet);        
    }

    preload(width, height) {
        this.animator.preload(width, height);
    }

    create() {
        // Crear las animaciones del jugador aquí
        this.sprite = this.animator.assignSpriteToPlayer(this.xPos, this.yPos);
        this.animator.createAnimation('idle', 0, 2, 5);
        this.animator.createAnimation("walk", 3, 6, 5)

        this.sprite.setScale(this.baseWidth, this.baseHeight);

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;
        this.sprite.body.setGravityY(this.gravity);
        this.sprite.body.setSize(this.sprite.width - 300, this.sprite.height - 270);
        this.sprite.body.setOffset(150, 270);
        
        this.sprite.play('walk', true);
    }

    getHit(damage) {
        this.health -= damage;
        this.invulnerable = true;
        this.sprite.setTint(0xff0000);  // Rojo
        
        if (!this.checkAlive()) {
            this.baseSpeed = 0;
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
        return this.sprite.body.touching.down;
    }
}