import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        this.load.image('gameover', 'assets/menus/GameOver.png');
    }

    create(data) {
        this.add.image(400, 300, 'gameover').setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.createMenuButton();
        this.createRetryButton(data.originalScene);
        this.sound.stopAll();

    }

    createRetryButton(originalScene) {
        const retryBtn = this.add.text(400, 350, 'Volver a intentar', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            fontFamily: 'LinLibertine',
        }).setOrigin(0.5)
            .setDepth(101)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => retryBtn.setColor('#cccccc'))
            .on('pointerout', () => retryBtn.setColor('#ffffff'))
            .on('pointerdown', () => {
                this.scene.start(originalScene);
            });
    }

    createMenuButton() {
        const menuBtn = this.add.text(400, 400, 'Volver al menu', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            fontFamily: 'LinLibertine',
        }).setOrigin(0.5)
            .setDepth(101)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => menuBtn.setColor('#cccccc'))
            .on('pointerout', () => menuBtn.setColor('#ffffff'))
            .on('pointerdown', () => {
                this.scene.start('MenuScene');
            });
    }
}




