import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene')
    }

    

    create() {
        this.textoIntro=[
            "1953, Birmingham, Inglaterra, \nhace 27 años la familia Felton fue misteriosamente \nasesinada,\n nadie se ha atrevido a entrar en su mansión.",
            "Hasta hoy.",
            "El detective Arthur junto con el \nfantasma de la difunta Lucy Felton \n se adentrará al interior de la mansión \npara descubrir el misterio \ndetrás de esa fatídica noche.",
            "Jugador 1(Arthur): Usa las teclas wasd para moverte \ny f para encender tu candelabro.\n\nJugador 2(Lucy): Usa las flechas para moverte \ny la tecla intro para lanzar un ataque psíquico.\n\nPara derrotar a los fantasmas el jugador 1 \ndeberá iluminar a los fantasmas \ny mientras están iluminados\n el jugador 2 deberá atacarlos.\n\n¡Buena suerte!"];
        this.indiceTexto=0;
        this.enProgreso=false;
        
        const nextBtn = this.add.text(600, 500, 'Next', {
            fontSize: '20px', 
            color: '#ffffffff',
            backgroundColor: '#000000ff',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => nextBtn.setStyle({backgroundColor: '#737373ff'}))
        .on('pointerout', () => nextBtn.setStyle({backgroundColor: '#000000ff'}))
        .on('pointerdown', () =>{
            if(!this.enProgreso)
                {this.siguenteTexto();} 
            });
        this.texto= this.add.text(400, 300, '',{ 
            fontSize: '24px',
            color: '#ffffffff',
            align: 'center',
            alignVertical: 'top',
            
        }).setOrigin(0.5);

        this.mostrarTexto();
    }
        
    mostrarTexto() {
        if (this.indiceTexto < this.textoIntro.length) {
            this.textoIn(this.textoIntro[this.indiceTexto]);
        } else {
            this.scene.start('GameScene');
        }
    }

    textoIn(text) {
        this.enProgreso = true;
        let indice = 0;
        const velocidad = 75; // Velocidad de escritura en ms

        const escribirLetra = () => {
            if (indice < text.length){
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