import { Command } from './Command.js';

export class PlayerMovmentInputCommand extends Command {
    constructor(player, action, baseSpeed = 300) {
        super();
        this.player = player;
        this.action = action; // 'left', 'right', 'up'
        this.baseSpeed = baseSpeed;
    }

    execute() {
        if (this.action === 'up' && this.player.canJump()) {
            this.player.sprite.setVelocityY(-this.baseSpeed - 100); // Magic number to jump higher
        } else if (this.action === 'left') {
            this.player.sprite.setVelocityX(-this.baseSpeed);
        } else if (this.action === 'right') {
            this.player.sprite.setVelocityX(this.baseSpeed);
        } else { 
            this.player.sprite.setVelocityX(0);
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