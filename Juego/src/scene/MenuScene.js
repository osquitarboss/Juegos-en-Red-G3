import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    preload()
    {
        this.load.image('background', 'assets/menuJR.png');
    }

    create() {
        this.add.image(400, 300, 'background').
        setOrigin(0.5);


        const localBtn = this.add.text(550, 450, 'Local Play', {
            fontSize: '24px', 
            color: '#3e2606ff',
            backgroundColor: '#ffffffff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointover', () => localBtn.setStyle({fill: '#e7b14dff'}))
        .on('pointout', () => localBtn.setStyle({fill: '#1dd627ff'}))
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

    }
}