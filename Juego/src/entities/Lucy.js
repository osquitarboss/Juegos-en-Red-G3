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
            .setImmovable(true);

        this.isAttacking = false;


        this.sprite.on("animationcomplete", (anim) => {
            if (anim.key === `attack-${this.id}`) {
                this.isAttacking = false;
                this.playAnim(`idle-${this.id}`); // o walk si te mueves
                this.attackHitbox.setPosition(-100, -100); // sacar el hitbox de la pantalla

            }
        });

        this.sprite.on("animationupdate", (anim) => {
            if (anim.key === `attack-${this.id}`) {
                this.updateHitbox();
            }
        });

        // En el create de la escena configurar los OVERLAPS con los enemigos
    }

    updateHitbox() {
        const offsetX = this.sprite.flipX ? -20 : 20;
        this.attackHitbox.setPosition(
            this.sprite.x + offsetX,
            this.sprite.y
        );
    }

    attack() {
        if (this.isAttacking ) return; // evita spameo

        this.updateHitbox();
        this.isAttacking = true;
        this.sprite.setVelocityX(0); // opcional
        this.playAnim(`attack-${this.id}`);
    }
}