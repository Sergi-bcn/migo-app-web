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
        model: "llama3-8b-8192",
        messages: [
          { 
            role: "system", 
            content: `You are Migo, an English teacher. Mode: ${modo}. Rigor: ${rigor}. Respond in English. You MUST return a JSON object: {"reply": "your message", "fix": "correction or empty"}` 
          },
          ...messages
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    // Si Groq devuelve un error, lo enviamos al chat para saber qué es
    if (data.error) {
      return new Response(JSON.stringify({ reply: "Groq Error: " + data.error.message }), { status: 400 });
    }

    if (data.choices && data.choices[0]) {
      return new Response(data.choices[0].message.content, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    throw new Error("No choices in response");

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Migo Error: " + error.message }), { status: 500 });
  }
}