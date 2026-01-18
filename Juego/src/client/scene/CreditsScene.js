import Phaser from "phaser";

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene')
    }

    preload() {
        this.load.image('volverMenu', 'assets/menus/BotonVolverMenu.png');
        this.load.image('creditsImage', 'assets/menus/MenuCreditos.png');
    }

    create() {

        this.add.image(400, 300, 'creditsImage').setOrigin(0.5);

        const returnBtn = this.add.image(400, 500, 'volverMenu').setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });


    }
}