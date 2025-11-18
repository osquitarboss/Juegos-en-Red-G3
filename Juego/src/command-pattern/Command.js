export class Command {
    execute() {
        // Implementar en subclases
        // Ejecuta la acción en el juego
    }
    
    serialize() {
        // Convertir a JSON para enviar por red
        return {};
    }
    
    getEntity() {
        // Retorna la entidad asociada
        return null;
    }
}