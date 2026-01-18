import Phaser from "phaser";

export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene')
    }

    preload() {
        this.load.image('p1', 'assets/p1p2foto.png');
        this.load.image('p2', 'assets/p1p2Partido.png');
        this.load.image('p3', 'assets/p1p2yfantasma.png');
        this.load.image('p4', 'assets/p1p2eSCAPANDO.png');
    }

    create() {
        this.introText = [
            "Arthur y Lucy hallan una vieja foto entre los \n polvorientos libros de la estantería.",
            "De pronto, todo encaja en la mente de Arthur.\nSu obsesión sin sentido con el caso\n y la conexión con Lucy...\nella es...",
            "Sin embargo, no hay tiempo para reflexiones.",
            "Deben huir.",
        ];
        this.textIndex = 0;
        this.inProgress = false;

        this.endImage1 = this.add.image(400, 200, 'p1');
        this.endImage2 = this.add.image(400, 200, 'p2');
        this.endImage3 = this.add.image(400, 200, 'p3');
        this.endImage4 = this.add.image(400, 200, 'p4');
        this.endImages = [this.endImage2, this.endImage3, this.endImage4];
        this.endImages.forEach(image => image.setVisible(false));

        const nextBtn = this.add.text(700, 550, 'Siguiente', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                if (!this.inProgress) {
                    this.nextText();
                } else {
                    this.game.events.emit('RequestScoreBoard');
                }
                switch (this.textIndex) {
                    case 1:
                        this.endImage1.setVisible(false);
                        this.endImage2.setVisible(true);
                        break;

                    case 2:
                        this.endImage2.setVisible(false);
                        this.endImage3.setVisible(true);
                        break;

                    case 3:
                        this.endImage3.setVisible(false);
                        this.endImage4.setVisible(true);
                        break;

                    case 4:
                        this.endImage4.setVisible(false);
                        break;
                }
            });
        this.texto = this.add.text(400, 460, '', {
            fontSize: '24px',
            color: '#ffffffff',
            align: 'center',


        }).setOrigin(0.5);

        const skipBtn = this.add.text(100, 550, 'Saltar', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#00000000',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => skipBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => skipBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                this.scene.start('ScoreBoardScene');
            });

        this.showText();

    }

    showText() {
        if (this.textIndex < this.introText.length) {
            this.textIn(this.introText[this.textIndex]);
        } else {
            this.scene.start('ScoreBoardScene');
        }
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