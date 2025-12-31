import { Command } from "./Command.js";

export class PlayerAttackCommand extends Command {
    constructor(player) {
        super();
        this.player = player;
    }

    execute() {
        this.player.attack();
    }

    serialize() {
        return {
            type: 'PlayerAttackCommand',
            playerId: this.player.id,
        };
    }

    getEntity() {
        return this.player;
    }
}