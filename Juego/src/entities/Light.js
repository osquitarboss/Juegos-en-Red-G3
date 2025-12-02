export class Light {

    constructor(scene, id, player, radius, color) {

        this.id = id;
        this.scene = scene;
        this.player = player;
        this.radius = radius;
        this.color = color;
        this.isOn = false;
        this.canPerform = true;

        // El objeto graphics debe mantenerse vivo
        this.graphics = this.scene.add.graphics();
        
    }

    update() {
        if (this.isOn) {   
            // Actualizar posición en base al jugador
            const x = this.player.sprite.x;
            const y = this.player.sprite.y;

            // Borrar el frame anterior
            this.graphics.clear();

            // Dibujar la luz
            this.graphics.fillStyle(this.color, 0.5);
            this.graphics.fillCircle(x, y, this.radius);
            this.graphics.setDepth(10);
        } else {
            // Borrar la luz si está apagada
            this.graphics.clear();
        }
    }

    perform() {
        if (!this.canPerform) return;

        this.canPerform = false;
        this.isOn = true;

        // Alternar el estado de la luz después de 1 segundo
        this.scene.time.delayedCall(1000, () => {
            this.isOn = false;
            this.graphics.clear();
        });
        // Cooldown de 3 segundos antes de poder usar de nuevo
        this.scene.time.delayedCall(3000, () => {
            this.canPerform = true;
        });
    }

    destroy() {
        this.graphics.destroy();
    }
}