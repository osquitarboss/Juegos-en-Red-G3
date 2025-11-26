import { Player } from "./Player";

export class Lucy extends Player {
    constructor(scene, id, x, y, gravity, xPos, yPos, spriteSheet = null) {
        super(scene, id, x, y, gravity, xPos, yPos, spriteSheet);
        this.attackHitbox = null;
    }

    create() {
        super.create();
        this.attackHitbox = this.scene.physics.add.sprite(0, 0, null)
            .setSize(40, 20)
            .setVisible(false)
            .setImmovable(true)
            .setActive(false);

        this.sprite.on('animationcomplete', (anim) => {
            if (anim.key === "attack") {
                this.isAttacking = false;
                this.playAnim("idle"); // o walk si te mueves
            }
        });

        this.sprite.on('animationupdate', (anim, frame) => {
            if (anim.key === "attack") {

                // Frames que hacen daño:
                if (frame.index >= 3 && frame.index <= 5) { 
                    this.attackHitbox.setActive(true).setVisible(false);
                } else {
                    this.attackHitbox.setActive(false);
                }
            }
        });
        // En el create de la escena configurar los overlaps con los enemigos
    }

    updateHitbox() {
        const offsetX = this.sprite.flipX ? -20 : 20;
        this.attackHitbox.setPosition(
            this.sprite.x + offsetX,
            this.sprite.y
        );
    }

    attack() {
        if (this.isAttacking) return; // evita spameo

        this.updateHitbox();
        this.isAttacking = true;
        this.sprite.setVelocityX(0); // opcional
        this.sprite.play("attack");
    }
}