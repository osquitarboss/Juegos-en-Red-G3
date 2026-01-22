import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }


    preload() {
        this.load.audio('music', 'assets/sound/menu-theme.mp3');
        this.load.image('background', 'assets/menus/menuSinLetras.png');

        this.load.image('numPlayers', 'assets/menus/BotonNumUsuarios.png');
        this.load.image('serverDown', 'assets/menus/BotonServidorCaido.png');
        this.load.image('juegoLinea', 'assets/menus/BotonJuegoLinea.png');
        this.load.image('id1', 'assets/menus/BotonTitulo.png');
        this.load.image('id2', 'assets/menus/BotonLocalPlay.png');
        this.load.image('id3', 'assets/menus/BotonCreditos.png');
        this.load.image('id4', 'assets/menus/BotonOpciones.png');
        this.load.image('id5', 'assets/menus/BotonSalir.png');
        this.load.image('menu', 'assets/menus/libretaNivelesConSombra.png');
        this.load.image('n1', 'assets/menus/BotonNivel1.png');
        this.load.image('n2', 'assets/menus/BotonNivel2.png');
        this.load.image('n2t', 'assets/menus/BotonNivel2Tachado.png');
        this.load.image('return', 'assets/menus/BotonVolver.png');
    }

    create() {
        this.add.image(400, 300, 'background').
            setOrigin(0.5);
        this.add.image(85, 34, 'id1').
            setOrigin(0);


        this.startButton = this.add.image(196, 250, 'id2').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                this.openMiniMenu();
            });

        this.creditsButton = this.add.image(241, 320, 'id3').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                this.scene.start('CreditsScene');
            });

        this.optionsButton = this.add.image(245, 390, 'id4').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                this.scene.launch('OptionsScene', { originalScene: 'MenuScene' });
            });

        this.exitButton = this.add.image(276, 451, 'id5').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                this.game.destroy(true);
                window.close();
            });

        this.buttons = [this.startButton, this.creditsButton, this.optionsButton, this.exitButton];
        this.music = this.sound.add('music');
        this.music.play();
    }



    openMiniMenu() {

        this.buttons.forEach(btn => btn.removeInteractive());

        const bg = this.add.image(400, 300, 'menu').setDepth(10);

        const lvl1 = this.add.image(350, 230, 'n1')
            .setDepth(11)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.closeMiniMenu([bg, lvl1, lvl2, returnBtn]);
                this.scene.start('IntroScene');
            });

        const level1Done = localStorage.getItem('level1Completed') === 'true';

        let lvl2;

        if (level1Done) {
            // botón normal
            lvl2 = this.add.image(350, 310, 'n2')
                .setDepth(11)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    this.closeMiniMenu([bg, lvl1, lvl2, returnBtn]);
                    this.scene.start('GameScene');
                });
        } else {
            // botón bloqueado
            lvl2 = this.add.image(350, 310, 'n2t')
                .setDepth(11);
            // sin setInteractive → no se puede pulsar
        }

        const returnBtn = this.add.image(320, 400, 'return')
            .setDepth(11)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.closeMiniMenu([bg, lvl1, lvl2, returnBtn]);
            });
    }

    closeMiniMenu(elements) {

        // Eliminar los elementos del minimenu
        elements.forEach(e => e.destroy());

        // ✔️ Reactivar los botones de la escena
        this.buttons.forEach(btn => btn.setInteractive({ useHandCursor: true }));
    }

}