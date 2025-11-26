import { Player } from "./Player";

export class Arthur extends Player {
    constructor(scene, id, x, y, gravity, xPos, yPos, spriteSheet = null) {
        super(scene, id, x, y, gravity, xPos, yPos, spriteSheet);

        
    }

    attack() {
        // Implementar el ataque específico de Arthur aquí
    }
}