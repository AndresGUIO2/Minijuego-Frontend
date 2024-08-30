class NetworkManager {
    constructor() {
        this.socket = new WebSocket('ws://localhost:8000/ws');
        this.playerId = null; // Inicializa playerId

        this.socket.onopen = () => {
            console.log('Connected to WebSocket server');
            console.log('Socket readyState:', this.socket.readyState);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'init') {
                this.room = data.room;
                this.playerId = data.player_id; // Asigna playerId
                console.log('Initialized:', this.room, this.playerId);
                if (this.oninit) {
                    this.oninit(this.playerId); // Notifica cuando playerId esté listo
                }
            } else if (data.action === 'update') {
                console.log('Game state update:', data.state);
                if (this.onupdate) {
                    this.onupdate(data.state);
                }
            } else if (data.error) {
                console.error('Server Error:', data.error);
            } else {
                console.log('Message from server:', data);
            }
        };

        this.socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
            console.log('Socket readyState:', this.socket.readyState);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    send(action, data) {
        if (this.socket.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ action, ...data });
            this.socket.send(message);
        } else {
            console.warn('WebSocket is not open. Cannot send message.');
        }
    }

    close() {
        this.socket.close();
    }
}

export default NetworkManager;