import { Animator } from "../components/Animator";
import { clientDataManager } from "../services/clientDataManager";

export class Player {

    constructor(scene, id, gravity, xPos, yPos, spriteSheet = null) {
        this.id = id;
        this.scene = scene;
        this.gravity = gravity;
        this.baseHeight = 0.33;
        this.baseWidth = 0.33;
        this.baseSpeed = 300;
        this.jumpForce = 450;
        this.health = 100;
        this.invulnerable = false;
        this.xPos = xPos;
        this.yPos = yPos;
        this.isDead = false;
        this.numDeaths = clientDataManager.deaths;

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
        this.animator.createAnimation(`idle-${this.id}`, 0, 3, 4);
        this.animator.createAnimation(`walk-${this.id}`, 4, 7, 5);
        this.animator.createAnimation(`jump-${this.id}`, 8, 8, 4, 0);
        this.animator.createAnimation(`air-${this.id}`, 9, 10, 1, 0);
        this.animator.createAnimation(`fall-${this.id}`, 10, 10, 1, 0);
        this.animator.createAnimation(`attack-${this.id}`, 12, 13, 2, 0);

        this.sprite.on("animationcomplete", (anim) => {
            if (anim.key === `jump-${this.id}`) {

                if (!this.sprite.body.onFloor()) {
                    this.playAnim(`air-${this.id}`);
                }
            }
        });

        this.sprite.on("animationupdate", (anim) => {
            if (anim.key === `air-${this.id}`) {
                if (this.sprite.body.onFloor()) {
                    this.playAnim(`fall-${this.id}`);
                }
            }
        });

        this.sprite.setScale(this.baseWidth, this.baseHeight);

        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;
        this.sprite.body.setGravityY(this.gravity);
        this.sprite.body.setSize(this.sprite.width - 180, this.sprite.height - 140);
        this.sprite.body.setOffset(75, 135);
        this.sprite.setDepth(5);
        this.sprite.play(`idle-${this.id}`);
    }

    playAnim(key) {
        if (this.currentAnim !== key) {
            this.sprite.play(key, true);
            this.currentAnim = key;
        }
    }

    horizontalMove(direction) {

        if (this.health <= 0) return;
        this.currentDirection = direction;
        this.sprite.flipX = (direction === 'left');

        // Mover
        this.sprite.setVelocityX(direction === 'left' ? -this.baseSpeed : this.baseSpeed);


        if (this.sprite.body.onFloor() && this.currentAnim !== `jump-${this.id}` && this.currentAnim !== `attack-${this.id}`) {
            this.playAnim(`walk-${this.id}`);
        }
    }

    jump() {
        if (this.canJump()) {
            this.sprite.setVelocityY(-this.jumpForce);
            this.playAnim(`jump-${this.id}`);
        }
    }


    idle() {
        this.sprite.setVelocityX(0);
        // No poner idle si estás en el aire
        if (this.sprite.body.onFloor() && this.currentAnim !== `jump-${this.id}` && this.currentAnim !== `fall-${this.id}` && this.currentAnim !== `attack-${this.id}` && !this.isDead) {
            this.playAnim(`idle-${this.id}`);
            this.currentDirection = 'idle';
        }
    }


    getHit(damage) {

        if (this.invulnerable) return;

        this.health -= damage;
        this.invulnerable = true;
        this.sprite.setTint(0x808080);  // Gris

        if (!this.checkAlive()) {
            this.health = 0;
            this.baseSpeed = 0;
            this.sprite.setTint(0x000000);
            this.sprite.anims.pause();
            this.invulnerable = false;
            this.isDead = true;
            this.isAttacking = false;
            this.numDeaths++;
            this.updateDeaths();
            clientDataManager.updateClientDeaths(this.numDeaths);
            return;
        }

        // Volver vulnerable tras 2 segundos
        this.scene.time.delayedCall(2000, () => {
            this.invulnerable = false;
        });
    }

    revive() {
        this.health = 100;
        this.baseSpeed = 300;
        this.isDead = false;
        this.invulnerable = false;
        this.sprite.clearTint();
        this.sprite.anims.resume();
        this.invulnerable = true;
        this.isAttacking = false;
        this.playAnim(`idle-${this.id}`);

        this.scene.time.delayedCall(1000, () => { this.invulnerable = false })
    }

    checkAlive() {
        return this.health > 0;
    }

    canJump() {
        return this.sprite.body.onFloor() && this.checkAlive();
    }

    attack() {
        // Implementar en las clases hijas
    }

    async updateDeaths() {
        await clientDataManager.updateClientData({ deaths: this.numDeaths });
    }
}