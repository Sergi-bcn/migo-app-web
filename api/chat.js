export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ reply: "API Key missing in Vercel settings." }), { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are Migo, an English teacher. Mode: ${modo}. Rigor: ${rigor}. Respond in English. You MUST return a JSON object: {"reply": "your response", "fix": "correction or empty"}` 
          },
          ...messages
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    // Verificamos si la estructura de Groq es correcta antes de enviar
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return new Response(data.choices[0].message.content, {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error("Invalid response from Groq");
    }

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Migo is having trouble: " + error.message }), { status: 500 });
  }
}