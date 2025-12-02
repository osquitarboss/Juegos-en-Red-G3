import { Player } from "./Player";
import { Light } from "./Light.js";

export class Arthur extends Player {
    constructor(scene, id, x, y, gravity, xPos, yPos, spriteSheet = null) {
        super(scene, id, x, y, gravity, xPos, yPos, spriteSheet);

        this.light = new Light(this.scene, 'light1', this, 75, 0xffffff)
        
    }

    create() {
        super.create();
        this.light.create();
    }

    attack() {
        this.light.perform();
    }
}