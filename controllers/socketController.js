const useSpeechToTextSocket = require('../sockets/speechToTextSocket');

function start() {
    useSpeechToTextSocket.start();
}

function stop() {
    useSpeechToTextSocket.stop();
}


// textWebSocket.start();
// audioWebSocket.start();


module.exports = {
    start,
    stop
};