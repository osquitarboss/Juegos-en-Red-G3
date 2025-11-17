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
        this.sprite.body.allowGravity = true;
        this.sprite.body.setGravityY(500);
    }

    enemyMovment() {
        // move only horizontally towards the player
        const targetX = this.player.sprite.x;
        const enemyX = this.sprite.x;
        const dx = targetX - enemyX;

        // parar al llegar cerca
        if (Math.abs(dx) < 4) {
            this.sprite.setVelocityX(0);
            return;
        }
        
        const dir = Math.sign(dx);
        this.sprite.setVelocityX(dir * this.baseSpeed);
    }

    update() {
        this.enemyMovment();
    }
}