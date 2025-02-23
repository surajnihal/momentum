export async function getMotivationalContent(mood: string, goal: string, focusArea: string) {
    const prompt = `The user is feeling ${mood}, their goal is "${goal}", and they want guidance on "${focusArea}". 
    Generate a response that is **warm, uplifting, and natural-sounding**. Weave everything into a smooth, conversational flow.  
    The response should:
    - Start with an encouraging sentence that makes the user feel seen and supported.
    - Gently reinforce their inner strength and resilience.
    - Offer a **single actionable tip** (gratitude, breathwork, posture, movement).
    - End with a forward-looking, motivating statement.
    Keep the response **concise and engaging (100-120 words max).`;
  
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          { 
            role: "system", 
            content: "You are an AI-powered mental fitness coach. Your job is to uplift, empower, and emotionally support the user." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.8, 
      }),
    });
  
    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "You're stronger than you realize, and today is a new opportunity to shine.";
  
    return aiMessage;
  }
  