const WebSocket = require('ws');
const { Transform } = require('stream');
const { transcribeEnglishStream } = require('../services/googleCloud');

let audioWebSocketServer;

const start = () => {
    const audioWebSocketServer = new WebSocket.Server({ port: 3002 });

    audioWebSocketServer.on('connection', (ws) => {
        console.log('Audio WebSocket connection established');

        const audioStream = new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            }
        });

        transcribeEnglishStream(audioStream);

        ws.on('message', (message) => {
            console.log('Received message:', message); // <-- This log here 
            if (message instanceof Buffer) {
                audioStream.write(message);
            } else {
                console.warn("Received non-binary message on audio socket.");
            }
        })

        ws.on('close', () => {
            console.log('Audio WebSocket connection closed');
            audioStream.end();
        });

        ws.error = (error) => {
            console.error('Audio WebSocket error:', error);
        };
    });

    console.log('Audio WebSocket server initialised on port 3002');
}

module.exports = {
    start,
};