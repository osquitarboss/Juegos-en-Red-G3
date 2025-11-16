import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    preload()
    {
        this.load.image('background', 'assets/menu-inicio-fondo.png');
    }

    create() {
        this.add.image(400, 300, 'background').
        setOrigin(0.5);

        this.add.text(400,100, 'BM Confidential',
        {   fontSize: '64px',
            color: '#4f2b02ff',
            backgroundColor: '#ffffff43',
        }).setOrigin(0.5);

        const localBtn = this.add.text(400, 550, 'Local Play', {
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