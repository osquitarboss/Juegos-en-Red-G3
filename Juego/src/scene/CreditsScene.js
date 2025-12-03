import Phaser from "phaser";

export class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene')
    }

    

    create() {
        
        this.add.text(400, 100, 'Juego desarrollado por:\n\nClaudia Porcuna: Interfaces y arte \nJavier Ruibal: Programación \nOscar Rodriguez: Arte y diseño \nMarcos Matutes: Programación \nFernando Pin: Sonido',
        {   fontSize: '24px',
            color: '#ffffffff',
            align: 'center',
        }).setOrigin(0.5);

        const returnBtn = this.add.text(600, 500, 'Return', {
            fontSize: '24px', 
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => returnBtn.setStyle({backgroundColor: '#737373ff'}))
        .on('pointerout', () => returnBtn.setStyle({backgroundColor: '#000000ff'}))
        .on('pointerdown', () =>{
            this.scene.start('MenuScene');
        });


    }
}