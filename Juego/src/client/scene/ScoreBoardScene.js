import Phaser from "phaser";

export class ScoreBoardScene extends Phaser.Scene {
    constructor() {
        super('ScoreBoardScene')
    }

    preload() {
        
    }

    create(data) {
        this.add.text(400, 100, 'SCOREBOARD', {
            fontSize: '48px',
            color: '#ffff00'
        }).setOrigin(0.5);

        let y = 200;
        data.scoreboard.forEach(p => {
            this.add.text(400, y,
                `${p.name} - Muertes: ${p.deaths}`,
                { fontSize: '32px', color: '#ffffff' }
            ).setOrigin(0.5);
            y += 50;
        });
    }

    
}