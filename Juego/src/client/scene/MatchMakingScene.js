import Phaser from "phaser";

export class MatchMakingScene extends Phaser.Scene {
    constructor() {
        super('MatchMakingScene')
        this.ws = null;
    }

    create() {
        this.add.text(400, 200, 'Buscando partida...', { fontSize: '32px', color: '#f1f1f1ff' }).setOrigin(0.5);

        this.connectToServer();
    }

    connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.host}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connected to WebSocket server');
        //this.statusText.setText('Waiting for opponent...');

        // Join matchmaking queue
        this.ws.send(JSON.stringify({ type: 'joinQueue' }));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleServerMessage(data);
        } catch (error) {
          console.error('Error parsing server message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        //this.statusText.setText('Connection error!');
        //this.statusText.setColor('#ff0000');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
          //this.statusText.setText('Connection lost!');
          //this.statusText.setColor('#ff0000');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      //this.statusText.setText('Failed to connect!');
      //this.statusText.setColor('#ff0000');
    }
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        //this.playerCountText.setText(`Players in queue: ${data.position}/2`);
        break;

      case 'gameStart':
        console.log('Game starting!', data);
        // Store game data and transition to multiplayer game scene
        this.scene.start('MultiplayerGameScene', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId,
          initialBall: data.ball
        });
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }

  leaveQueue() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'leaveQueue' }));
      this.ws.close();
    }
  }

  shutdown() {
    this.leaveQueue();
  }
}

