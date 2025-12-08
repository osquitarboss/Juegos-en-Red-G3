import { Animator } from "../Components/Animator";

export class Puppet {

    constructor(scene, id, xPos, yPos, spriteSheet = null) {
        this.id = id;
        this.scene = scene;
        this.xPos = xPos;
        this.yPos = yPos;
        this.currentAnim = null;

        this.animator = new Animator(scene, spriteSheet);
    }

    preload(width, height) {
        this.animator.preload(width, height);
    }

    create() {
        // Crear sprite sin físicas
        this.sprite = this.animator.createSprite(this.xPos, this.yPos);

        // Crear animaciones igual que Player
        this.animator.createAnimation(`idle-${this.id}`, 0, 3, 4);
        this.animator.createAnimation(`walk-${this.id}`, 4, 7, 5);
        this.animator.createAnimation(`jump-${this.id}`, 8, 8, 4, 0);
        this.animator.createAnimation(`air-${this.id}`, 9, 10, 1, 0);
        this.animator.createAnimation(`fall-${this.id}`, 10, 10, 1, 0);
        this.animator.createAnimation(`attack-${this.id}`, 12, 13, 2, 0);

        this.sprite.setScale(0.17, 0.17);
        this.sprite.setDepth(200);

        // Animación por defecto
        this.sprite.play(`idle-${this.id}`);
    }

    playAnim(key) {
        if (this.currentAnim !== key) {
            this.sprite.play(key, true);
            this.currentAnim = key;
        }
    }

    // Si quieres que haga un bucle de animaciones automáticamente:
    loopAnimationList(anims, delay = 1000) {
        let index = 0;
        this.scene.time.addEvent({
            delay,
            loop: true,
            callback: () => {
                this.playAnim(anims[index]);
                index = (index + 1) % anims.length;
            }
        });
    }
}