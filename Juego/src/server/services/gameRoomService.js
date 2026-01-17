/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Envia un mensaje al contrincante
   * @param {WebSocket} senderWs - Socket del que envía
   * @param {Object} data - Datos a reenviar
   */
  function relayToOpponent(senderWs, data) {
    const roomId = senderWs.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Determinar quién es el oponente
    const opponent = room.player2.ws === senderWs ? room.player1.ws : room.player2.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify(data));
    }
  }

  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;
    const room = {
      id: roomId,
      player1: { ws: player1Ws },
      player2: { ws: player2Ws },
      active: true,
    };

    rooms.set(roomId, room);
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;
    return roomId;
  }


  const handlePlayerMove = (ws, data) => relayToOpponent(ws, data);
  const handlePlayerAttack = (ws, data) => relayToOpponent(ws, data);
  const handlePlayerHit = (ws, data) => relayToOpponent(ws, data);
  const handleEnemyMove = (ws, data) => relayToOpponent(ws, data);
  /* const handleLoaded = (ws, data) => relayToOpponent(ws, data); */ // Replaced by logic below

  function handleLoaded(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    ws.isLoaded = true;

    // Check if both players are loaded
    if (room.player1.ws.isLoaded && room.player2.ws.isLoaded) {
      broadcastToRoom(roomId, { type: 'Loaded' }); // Start the game for both
    }
  }

  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;
      if (opponent.readyState === 1) {
        opponent.send(JSON.stringify({ type: 'playerDisconnected' }));
      }
    }
  }

  function handleGameOver(ws) {
    broadcastToRoom(ws.roomId, { type: 'GameOver' });
  }

  function handleRestart(ws) {
    broadcastToRoom(ws.roomId, { type: 'Restart' });
  }

  function handlePlayersWin(ws) {
    broadcastToRoom(ws.roomId, { type: 'PlayersWin' });
  }

  function broadcastToRoom(roomId, data) {
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;

    const msg = JSON.stringify(data);
    if (room.player1.ws.readyState === 1) room.player1.ws.send(msg);
    if (room.player2.ws.readyState === 1) room.player2.ws.send(msg);
  }

  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handlePlayerMove,
    handlePlayerAttack,
    handlePlayerHit,
    handleEnemyMove,
    handleLoaded,
    handleDisconnect,
    handleGameOver,
    handleRestart,
    handlePlayersWin,
    getActiveRoomCount
  };
}