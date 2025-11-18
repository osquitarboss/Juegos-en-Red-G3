import { Command } from './Command.js';

export class PlayerMovmentInputCommand extends Command {
    constructor(player, action, baseSpeed = 300) {
        super();
        this.player = player;
        this.action = action; // 'left', 'right', 'up'
        this.baseSpeed = baseSpeed;
    }

    execute() {
        if (this.action === 'up') {
            this.player.setVelocityY(-this.baseSpeed - 100); // Magic number to jump higher
        } else if (this.action === 'left') {
            this.player.setVelocityX(-this.baseSpeed);
        } else if (this.action === 'right') {
            this.player.setVelocityX(this.baseSpeed);
        } else { 
            this.player.setVelocity(0);
        }
    }

    serialize() {
        return {
            type: 'PlayerMovmentInputCommand',
            playerId: this.player.playerId,
            action: this.action,
            baseSpeed: this.baseSpeed
        };
    }

    getEntity() {
        return this.player;
    }
}