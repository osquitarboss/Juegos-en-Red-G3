export class Player {

    constructor(scene, id, x, y, gravity) {
        this.id = id;
        this.scene = scene;
        

        this.baseHeight = 50;
        this.baseWidth = 50;
        this.baseSpeed = 300;
        this.canJump = false;
        this.health = 100;
        this.invulnerable = false;

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0x00ff00);
        graphics.fillRect(0, 0, this.baseWidth, this.baseHeight);
        graphics.generateTexture(`player-${id}`, this.baseWidth, this.baseHeight);
        graphics.destroy();

        
        this.sprite = this.scene.physics.add.sprite(x, y, `player-${id}`);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.allowGravity = true;
        this.sprite.body.setGravityY(gravity);
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
}