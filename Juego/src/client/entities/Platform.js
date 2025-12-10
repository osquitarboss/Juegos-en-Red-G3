export class Platform {
    constructor(scene, id, x, y, width, height, textureKey) {
        this.scene = scene;
        this.id = id;

        this.sprite = scene.add.image(x, y, textureKey);
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setDepth(10);
        this.sprite.setDisplaySize(width, height);

        scene.physics.add.existing(this.sprite, true);
        this.sprite.body.setSize(width, height);

        // Dibujo visual para depurar colisión
        this.g = scene.add.graphics();
        this.g.fillStyle(0x000000, 0.0);
        this.g.fillRect(x - width/2, y - height/2, width - 10, height - 10);
        this.g.setDepth(0);

        this.setUpCollisions();
    }
    
    setUpCollisions(){
        this.scene.physics.add.existing(this.g, true);
    }
}

    
