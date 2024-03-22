const speech = require("@google-cloud/speech");
const { PassThrough } = require('stream');

const client = new speech.SpeechClient({
    keyFilename: "./key.json",
});

async function speechToTextStream(audioStream, languageCode) {
    const transcriptionStream = new PassThrough(); // Stream for transcription results

    try {
        const request = {
            config: {
                languageCode: languageCode,
                encoding: 'WEBM_OPUS',   
                sampleRateHertz: 48000,
            },
            // interimResults: true,  // Should allow output stream before the end of the audio is received 
        };

        const recognizeStream = client
            .streamingRecognize(request)
            .on("error", console.error)
            .on("data", (data) => {
                console.log('data:', data);
                console.log('data.results[0].alternatives', data.results[0].alternatives);
                if (data.results[0] && data.results[0].alternatives[0]) {
                    console.log(`Transcription: ${data.results[0]}`);

                }
            }
            );

        audioStream.pipe(recognizeStream);
    } catch (error) {
        console.error("Error streaming audio for transcription:", error);
    }
}

function transcribeEnglishStream(audioStream) {
    return speechToTextStream(audioStream, "en-GB");
}

module.exports = {
    transcribeEnglishStream,
};