export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();

    // Solo enviamos los últimos 4 mensajes para que la conexión sea rápida y no falle
    const contextMessages = messages.slice(-4).map(m => ({
      role: m.role === 'migo' ? 'assistant' : 'user',
      content: m.text
    }));

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
            content: `You are Migo, a teacher. Mode: ${modo}. Rigor: ${rigor}. Respond ONLY JSON: {"hasError": boolean, "reply": "string", "fix": "string"}` 
          },
          ...contextMessages
        ],
        response_format: { type: "json_object" },
        temperature: 0.6 // Bajamos la temperatura para que la respuesta sea más estable
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq Error:', errorText);
      throw new Error('API_KEY_OR_CONNECTION_ISSUE');
    }

    const data = await response.json();
    return new Response(data.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        reply: "Conexión inestable. Por favor, revisa la API KEY en Vercel.", 
        hasError: false, 
        fix: "" 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}