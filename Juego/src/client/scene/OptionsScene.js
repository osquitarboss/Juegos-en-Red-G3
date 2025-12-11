import Phaser from "phaser";

export class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    preload() {
        this.load.image('background', 'assets/menu-inicio-fondo.png');
    }

    create(data) {
        //Panel oscuro
        this.add.rectangle(400, 300, 800, 600, 0x000000).setOrigin(0.5);

        // Title
        this.add.text(400, 100, 'Opciones', {
            fontSize: '48px',
            color: '#ffffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        //boton de sonido
        const volumeText = this.sound.mute ? 'Activar Sonido' : 'Desactivar Sonido';
        const volumeBtn = this.add.text(400, 300, volumeText, {
            fontSize: '32px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        volumeBtn.on('pointerover', () => volumeBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => volumeBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.sound.mute = !this.sound.mute;
                volumeBtn.setText(this.sound.mute ? 'Activar Sonido' : 'Desactivar Sonido');
            });

        //boton de volver
        const backBtn = this.add.text(400, 500, 'Volver', {
            fontSize: '32px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => backBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.stop();
                this.scene.resume(data.originalScene);
            });
    }
}
