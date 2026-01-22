import Phaser from "phaser";
import { connectionManager } from "../services/ConnectionManager.js";
import { clientDataManager } from "../services/clientDataManager.js";

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


        this.startButton = this.add.image(196, 200, 'id2').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                //this.scene.start('IntroScene', { sceneToPlay: 'GameScene' });
                //this.scene.start('GameScene2');
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
        this.music.setVolume(0);


        ////////////////////// API REST //////////////////////
        // Indicador de conexión al servidor

        this.numPlayers = this.add.image(320, 550, 'numPlayers').setOrigin(0.5);
        this.serverDown = this.add.image(400, 550, 'serverDown').setOrigin(0.5).setVisible(false);

        this.connectionText = this.add.text(450, 550, '', {
            fontSize: '18px',
            fontFamily: 'LinLibertine',
            color: '#ffffffff',
            backgroundColor: '#000000ff'
        }).setOrigin(0.5);

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);


        /////////////////////////// Online con WebSocket //////////////////////////
        this.onlineBtn = this.add.image(196, 265, 'juegoLinea').setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => this.onlineBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => this.onlineBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('IntroScene', { sceneToPlay: 'MatchMakingScene' });
            });

        //////////WebSocket//////////
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

    //////////////// FUNCION API REST NUM JUGADORES //////////////////////

    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(data.count);
                this.connectionText.setColor('#ffffffff');
            } else {
                this.connectionText.setText('');
                this.serverDown.setVisible(true);
                this.numPlayers.setVisible(false);
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }

}