import { Command } from './Command.js';

export class PlayerMovmentInputCommand extends Command {
    constructor(player, action) {
        super();
        this.player = player;
        this.action = action; // 'left', 'right', 'up'
    }

    execute() {

        const player = this.player;

        // 
        if (this.action === 'up') {
            player.jump();
        }

        // 
        if (this.action === 'left' || this.action === 'right') {
            player.horizontalMove(this.action);
            return;
        }

        // 
        if (this.action === 'idle') {
            player.idle();
        }

    }


    serialize() {
        return {
            type: 'PlayerMovmentInputCommand',
            playerId: this.player.id,
            action: this.action,
        };
    }

    getEntity() {
        return this.player;
    }
}