const WebSocket = require('ws');
const { Transform } = require('stream');
const { transcribeEnglishStream } = require('../services/googleCloud');
const sessionStore = require('../utils/SessionStore');

let audioWebSocketServer;

const start = () => {
    const audioWebSocketServer = new WebSocket.Server({ port: 3001 });

    audioWebSocketServer.on('connection', (ws) => {
        console.log('Audio WebSocket connection established');

        

        const audioStream = new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            }
        });

        const transcriptionStream = transcribeEnglishStream(audioStream);
        transcriptionStream.on('data', (data) => { 
            console.log('Transcription:', data.toString());
            ws.send(data.toString());
        });

        ws.on('message', (message) => {
            console.log('Received message:', message);

            if (JSON.parse(message).message.type === 'system' && JSON.parse(message).message.task === 'establish-session') {
                console.log('Received request to establish session:', JSON.parse(message).message.sessionId);
                sessionStore.addSocket(JSON.parse(message).message.sessionId, ws, 'audio');
                return;  // Prevent the session handshake message from being processed as audio data
            }

            if (message instanceof Buffer) {
                console.log('Attempting to process audio data...')
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

    console.log('Audio WebSocket server initialised on port 3001');
}

module.exports = {
    start,
};