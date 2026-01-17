import { PlayerAttackCommand } from './PlayerAttackCommand.js';
import { PlayerMovmentInputCommand } from './PlayerMovmentInputCommand.js';
export class CommandProcessor {
    constructor() {
        this.players = new Map();
    }


    process(command) {
        command.execute(); // Respuesta inmediata
    }

    receiveCommand(data) {
        const player = this.players.get(data.playerId);

        const command = this.deserialize(data);
        if (command) {
            command.execute();
        }
    }
    /// Implementar deserializacion de comandos con las diferentes acciones de los inputs
    deserialize(data) {
        // Obtener la instancia real del jugador usando el ID
        const player = this.players.get(data.playerId);
        switch (data.type) {
            case 'PlayerMovmentInputCommand':
                if (!player) {
                    console.warn(`Player not found for ID: ${data.playerId}`);
                    return null;
                }
                // Sync absolute position to fix drift
                if (data.x !== undefined && data.y !== undefined && player.sprite) {
                    if (Math.abs(player.sprite.x - data.x) > 5 || Math.abs(player.sprite.y - data.y) > 5) {
                        player.sprite.setPosition(data.x, data.y);
                    }
                }
                return new PlayerMovmentInputCommand(player, data.action);
            case 'PlayerAttackCommand':
                if (!player) {
                    console.warn(`Player not found for ID: ${data.playerId}`);
                    return null;
                }
                return new PlayerAttackCommand(player);
            default:
                console.warn('Comando desconocido:', data.type);
                return null;
        }
    }
}