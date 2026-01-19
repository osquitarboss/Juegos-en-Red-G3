/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  // Estado privado: almacén de usuarios
  let users = [];
  let nextId = 1;

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - {name, level}
   * @returns {Object} Usuario creado
   */
  function createUser(userData) {
    // 1. Validar que el email no exista ya
    const existingUser = users.find(u => u.name === userData.name);
    if (existingUser) {
      throw new Error('El nombre ya está registrado');
    }

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(nextId),
      name: userData.name,
      deaths: userData.deaths || 0,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);
    console.log('Nuevo usuario creado: ', newUser);

    // 4. Incrementar nextId
    nextId++;

    // 5. Retornar el usuario creado
    return newUser;
  }


  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    console.log('Usuario encontrado: ', user);
    return user || null;
  }



  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    // TODO: Implementar
    // 1. Buscar el usuario por id
    const user = users.find(u => u.id === id);
    // 2. Si no existe, retornar null
    if (!user) {
      console.log('Usuario no encontrado: ', id);
      return null;
    }
    // 3. Actualizar solo los campos permitidos (name, avatar, level)
    user.name = updates.name || user.name;
    user.deaths = updates.deaths || user.deaths;

    console.log('Usuario actualizado: ', user);
    // 5. Retornar el usuario actualizado
    return user;
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    // TODO: Implementar
    // 1. Buscar el índice del usuario
    const index = users.findIndex(u => u.id === id);
    // 2. Si existe, eliminarlo del array
    if (index !== -1) {
      users.splice(index, 1);
      console.log('Usuario eliminado: ', id);
      return true;
    }
    // 3. Retornar true si se eliminó, false si no existía
    console.log('Usuario no encontrado: ', id);
    return false;
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getUserById,
    updateUser,
    deleteUser
  };
}
