import Phaser from "phaser";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene')
    }

    preload() {
        this.load.image('intro', 'assets/p1entrando.png');
        this.load.image('intro2', 'assets/p1yp2.png');
    }

    create() {
        this.introText=[
            "1953, Birmingham, Inglaterra, \nhace 27 años la familia Felton fue misteriosamente \nasesinada,\n nadie se ha atrevido a entrar en su mansión.",
            "Hasta hoy.",
            "El detective Arthur se ha adentrado en la mansión, \ndonde ha conocido a la difunta Lucy Felton, \n después de hablar un rato han decidido ayudarse \npara descubrir el misterio detrás de esa noche.",
            "Jugador 1(Arthur): Usa las teclas wasd para moverte \ny f para encender tu candelabro.\n\nJugador 2(Lucy): Usa las flechas para moverte \ny la tecla intro para lanzar un ataque psíquico.\n\nPara derrotar a los fantasmas el jugador 1 \ndeberá iluminar a los fantasmas \ny mientras están iluminados\n el jugador 2 deberá atacarlos.\n\n¡Buena suerte!"];
        this.textIndex=0;
        this.inProgress=false;
        this.introImage1=this.add.image(400, 200, 'intro');
        this.introImage2=this.add.image(400, 200, 'intro2');
        this.introImage1.setVisible(false);
        this.introImage2.setVisible(false);
        
        const nextBtn = this.add.text(700, 550, 'Siguiente', {
            fontSize: '20px', 
            color: '#ffffffff',
            backgroundColor: '#00000000',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => nextBtn.setStyle({backgroundColor: '#737373ff'}))
        .on('pointerout', () => nextBtn.setStyle({backgroundColor: '#000000ff'}))
        .on('pointerdown', () =>{
            if(!this.inProgress)
                {this.nextText();} 
            if(this.textIndex==1){
                this.introImage1.setVisible(true);
            } else if(this.textIndex==2){
                this.introImage1.setVisible(false);
                this.introImage2.setVisible(true);
            } else {
                this.introImage1.setVisible(false);
                this.introImage2.setVisible(false);
            }
            });
        this.text= this.add.text(400, 460, '',{ 
            fontSize: '24px',
            color: '#ffffffff',
            align: 'center',
            
            
        }).setOrigin(0.5);

        const skipBtn = this.add.text(100, 550, 'Saltar', {
            fontSize: '20px', 
            color: '#ffffffff',
            backgroundColor: '#00000000',
        }).setOrigin(0.5)
        .setInteractive({useHandCursor: true})
        .on('pointerover', () => skipBtn.setStyle({backgroundColor: '#737373ff'}))
        .on('pointerout', () => skipBtn.setStyle({backgroundColor: '#000000ff'}))
        .on('pointerdown', () =>{
            this.scene.start('GameScene');
        });

        this.showText();
    }
        
    showText() {
        if (this.textIndex < this.introText.length) {
            this.textIn(this.introText[this.textIndex]);
        } else {
            this.scene.start('GameScene');
        }
    }

    textIn(text) {
        this.inProgress = true;
        let index = 0;
        const speed = 75; // Velocidad de escritura en ms

        const writeText = () => {
            if (index < text.length){
                this.text.setText(text.substring(0, index + 1));
                index++;
                this.time.delayedCall(speed, writeText);
            } else {
                this.inProgress = false;
                }
        };

        writeText();
    }
    nextText() {
        this.textIndex++;
        this.showText();
    }
}