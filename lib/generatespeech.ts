export async function generateSpeech(text: string) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = "GBv7mTt0atIp3Br8iCZE"; 
  
    if (!apiKey) {
      console.error("❌ ElevenLabs API key is missing.");
      return null;
    }
  
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voiceId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        voice_settings: { 
          stability: 0.6, 
          similarity_boost: 1.0,
          style: 0.9,
          use_clarity_model: true,
        },
      }),
    });
  
    if (!response.ok) {
      console.error("❌ Error generating speech:", await response.text());
      return null;
    }

    return response.blob();
    //return URL.createObjectURL(audioBlob); // Creates a playable audio link
  }
  