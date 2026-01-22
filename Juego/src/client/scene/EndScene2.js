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
        this.introText[0] = "Una vez pasado el peligro \nambos llegaron a una habitación especial.";
        this.introText[1] = "Se trataba de la habitación de un crío pequeño \nque le resultaba extrañamente familiar a Arthur.";
        this.introText[2] = "Viendo la confusión de su compañero \n Lucy se vió obligada a contar la verdad sobre el caso.";
        this.introText[14] = "Los fantasmas son seres incapaces \n de abandonar este mundo hasta que salden alguna \ncuenta pendiente que dejaron en vida."
        this.introText[15] = "Y finalmente el caso está resuelto \n Para ambos.";
        this.introText[19] = "Fin.";
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
            .on('pointerdown', () => this.scene.start('MenuScene'));

        this.showText();
    }

    showText() {
        if (this.textIndex < this.introText.length) {
            this.textIn(this.introText[this.textIndex]);
        } else {
            this.scene.start('MenuScene');
        }
    }

    advanceScene() {

        if (this.inProgress) return;

        this.textIndex++;
        this.showText();

        this.endImages[this.currentImageIndex].setVisible(false);
        this.currentImageIndex++;

        if (this.currentImageIndex < this.endImages.length) {
            this.endImages[this.currentImageIndex].setVisible(true);
        }


        if (this.currentImageIndex === 3) {
            this.texto.setText('');
            this.startAutoAdvance();
        }

        if (this.currentImageIndex === 13) {
            if (this.autoTimer) {
                this.autoTimer.remove(false);
                this.autoTimer = null;
            }
        }
    }

    startAutoAdvance() {
        if (this.autoTimer) return;

        this.autoTimer = this.time.addEvent({
            delay: 2500,
            callback: () => {
                if (this.currentImageIndex < 13) {
                    this.advanceScene();
                }
            },
            loop: true
        });
    }

    textIn(text) {

        this.texto.setText('');

        if (text === "") {
            this.inProgress = false;
            return;
        }
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