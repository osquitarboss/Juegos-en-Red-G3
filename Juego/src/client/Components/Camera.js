import Phaser from 'phaser';
export class Camera {
    constructor(scene, players) {
        this.scene = scene;
        this.players = players;
        this.camera = this.scene.cameras.main;

        this.camLeft = this.camera.scrollX;
        this.camRight = this.camera.scrollX + this.camera.width;
        this.margin = 20;
    }

    update() {
        this.camLeft = this.camera.scrollX;
        this.camRight = this.camera.scrollX + this.camera.width;

        this.players.get('player1').sprite.x = Phaser.Math.Clamp(this.players.get('player1').sprite.x, this.camLeft + this.margin, this.camRight - this.margin);
        this.players.get('player2').sprite.x = Phaser.Math.Clamp(this.players.get('player2').sprite.x, this.camLeft + this.margin, this.camRight - this.margin);
        
        const midX = (this.players.get('player1').sprite.x + this.players.get('player2').sprite.x) / 2;
        const targetLeft  = midX - this.camera.width * 0.5;
        const targetRight = midX + this.camera.width * 0.5;

        const arthurInsideAfterMove = 
            this.players.get('player1').sprite.x > targetLeft + this.margin &&
            this.players.get('player1').sprite.x < targetRight - this.margin;

        const lucyInsideAfterMove =
            this.players.get('player2').sprite.x > targetLeft + this.margin &&
            this.players.get('player2').sprite.x < targetRight - this.margin;

        if (arthurInsideAfterMove && lucyInsideAfterMove) {
            this.camera.scrollX = Math.round(
                Phaser.Math.Linear(this.camera.scrollX, midX - this.camera.width/2, 0.1)
            );
        }
    }   
}  