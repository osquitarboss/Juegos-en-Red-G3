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
        
        this.add.text(400, 100, 'Pause Menu', {
            fontSize: '48px', 
            color: '#3e2606ff',
            backgroundColor: '#ffffff'
        }).setOrigin(0.5);

        const playBtn = this.add.text(400, 400, 'Resume', {
            fontSize: '24px', 
            color: '#3e2606ff',
            backgroundColor: '#ffffff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => playBtn.setStyle({fill: '#00000037'}))
        .on('pointerout', () => playBtn.setStyle({fill: '#000000'}))
        .on('pointerdown', () =>{
            this.unpause(data.originalScene); 
        });

        const exitBtn = this.add.text(400, 550, 'Exit to Menu', {
            fontSize: '24px', 
            color: '#3e2606ff',
            backgroundColor: '#ffffff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => exitBtn.setStyle({fill: '#00000037'}))
        .on('pointerout', () => exitBtn.setStyle({fill: '#000000'}))
        .on('pointerdown', () =>{
            this.exitToMenu(data.originalScene); 
        });
    }

    unpause(originalScene) {
        this.scene.stop();
        this.scene.resume(originalScene);
    }

    exitToMenu(originalScene) {
        this.scene.stop(originalScene);
        this.scene.start('MenuScene');
    }
}