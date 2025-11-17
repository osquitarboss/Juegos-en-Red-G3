export class Player {

    constructor(scene, id, x, y, gravity) {
        this.id = id;
        this.scene = scene;
        

        this.baseHeight = 50;
        this.baseWidth = 50;
        this.baseSpeed = 300;
        this.canJump = false;

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
}