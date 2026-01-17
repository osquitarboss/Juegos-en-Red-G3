import { Animator } from "../Components/Animator";

export class Enemy {
    constructor(scene, id, x, y, players) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.players = players;
        this.id = id;
        this.baseHeight = 0.17;
        this.baseWidth = 0.17;
        this.baseSpeed = 100;
        this.isDead = false;

        this.weakened = false;
        this.chasingPlayerId = null;

        this.animator = new Animator(this.scene, 'spritesheet-enemigo');
    }

    preload() {
        this.animator.preload(600, 800);
    }

    create() {

        this.sprite = this.animator.assignSpriteToPlayer(this.x, this.y);
        this.animator.createAnimation(`idle-black-${this.id}`, 0, 2, 5);
        this.animator.createAnimation(`idle-white-${this.id}`, 3, 5, 5);
        this.animator.createAnimation(`black-to-white-${this.id}`, 6, 8, 8, 0);
        this.animator.createAnimation(`white-to-black-${this.id}`, 6, 8, 8, 0);
        this.animator.createAnimation(`die-${this.id}`, 9, 11, 8, 0);

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
        this.pickPlayer();

        // Obtenemos la dirección hacia el jugador
        const dx = this.players.get(this.chasingPlayerId).sprite.x - this.sprite.x;
        const dy = this.players.get(this.chasingPlayerId).sprite.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // move towards the player
        this.sprite.flipX = this.players.get(this.chasingPlayerId).sprite.x < this.sprite.x;

        if (this.weakened || Math.abs(this.players.get(this.chasingPlayerId).sprite.x - this.sprite.x) > 500 || Math.abs(this.players.get(this.chasingPlayerId).sprite.y - this.sprite.y) > 500) { // Check if the player is too far away
            this.baseSpeed = 0;
        } else {
            this.baseSpeed = 100;
        }

        // Calculamos el vector normalizado y aplicamos velocidad
        if (distance > 25 && this.baseSpeed > 0) {
            this.movementVector = {
                x: dx / distance,
                y: dy / distance
            };
            this.sprite.setVelocityX(this.movementVector.x * this.baseSpeed);
            this.sprite.setVelocityY(this.movementVector.y * this.baseSpeed);
        } else {
            this.movementVector = { x: 0, y: 0 };
            this.sprite.setVelocity(0);
        }

    }

    receiveEnemyMovment(movementVector, playerId, x, y) {
        const targetPlayer = this.players.get(playerId);
        if (!targetPlayer || !targetPlayer.sprite) return;

        this.sprite.flipX = targetPlayer.sprite.x < this.sprite.x;

        if (this.weakened || Math.abs(targetPlayer.sprite.x - this.sprite.x) > 500 || Math.abs(targetPlayer.sprite.y - this.sprite.y) > 500) { // Check if the player is too far away
            this.baseSpeed = 0;
        } else {
            this.baseSpeed = 100;
        }

        // Sync local position with host position to fix drift
        if (x !== undefined && y !== undefined) {
            if (Math.abs(this.sprite.x - x) > 10 || Math.abs(this.sprite.y - y) > 10) {
                this.sprite.setPosition(x, y);
            }
        }

        this.movementVector = movementVector;
        this.sprite.setVelocityX(this.movementVector.x * this.baseSpeed);
        this.sprite.setVelocityY(this.movementVector.y * this.baseSpeed);
    }

    pickPlayer() {
        const p1 = this.players.get('player1');
        const p2 = this.players.get('player2');

        if (!p1 || !p2 || !p1.sprite || !p2.sprite) return; // Validación de seguridad

        this.chasingPlayerId = (Math.abs(p1.sprite.x - this.sprite.x)) > (Math.abs(p2.sprite.x - this.sprite.x)) ? 'player2' : 'player1';

        const target = this.players.get(this.chasingPlayerId);
        if (target && target.health <= 0) {
            if (this.chasingPlayerId === 'player1') {
                this.chasingPlayerId = 'player2';
            } else {
                this.chasingPlayerId = 'player1';
            }
        }
    }

    die() {
        this.sprite.setVelocity(0);
        this.sprite.anims.play(`die-${this.id}`);
    }


    setWeakened(value) {
        this.weakened = value;
        if (value) {
            this.sprite.anims.play(`black-to-white-${this.id}`);

            this.sprite.on("animationcomplete", (anim) => {
                if (anim.key === `black-to-white-${this.id}`) {
                    this.sprite.anims.play(`idle-white-${this.id}`);
                }
            });
        } else {

            this.sprite.anims.play(`idle-black-${this.id}`);
        }

    }

    update() {
        if (this.isDead) return;
        this.enemyMovement();
    }
}