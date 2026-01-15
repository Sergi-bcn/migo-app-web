export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();

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
            content: `You are Migo, a helpful English teacher. 
            Mode: ${modo}. Rigor: ${rigor}. 
            Respond in English. 
            Format: You MUST return a JSON object like this: {"reply": "your message", "fix": "short correction or empty"}` 
          },
          ...messages
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "API Error", details: error.message }), { status: 500 });
  }
}