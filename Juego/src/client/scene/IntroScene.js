import Phaser from "phaser";
import { Puppet } from "../entities/Puppet.js";

export class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene')
    }

    init(data) {
        this.sceneToPlay = data.sceneToPlay;
        this.arthur1 = new Puppet(this, "ca1", 130, 120, "spritesheet-arthur-reescalado-mitad", true);
        this.arthur2 = new Puppet(this, "ca2", 340, 120, "spritesheet-arthur-reescalado-mitad", true);
        this.arthur3 = new Puppet(this, "ca3", 500, 120, "spritesheet-arthur-reescalado-mitad", true);
        this.arthur4 = new Puppet(this, "ca4", 650, 120, "spritesheet-arthur-reescalado-mitad", true);

        this.lucy1 = new Puppet(this, "cl1", 130, 370, "spritesheet-lucy-reescalado-mitad", true);
        this.lucy2 = new Puppet(this, "cl2", 340, 370, "spritesheet-lucy-reescalado-mitad", true);
        this.lucy3 = new Puppet(this, "cl3", 500, 370, "spritesheet-lucy-reescalado-mitad", true);
        this.lucy4 = new Puppet(this, "cl4", 650, 370, "spritesheet-lucy-reescalado-mitad", true);

        this.puppets1 = [this.arthur1, this.arthur2, this.arthur3, this.arthur4, this.lucy1, this.lucy2, this.lucy3, this.lucy4];

        this.enemy1 = new Puppet(this, "enemy1", 300, 90, "spritesheet-enemigo-reescalado-mitad", false);
        this.enemy2 = new Puppet(this, "enemy2", 600, 90, "spritesheet-enemigo-reescalado-mitad", false);
        this.enemy3 = new Puppet(this, "enemy3", 300, 340, "spritesheet-enemigo-reescalado-mitad", false);
        this.enemy4 = new Puppet(this, "enemy4", 600, 340, "spritesheet-enemigo-reescalado-mitad", false);

        this.puppets2 = [this.enemy1, this.enemy2, this.enemy3, this.enemy4];
    }

    preload() {


        this.load.image('intro', 'assets/p1entrando.png');
        this.load.image('intro2', 'assets/p1yp2.png');
        this.load.image('controls', 'assets/ilustracionMecanicas.png');
        this.load.image('combat', 'assets/ilustracionCombate.png');
        this.load.image('mansion', 'assets/mansion.png');
        this.load.image('lucyPeeking', 'assets/lucyPeeking.png');

        this.puppets1.forEach(puppet => puppet.preload(300, 400));
        this.puppets2.forEach(puppet => puppet.preload(300, 400));
    }

    create() {
        this.introText = [
            "1953, Birmingham, Inglaterra, \nhace 27 años la familia Felton fue misteriosamente \nasesinada,\n nadie se ha atrevido a entrar en su mansión.",
            "Hasta hoy. \n           \nArthur, dispuesto a resolver el caso\n se adentra en la sombría mansión.",
            "Pero no está solo.\nAlgo le observa desde las sombras...\nO más bien,\nAlguien.",
            "La fantasma resultó ser extrañamente amigable,\nOfreciéndose como guía y protectora\n en su investigacíon por la mansión.",
            " ",
            " "
        ];
        this.textIndex = 0;
        this.inProgress = false;
        this.introImage0 = this.add.image(400, 200, 'mansion');

        this.introImage1 = this.add.image(400, 200, 'intro');
        this.introImageL = this.add.image(400, 200, 'lucyPeeking');
        this.introImage2 = this.add.image(400, 200, 'intro2');
        this.controlsImage = this.add.image(400, 270, 'controls');
        this.combatImage = this.add.image(400, 270, 'combat');
        this.controlsImage.setScale(0.9);
        this.combatImage.setScale(0.9);
        this.cutsceneImages = [this.introImage1, this.introImageL, this.introImage2, this.controlsImage, this.combatImage];
        this.cutsceneImages.forEach(image => image.setVisible(false));



        this.arthur1.create();
        this.arthur1.playAnim(`walk-ca1`);
        this.arthur1.sprite.flipX = true;
        this.arthur2.create();
        this.arthur2.playAnim(`walk-ca2`);
        this.arthur2.sprite.flipX = false;
        this.arthur3.create();
        this.arthur3.loopAnimationList([`jump-ca3`, `air-ca3`, 'fall-ca3'], 300);
        this.arthur4.create();
        this.arthur4.loopAnimationList([`idle-ca4`, `attack-ca4`], 500);
        this.lucy1.create();
        this.lucy1.playAnim(`walk-cl1`);
        this.lucy1.sprite.flipX = true;
        this.lucy2.create();
        this.lucy2.playAnim(`walk-cl2`);
        this.lucy2.sprite.flipX = false;
        this.lucy3.create();
        this.lucy3.loopAnimationList([`jump-cl3`, `air-cl3`, 'fall-cl3'], 300);
        this.lucy4.create();
        this.lucy4.loopAnimationList([`idle-cl4`, `attack-cl4`], 500);

        this.puppets1.forEach(puppet => puppet.sprite.setVisible(false));

        this.enemy1.create();
        this.enemy1.playAnim(`idle-enemy1`);
        this.enemy2.create();
        this.enemy2.playAnim(`idle-white-enemy2`);
        this.enemy3.create();
        this.enemy3.playAnim(`idle-white-enemy3`);
        this.enemy4.create();
        this.enemy4.loopAnimationList([`white-to-black-enemy4`, `die-enemy4`], 500);

        this.puppets2.forEach(puppet => puppet.sprite.setVisible(false));


        const nextBtn = this.add.text(700, 550, 'Siguiente', {
            fontSize: '20px',
            color: '#ffffffff',
            backgroundColor: '#00000000',
        }).setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#737373ff' }))
            .on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#000000ff' }))
            .on('pointerdown', () => {
                if (!this.inProgress) { this.nextText(); }
                switch (this.textIndex) {
                    case 1:
                        this.introImage0.setVisible(false);
                        this.introImage1.setVisible(true);
                        break;

                    case 2:
                        this.introImage1.setVisible(false);
                        this.introImageL.setVisible(true);
                        break;

                    case 3:
                        this.introImageL.setVisible(false);
                        this.introImage2.setVisible(true);
                        break;

                    case 4:
                        this.introImage2.setVisible(false);
                        this.controlsImage.setVisible(true);
                        this.puppets1.forEach(puppet => puppet.sprite.setVisible(true));
                        break;

                    case 5:
                        this.controlsImage.setVisible(false);
                        this.combatImage.setVisible(true);

                        this.puppets1.forEach(puppet => puppet.sprite.setVisible(false));

                        this.arthur4.sprite.setVisible(true);
                        this.arthur4.sprite.x = 150;
                        this.arthur4.sprite.y = 100;

                        this.lucy4.sprite.setVisible(true);
                        this.lucy4.sprite.x = 150;
                        this.lucy4.sprite.y = 330;

                        this.puppets2.forEach(puppet => puppet.sprite.setVisible(true));
                        break;

                    default:
                        this.cutsceneImages.forEach(image => image.setVisible(false));
                        break;
                } //Se podria hacer con un array
            });
        this.text = this.add.text(400, 460, '', {
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
                this.scene.start(this.sceneToPlay);
            });

        this.showText();
    }

    showText() {
        if (this.textIndex < this.introText.length) {
            this.textIn(this.introText[this.textIndex]);
        } else {
            this.scene.start(this.sceneToPlay);
        }
    }

    textIn(text) {
        this.inProgress = true;
        let index = 0;
        const speed = 35; // Velocidad de escritura en ms

        const writeText = () => {
            if (index < text.length) {
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