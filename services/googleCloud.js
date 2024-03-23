const speech = require("@google-cloud/speech");
const { PassThrough } = require('stream');

const client = new speech.SpeechClient({
    keyFilename: "./key.json",
});

function speechToTextStream(audioStream, languageCode) {
    const transcriptionStream = new PassThrough(); // Stream for transcription results

    try {
        const request = {
            config: {
                languageCode: languageCode,
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 48000,
            },
            interimResults: true,  // Should allow output stream before the end of the audio is received 
        };

        const recognizeStream = client
            .streamingRecognize(request)
            .on("error", console.error)
            .on("data", (data) => {
                console.log('data:', data);
                console.log('data.results[0].alternatives', data.results[0].alternatives);
                if (data.results[0] && data.results[0].alternatives[0]) {
                    console.log(`Transcription: ${data.results[0]}`);
                    transcriptionStream.write(data.results[0].alternatives[0].transcript);
                }
            })
            .on('end', () => {
                transcriptionStream.end();
            });

        audioStream.pipe(recognizeStream);
    } catch (error) {
        console.error("Error streaming audio for transcription:", error);
    }

    return transcriptionStream;  // Return the stream for further use
}

function transcribeEnglishStream(audioStream) {
    return speechToTextStream(audioStream, "en-GB");
}


// function transcribeEnglishStream(audioStream) {
//     const stream = speechToTextStream(audioStream, "en-GB");
//     console.log("Stream:", stream)
//     console.log("Is stream?", stream instanceof require('stream'));
//     console.log("Has 'on' method?", typeof stream.on === 'function');
//     return stream;
// }




module.exports = {
    transcribeEnglishStream,
};