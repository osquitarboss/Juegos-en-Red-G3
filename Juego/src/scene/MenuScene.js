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



        const localBtn = this.add.text(600, 100, 'Juego Local', {
            fontSize: '24px', 
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => localBtn.setStyle({backgroundColor: '#737373ff'}))
        .on('pointerout', () => localBtn.setStyle({backgroundColor: '#000000ff'}))
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

        const creditsBtn = this.add.text(600, 200, 'Créditos', {
            fontSize: '24px', 
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => creditsBtn.setStyle({backgroundColor: '#737373ff'}))
        .on('pointerout', () => creditsBtn.setStyle({backgroundColor: '#000000ff'}))
        .on('pointerdown', () =>{
            this.scene.start('CreditsScene');
        });

    }
}