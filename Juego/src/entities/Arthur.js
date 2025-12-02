import { Player } from "./Player";
import { Light } from "./Light.js";

export class Arthur extends Player {
    constructor(scene, id, x, y, gravity, xPos, yPos, spriteSheet = null) {
        super(scene, id, x, y, gravity, xPos, yPos, spriteSheet);

        this.light = new Light(this.scene, 'light1', this, 75, 0xffffff)
        this.isAttacking = false;

    }

    create() {
        super.create();
        this.light.create();



        this.sprite.on("animationupdate", (anim) => {
            if (anim.key === `attack-${this.id}`) {
                this.light.update();
                this.isAttacking = true;
            }
        });
        this.sprite.on("animationcomplete", (anim) => {
            if (anim.key === `attack-${this.id}`) {
                this.isAttacking = false;
                this.playAnim(`idle-${this.id}`);
            }
        });
    }

    attack() {
        if (this.isAttacking || !this.light.canPerform) return;

        this.light.perform();
        this.playAnim(`attack-${this.id}`);
    }
}