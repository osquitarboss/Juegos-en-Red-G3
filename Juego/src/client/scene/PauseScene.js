import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create(data) {

        this.input.keyboard.on('keydown-ESC', () => {
            this.unpause(data.originalScene);
        });

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        this.add.text(400, 100, 'Menú de pausa', {
            fontSize: '48px',
            fontFamily: 'LinLibertine',
            color: '#3e2606ff',
            backgroundColor: '#ffffff'
        }).setOrigin(0.5);

        const playBtn = this.add.text(400, 250, 'Continuar', {
            fontSize: '24px',
            fontFamily: 'LinLibertine',
            color: '#3e2606ff',
            backgroundColor: '#ffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => playBtn.setStyle({ fill: '#00000037' }))
            .on('pointerout', () => playBtn.setStyle({ fill: '#000000' }))
            .on('pointerdown', () => {
                this.unpause(data.originalScene);
            });

        //boton de sonido
        const volumeText = this.sound.mute ? 'Activar Sonido' : 'Desactivar Sonido';
        const volumeBtn = this.add.text(400, 400, volumeText, {
            fontSize: '24px',
            fontFamily: 'LinLibertine',
            color: '#3e2606ff',
            backgroundColor: '#ffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => volumeBtn.setStyle({ fill: '#00000037' }))
            .on('pointerout', () => volumeBtn.setStyle({ fill: '#000000' }))
            .on('pointerdown', () => {
                this.sound.mute = !this.sound.mute;
                volumeBtn.setText(this.sound.mute ? 'Activar Sonido' : 'Desactivar Sonido');
            });

        const exitBtn = this.add.text(400, 550, 'Volver al Menu', {
            fontSize: '24px',
            fontFamily: 'LinLibertine',
            color: '#3e2606ff',
            backgroundColor: '#ffffff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => exitBtn.setStyle({ fill: '#00000037' }))
            .on('pointerout', () => exitBtn.setStyle({ fill: '#000000' }))
            .on('pointerdown', () => {
                this.exitToMenu(data.originalScene);
            });
    }

    unpause(originalScene) {
        this.scene.stop();
        this.scene.resume(originalScene);
    }

    exitToMenu(originalScene) {
        this.scene.stop(originalScene);
        this.sound.stopAll();
        this.scene.start('MenuScene');
    }
}