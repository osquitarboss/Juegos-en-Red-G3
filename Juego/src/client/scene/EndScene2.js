import Phaser from "phaser";

export class EndScene2 extends Phaser.Scene {
    constructor() {
        super('EndScene2')
    }

    preload() {
        for (let i = 1; i <= 20; i++) {
            this.load.image('img' + i, `assets/endimg${i}.png`);
        }
    }

    create() {

        this.introText = new Array(20).fill(""); // 20 textos
        this.textIndex = 0;
        this.inProgress = false;

        // ===== Cargar imágenes en arreglo =====
        this.endImages = [];
        for (let i = 1; i <= this.introText.length; i++) {
            const img = this.add.image(400, 200, 'img' + i);
            img.setVisible(i === 1);
            this.endImages.push(img);
        }
        this.currentImageIndex = 0;

        // ===== Texto =====
        this.texto = this.add.text(400, 460, '', {
            fontSize: '24px',
            color: '#ffffffff',
            align: 'center'
        }).setOrigin(0.5);

        // ===== Botón siguiente =====
        const nextBtn = this.add.text(700, 550, 'Siguiente', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => this.advanceScene());

        // ===== Botón saltar =====
        const skipBtn = this.add.text(100, 550, 'Saltar', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#00000000',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('ScoreBoardScene'));

        this.showText();
    }

    showText() {
        if (this.textIndex < this.introText.length) {
            this.textIn(this.introText[this.textIndex]);
        } else {
            this.scene.start('ScoreBoardScene');
        }
    }

    advanceScene() {

        // Si está escribiendo texto, no avanza
        if (this.inProgress) return;

        // Avanza texto
        this.textIndex++;
        this.showText();

        // Cambia imagen
        this.endImages[this.currentImageIndex].setVisible(false);
        this.currentImageIndex++;

        if (this.currentImageIndex < this.endImages.length) {
            this.endImages[this.currentImageIndex].setVisible(true);
        } if (this.currentImageIndex === 3) {
            this.startAutoAdvance();
        } else {
            // Terminó cinemática
            //this.scene.start('MenuScene');
        }
    }

    startAutoAdvance() {
        this.autoTimer = this.time.addEvent({
            delay: 2000, //segundos entre imágenes
            callback: () => {
                if (this.currentImageIndex < this.endImages.length - 1) {
                    this.advanceScene();
                } else {
                    this.scene.start('MenuScene');
                }
            },
            loop: true
        });
    }

    textIn(text) {
        this.inProgress = true;
        let idx = 0;
        const speed = 75; // speed of writing in ms

        const writeLetter = () => {
            if (idx < text.length) {
                this.texto.setText(text.substring(0, idx + 1));
                idx++;
                this.time.delayedCall(speed, writeLetter);
            } else {
                this.inProgress = false;
            }
        };

        writeLetter();
    }
    nextText() {
        this.textIndex++;
        this.showText();
    }
}