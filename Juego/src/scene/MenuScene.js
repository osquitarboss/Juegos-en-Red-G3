import Phaser from "phaser";
import { Puppet } from "../entities/Puppet.js";


export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    init() {
        this.puppet = new Puppet(this, "test", 300, 300, "spritesheet-arthur");
    }

    preload() {
        this.load.audio('music', 'assets/sound/menu-theme.mp3');
        this.load.image('background', 'assets/menu-inicio-fondo.png');
        this.puppet.preload(600, 800);
    }

    create() {
        this.puppet.create();
        //this.puppet.playAnim(`walk-test`);
        this.puppet.loopAnimationList([`jump-test`, `air-test`, 'fall-test'], 200);

        this.add.image(400, 300, 'background').
            setOrigin(0.5);

        this.music = this.sound.add('music');
        this.music.play();
        this.music.setVolume(0.25);


        const localBtn = this.add.text(600, 100, 'Juego Local', {
            fontSize: '24px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => localBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => localBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('IntroScene');
            });

        const creditsBtn = this.add.text(600, 300, 'Créditos', {
            fontSize: '24px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditsBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => creditsBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.music.stop();
                this.scene.start('CreditsScene');
            });

        const optionsBtn = this.add.text(600, 200, 'Opciones', {
            fontSize: '24px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => optionsBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => optionsBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.launch('OptionsScene', { originalScene: "MenuScene" });
            });

        const exitBtn = this.add.text(600, 400, 'Salir', {
            fontSize: '24px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => exitBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => exitBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.game.destroy(true);
                window.close();
            });
        //

    }
}