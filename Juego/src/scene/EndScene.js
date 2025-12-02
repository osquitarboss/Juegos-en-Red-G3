import Phaser from "phaser";

export class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene')
    }



    create() {
        this.textoIntro = [
            "Arthur abre un libro viejo \n\ny polvoriento de la estantería.\n",
            "Lo que vió entre sus páginas \n\nlo dejó sin aliento.\n",
            "Continuará..."];
        this.indiceTexto = 0;
        this.enProgreso = false;

        const nextBtn = this.add.text(600, 500, 'Siguiente', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                if (!this.enProgreso) { this.siguenteTexto(); }
            });
        this.texto = this.add.text(400, 100, '', {
            fontSize: '24px',
            color: '#ffffffff',
            align: 'center',


        }).setOrigin(0.5);

        this.mostrarTexto();
    }

    mostrarTexto() {
        if (this.indiceTexto < this.textoIntro.length) {
            this.textoIn(this.textoIntro[this.indiceTexto]);
        } else {
            this.scene.start('MenuScene');
        }
    }

    textoIn(text) {
        this.enProgreso = true;
        let indice = 0;
        const velocidad = 75; // Velocidad de escritura en ms

        const escribirLetra = () => {
            if (indice < text.length) {
                this.texto.setText(text.substring(0, indice + 1));
                indice++;
                this.time.delayedCall(velocidad, escribirLetra);
            } else {
                this.enProgreso = false;
            }
        };

        escribirLetra();
    }
    siguenteTexto() {
        this.indiceTexto++;
        this.mostrarTexto();
    }
}