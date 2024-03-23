





const WebSocket = require('ws');
const sessionStore = require('../utils/SessionStore');

let textWebSocketServer;

const testVar = true;
const testVar2 = 'Hello from the server';

const start = () => {
    textWebSocketServer = new WebSocket.Server({ port: 3001 });

    textWebSocketServer.on('connection', (ws) => {
        console.log('Text WebSocket connection established');

        ws.on('message', (message) => {
            console.log('Received message:', JSON.parse(message));

            // { message: {
            //     type: 'system',
            //     task: 'establish-session',
            //     content: {
            //         sessionId: sessionId
            //     }
            // }})

                    try {
                        const data = JSON.parse(message);

                        // Establish a new session with the client
                        if (data.message.type === 'system' && data.message.task === 'establish-session') {
                            console.log('Received request to establish session:', data.message.content.sessionId);
                            sessionStore.addSocket(data.message.content.sessionId, ws, 'text');

                            // // Assume you have a way to store the association between session IDs and WebSocket connections
                            // associateSessionIdWithConnection(data.sessionId, ws);
                            // // Further initialization or authentication logic...
                        }
                    } catch (error) {
                        console.error('Error parsing initial message:', error);
                    }

            });
            


            // ws.send(JSON.stringify({ message: 'Hello from the server' }));


        //     ws.send(JSON.stringify({
        //         message: {
        //             type: 'system',
        //             content: {
        //                 testVar2: testVar2,
        //             }
        //         }
        //     }))
        // });

        //     ws.send(JSON.stringify({ message: {
        //         type: 'system',
        //         content: {
        //             testVar: testVar
        //         }
        //     }}))
        // });

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