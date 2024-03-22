require('dotenv').config();
const textWebSocket = require('./sockets/textWebSocket');
const audioWebSocket = require('./sockets/audioWebSocket');

textWebSocket.start();
audioWebSocket.start();