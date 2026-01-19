import Phaser from "phaser";
import { clientDataManager } from "../services/clientDataManager.js";
export class ScoreBoardScene extends Phaser.Scene {
    constructor() {
        super('ScoreBoardScene')
    }

    preload() {
        this.load.image('p1p2eSCAPANDO', 'assets/p1p2eSCAPANDO.png');
    }

    create() {

        this.add.image(400, 200, 'p1p2eSCAPANDO').setOrigin(0.5);
        this.add.text(400, 100, 'SCOREBOARD', {
            fontSize: '48px',
            color: '#ffffffff',
            backgroundColor: '#000000',
            fontFamily: 'LinLibertine'
        }).setOrigin(0.5);

        let y = 200;

        //Texto de muertes
        this.deathsText = this.add.text(400, y, 'Muertes: Cargando... ', {
            fontSize: '18px',
            fontFamily: 'LinLibertine',
            color: '#ffffffff',
            backgroundColor: '#000000',
        }).setOrigin(0.5);

        clientDataManager.getClientDeaths().then(deaths => {
            console.log('Received deaths:', deaths);
            if (deaths !== null && deaths !== undefined) {
                this.deathsText.setText('Muertes Totales: ' + deaths);
            } else {
                this.deathsText.setText('Muertes Totales: Error');
            }
        }).catch(error => {
            console.error('Error fetching deaths:', error);
            this.deathsText.setText('Muertes Totales: Error');
        });
    }




}