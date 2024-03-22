const WebSocket = require('ws');

let textWebSocketServer;

const start = () => {
    textWebSocketServer = new WebSocket.Server({ port: 3001 });

    textWebSocketServer.on('connection', (ws) => {
        console.log('Text WebSocket connection established');

        ws.on('message', (message) => {
            console.log('Received message:', JSON.parse(message));
            ws.send(JSON.stringify({ message: 'Hello from the server' }));
        });

        ws.on('close', () => {
            console.log('Text WebSocket connection closed');
        });

        ws.error = (error) => {
            console.log('Text WebSocket error:', error);
        };
    });

    console.log('Text WebSocket server initialised on port 3001');
}

const stop = () => {
    if (textWebSocketServer) {
        textWebSocketServer.close();
        console.log('Text WebSocket server closed');
    }
}

module.exports = {
    start,
    stop
};