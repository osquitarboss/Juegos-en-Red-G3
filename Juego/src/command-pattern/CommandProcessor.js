import { PlayerMovmentInputCommand } from './PlayerMovmentInputCommand.js';
export class CommandProcessor {
    constructor() {
        this.players = new Map();
        this.network = null;
    }

    setNetwork(networkManager) {
        this.network = networkManager;
    }

    process(command) {
        const player = command.getEntity();
        
        // Solo ejecutar si es jugador local
        if (player && player.authority === 'LOCAL') {
            command.execute();  // Respuesta inmediata
            
            // Transmitir a otros jugadores
            if (this.network && this.network.isConnected()) {
                this.network.send(command.serialize());
            }
        }
    }

    receiveCommand(data) {
        const player = this.players.get(data.playerId);
        
        // Solo ejecutar si es jugador remoto
        if (player && player.authority === 'REMOTE') {
            const command = this.deserialize(data, player);
            if (command) {
                command.execute();
            }
        }
    }
/// Implementar deserializacion de comandos con las diferentes acciones de los inputs
    deserialize(data, player) {
        switch(data.type) {
            case 'PlayerMovmentInputCommand':
                return new PlayerMovmentInputCommand(player, data.action, data.baseSpeed);

            case 'SHOOT':
                return null;
            
            default:
                console.warn('Comando desconocido:', data.type);
                return null;
        }
    }
}