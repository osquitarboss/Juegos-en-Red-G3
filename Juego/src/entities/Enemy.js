export class Enemy {
    constructor(scene, id, x, y, player) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.player = player;

        this.baseHeight = 50;
        this.baseWidth = 50;
        this.baseSpeed = 100;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xff0000);
        graphics.fillRect(0, 0, this.baseWidth, this.baseHeight);
        graphics.generateTexture(`enemy-${id}`, this.baseWidth, this.baseHeight);
        graphics.destroy();

        this.sprite = this.scene.physics.add.sprite(x, y, `enemy-${id}`);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = false;
        this.sprite.body.setGravityY(500);
    }

    enemyMovement() {
        // move only horizontally towards the player
        const targetX = this.player.sprite.x;
        const enemyX = this.sprite.x;
        const dx = targetX - enemyX;

        const targetY = this.player.sprite.y;
        const enemyY = this.sprite.y;
        const dy = targetY - enemyY;

        // parar al llegar cerca
        if (Math.abs(dx) < 4) {
            this.sprite.setVelocityX(0);
            return;
        }

        if (Math.abs(dy) < 4) {
            this.sprite.setVelocityY(0);
            return;
        }
        
        const dirX = Math.sign(dx);
        const dirY = Math.sign(dy);
        this.sprite.setVelocityX(dirX * this.baseSpeed);
        this.sprite.setVelocityY(dirY * this.baseSpeed);
    }

    update() {
        this.enemyMovement();
    }
}