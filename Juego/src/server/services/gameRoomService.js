/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @param {WebSocket} player2Ws - Player 2's WebSocket
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
      },
      player2: {
        ws: player2Ws,
      },
      active: true,
    };

    rooms.set(roomId, room);

    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    return roomId;
  }

  /**
   * Handle player movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {Object} data - Player's movement action
   */
  function handlePlayerMove(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player2.ws === ws ? room.player1.ws : room.player2.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify(data));
    }
  }


  /**
   * Handle player attack from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {Object} data - Player's attack action
   */
  function handlePlayerAttack(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player2.ws === ws ? room.player1.ws : room.player2.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify(data));
    }
  }

  /**
   * Handle player hit from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {Object} data - Player hit notification
   */
  function handlePlayerHit(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player2.ws === ws ? room.player1.ws : room.player2.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify(data));
    }
  }

  /**
   * Handle enemy movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {Object} data - Player's movement action
   */
  function handleEnemyMove(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    //como es el player 1 quien maneja el movimiento del enemigo, entonces envio el movimiento al player 2
    if (room.player2.ws.readyState === 1) { // WebSocket.OPEN
      room.player2.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Only notify the other player if the game is still active
    // If the game already ended (room.active = false), don't send disconnect message
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        opponent.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
      }
    }

  }

  function handleGameOver(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;
    //Broadcast to both players
    if (room.player1.ws.readyState === WebSocket.OPEN) {
      room.player1.ws.send(JSON.stringify({
        type: 'GameOver'
      }));
    }
    if (room.player2.ws.readyState === WebSocket.OPEN) {
      room.player2.ws.send(JSON.stringify({
        type: 'GameOver'
      }));
    }
  }

  function handleRestart(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    //Broadcast to both players
    if (room.player1.ws.readyState === WebSocket.OPEN) {
      room.player1.ws.send(JSON.stringify({
        type: 'Restart'
      }));
    }
    if (room.player2.ws.readyState === WebSocket.OPEN) {
      room.player2.ws.send(JSON.stringify({
        type: 'Restart'
      }));
    }


  }

  function handlePlayersWin(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;
    //Broadcast to both players
    if (room.player1.ws.readyState === WebSocket.OPEN) {
      room.player1.ws.send(JSON.stringify({
        type: 'PlayersWin'
      }));
    }
    if (room.player2.ws.readyState === WebSocket.OPEN) {
      room.player2.ws.send(JSON.stringify({
        type: 'PlayersWin'
      }));
    }
  }

  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handlePlayerMove,
    handlePlayerAttack,
    handlePlayerHit,
    handleEnemyMove,
    handleDisconnect,
    handleGameOver,
    handleRestart,
    handlePlayersWin,
    getActiveRoomCount
  };
}
