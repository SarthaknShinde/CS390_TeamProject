require('dotenv').config();
const axios = require('axios');

async function generateScript(bracket) {
    helpers.logStep(2, 'Generating podcast script with Gemini');
    try {
        const prompt = bracket
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
        const headers = {
            'x-goog-api-key': process.env.GEMINI_API_KEY,
            'Content-Type': 'application/json'
        };
        const data = {
            "contents": {
                "parts": {
                    "text": prompt
                }
            }
        }
        const response = await axios.post(url,data,{headers})
        const script = response.data.candidates[0].content.parts[0].text;
        helpers.logSuccess('Podcast script generated');
        console.log(`Script length: ${script.length} characters`);
        helpers.saveTextFile(script, 'podcast-script.txt');
        return script;
    } catch (error) {
        helpers.handleApiError(error, 'Gemini');
        throw new Error('Failed to generate podcast script');
    }
}
async function generateAudio(text) {
    helpers.logStep(3, 'Converting text to speech with ElevenLabs');
    try {
        const voiceId = process.env.PODCAST_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        const headers = {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
        };
        const data = {
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        };
        const response = await axios.post(url, data, { headers, responseType: 'arraybuffer' });
        const filename = helpers.generateTimestampedFilename('glaze', 'mp3');
        const filePath = helpers.saveAudioFile(response.data, filename);
        helpers.logSuccess(`Audio generated: ${filename}`);
        return filePath;

    } catch (error) {
        helpers.handleApiError(error, 'ElevenLabs');
        throw new Error('Failed to generate audio');
    }
}

async function generatePodcast(){
    try {
        const script = await generateScript(articles);
        if (!script || script.length === 0) {
            throw new Error('No script generated');
        }
        const audioFilePath = await generateAudio(script);
        if (!audioFilePath) {
            throw new Error('No audio file generated');
        }
        return {
            success: true,
            articlesCount: articles.length,
            script: script,
            scriptLength: script.length,
            audioFile: audioFilePath
        };

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

