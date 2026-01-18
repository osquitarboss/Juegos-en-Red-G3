export class MatchMakingScene extends Phaser.Scene {
  constructor() {
    super('MatchMakingScene');
    this.ws = null;
  }

  preload() {
    this.load.image('matchMaking', 'assets/menus/pantalla-matchmaking.jpg');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background image
    this.add.image(width / 2, height / 2, 'matchMaking').setOrigin(0.5);

    // Status text
    this.statusText = this.add.text(width / 2, height / 2 - 50, 'Conectando...', {
      fontFamily: 'LinLibertine',
      fontSize: '24px',
      color: '#ffffffff',
      backgroundColor: '#000000ff'
    }).setOrigin(0.5);

    // Player count text
    this.playerCountText = this.add.text(width / 2, height / 2 + 20, '', {
      fontFamily: 'LinLibertine',
      fontSize: '20px',
      color: '#ffffffff',
      backgroundColor: '#000000ff'
    }).setOrigin(0.5);

    // Cancel button
    const cancelButton = this.add.text(width / 2, height - 100, 'Cancel', {
      fontFamily: 'LinLibertine',
      fontSize: '24px',
      color: '#ff6666ff',
      backgroundColor: '#000000ff',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    cancelButton.on('pointerover', () => {
      cancelButton.setColor('#ff0000ff');
    });

    cancelButton.on('pointerout', () => {
      cancelButton.setColor('#ff6666ff');
    });

    cancelButton.on('pointerdown', () => {
      this.leaveQueue();
      this.scene.start('MenuScene');
    });

    // Connect to WebSocket server
    this.connectToServer();
  }

  connectToServer() {
    try {
      // Connect to WebSocket server (same host as web server)
      const wsUrl = `ws://${window.location.host}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Connecting to WebSocket server');
        this.statusText.setText('Esperando oponente...');

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
        console.error('Error de WebSocket:', error);
        this.statusText.setText('Error de WebSocket!');
        this.statusText.setColor('#ff0000ff');
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (this.scene.isActive('LobbyScene')) {
          this.statusText.setText('Conexión perdida!');
          this.statusText.setColor('#ff0000ff');
        }
      };
    } catch (error) {
      console.error('Error connecting to server:', error);
      this.statusText.setText('Error al conectar!');
      this.statusText.setColor('#ff0000ff');
    }
  }

  handleServerMessage(data) {
    switch (data.type) {
      case 'queueStatus':
        this.playerCountText.setText(`Jugadores en cola: ${data.position}/2`);
        break;

      case 'gameStart':
        console.log('Game starting!', data);
        // Store game data and transition to multiplayer game scene
        this.scene.start('MultiplayerScene', {
          ws: this.ws,
          playerRole: data.role,
          roomId: data.roomId,
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