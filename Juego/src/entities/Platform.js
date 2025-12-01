export class Platform {
    constructor(scene, id, x, y, width, height, textureKey) {
        this.scene = scene;
        this.id = id;

        // Crear sprite
        this.sprite = scene.add.image(x, y, textureKey);

        // Asegurar que el origen está arriba-izquierda (más fácil)
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setDepth(10);

        // Ajustar tamaño visual
        this.sprite.setDisplaySize(width, height);

        // Hacer colisión estática
        scene.physics.add.existing(this.sprite, true);

        // Asegurar cuerpo correcto
        this.sprite.body.setSize(width, height);

        // DEBUG: hazlo rojo si no carga textura
        // (útil para verificar qué falla)
        if (!this.sprite.texture || !this.sprite.texture.key) {
            console.warn("TEXTURA NO CARGADA:", textureKey);
            const g = scene.add.graphics();
            g.fillStyle(0xff0000);
            g.fillRect(x, y, width, height);
        }
    }
}