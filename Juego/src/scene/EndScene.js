import Phaser from "phaser";

export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene')
    }

    preload(){
        this.load.image('p1', 'assets/p1p2foto.png');
        this.load.image('p2', 'assets/p1p2Partido.png');
        this.load.image('p3', 'assets/p1p2fantasma.png');
        this.load.image('p4', 'assets/p1p2eSCAPANDO.png');


    }













    create() {
        this.introText = [
            "Arthur abre un libro viejo \n\ny polvoriento de la estantería.\n",
            "Lo que vió entre sus páginas \n\nlo dejó sin aliento.\n",
            "Continuará..."];
        this.textIdx = 0;
        this.inProgress = false;

        this.endImage1 = this.add.image(400, 200, 'p1p2foto');

        const nextBtn = this.add.text(600, 500, 'Siguiente', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                if (!this.inProgress) { this.nextText(); }
            });
        this.texto = this.add.text(400, 100, '', {
            fontSize: '24px',
            color: '#ffffffff',
            align: 'center',


        }).setOrigin(0.5);

        this.showText();
    }

    showText() {
        if (this.textIdx < this.introText.length) {
            this.textIn(this.introText[this.textIdx]);
        } else {
            this.scene.start('MenuScene');
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
        this.textIdx++;
        this.showText();
    }
}