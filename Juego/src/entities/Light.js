export class Light {

    constructor(scene, id, player, radius, color) {

        this.id = id;
        this.scene = scene;
        this.player = player;
        this.radius = radius;
        this.color = color;

        // El objeto graphics debe mantenerse vivo
        this.graphics = this.scene.add.graphics();
        
    }

    update() {
        // Actualizar posición en base al jugador
        const x = this.player.sprite.x;
        const y = this.player.sprite.y;

        // Borrar el frame anterior
        this.graphics.clear();

        // Dibujar la luz
        this.graphics.fillStyle(this.color, 0.5);
        this.graphics.fillCircle(x, y, this.radius);
    }

    destroy() {
        this.graphics.destroy();
    }
}