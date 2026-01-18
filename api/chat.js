export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();

    // Filtramos los últimos mensajes para no sobrecargar la conexión
    const lastMessages = messages.slice(-6);

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
          ...lastMessages.map(m => ({
            role: m.role === 'migo' ? 'assistant' : 'user',
            content: m.text
          }))
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error('Groq API Offline');

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Limpieza de seguridad por si envían texto extra
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}') + 1;
    if (start !== -1 && end !== -1) content = content.substring(start, end);

    return new Response(content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "API Connection Error. Please check your Groq Key in Vercel.", hasError: false, fix: "" }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}