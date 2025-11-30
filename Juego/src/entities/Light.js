export class Light {

    constructor(scene, id, player, radius, color) {

        this.id = id;
        this.scene = scene;
        this.player = player;
        this.radius = radius;
        this.color = color;
        this.isOn = false;
        this.canPerform = true;

        
    }
    create() {
        // CÍRCULO FÍSICO
        this.colliderCircle = this.scene.add.circle(
            this.player.sprite.x,
            this.player.sprite.y,
            this.radius
        );

        this.scene.physics.add.existing(this.colliderCircle);
        this.colliderCircle.body.setCircle(this.radius);
        this.colliderCircle.body.setAllowGravity(false);
        this.colliderCircle.body.setImmovable(true);

        // Gráficos visuales
        this.graphics = this.scene.add.graphics();
    }

    update() {

        // Seguir al jugador
        const x = this.player.sprite.x;
        const y = this.player.sprite.y;

        this.colliderCircle.setPosition(x, y);

        if (this.isOn) {   
            this.graphics.clear();
            this.graphics.fillStyle(this.color, 0.5);
            this.graphics.fillCircle(x, y, this.radius);
        } else {
            this.graphics.clear();
        }
    }

    perform() {
        if (!this.canPerform) return;

        this.canPerform = false;
        this.isOn = true;

        this.scene.time.delayedCall(1000, () => {
            this.isOn = false;
            this.graphics.clear();
        });

        this.scene.time.delayedCall(3000, () => {
            this.canPerform = true;
        });
    }

    destroy() {
        this.graphics.destroy();
        this.colliderCircle.destroy();
    }
}
