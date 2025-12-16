import Phaser from "phaser";
import { connectionManager } from "../services/ConnectionManager.js";
import { clientDataManager } from "../services/clientDataManager.js";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }


    preload() {
        this.load.audio('music', 'assets/sound/menu-theme.mp3');
        this.load.image('background', 'assets/menuSinLetras.png');

        this.load.image('id1', 'assets/BotonTitulo.png');
        this.load.image('id2', 'assets/BotonLocalPlay.png');
        this.load.image('id3', 'assets/BotonCreditos.png');
        this.load.image('id4', 'assets/BotonOpciones.png');
        this.load.image('id5', 'assets/BotonSalir.png');
        this.load.image('menu', 'assets/libretaNivelesConSombra.png');
        this.load.image('n1', 'assets/BotonNivel1.png');
        this.load.image('n2', 'assets/BotonNivel2.png');
        this.load.image('return', 'assets/BotonVolver.png');
    }

    create() {
        this.add.image(400, 300, 'background').
            setOrigin(0.5);
        this.add.image(85, 34, 'id1').
            setOrigin(0);

        this.startButton = this.add.image(196, 238, 'id2').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                this.openMiniMenu();
            });

        this.creditsButton = this.add.image(241, 307, 'id3').
            setOrigin(0).
            setInteractive({ useHandCursor: true }).
            on('pointerdown', () => {
                this.scene.start('CreditsScene');
            });

        this.optionsButton = this.add.image(245, 377, 'id4').
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


        /*const localBtn = this.add.text(600, 100, 'Juego Local', {
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
        */
        // Indicador de conexión al servidor
        this.connectionText = this.add.text(400, 550, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);

        // Texto de muertes
        this.deathsText = this.add.text(400, 500, 'Muertes: Cargando... ', {
            fontSize: '18px',
            color: '#ffff00'
        }).setOrigin(0.5);

        clientDataManager.getClientDeaths().then(deaths => {
            console.log('Received deaths:', deaths); 
            if (deaths !== null && deaths !== undefined) {
                this.deathsText.setText('Muertes: ' + deaths);
            } else {
                this.deathsText.setText('Muertes: Error');
            }
        }).catch(error => {
            console.error('Error fetching deaths:', error);
            this.deathsText.setText('Muertes: Error');
        });


    }



    openMiniMenu() {

        //Desactivar todos los botones de abajo del menú
        this.buttons.forEach(btn => btn.removeInteractive());

        // Fondo del menú
        const bg = this.add.image(400, 300, 'menu')
            .setDepth(10);

        // Botón Nivel 1
        const lvl1 = this.add.image(350, 230, 'n1')
            .setDepth(11)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.closeMiniMenu([bg, lvl1, lvl2, returnBtn]);
                this.scene.start('IntroScene');
            });

        // Botón Nivel 2
        const lvl2 = this.add.image(350, 310, 'n2')
            .setDepth(11)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.closeMiniMenu([bg, lvl1, lvl2, returnBtn]);
                this.scene.start('EndScene');
            });

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

    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#00ff00');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#ff0000');
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