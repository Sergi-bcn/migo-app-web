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
            content: `You are Migo, a friendly English teacher. Mode: ${modo}. Rigor: ${rigor}. 
            ALWAYS respond in this EXACT JSON format:
            {"hasError": boolean, "reply": "string", "fix": "string"}` 
          },
          ...messages.map(m => ({
            role: m.role === 'migo' ? 'assistant' : 'user',
            content: m.text
          }))
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    let content = data.choices[0].message.content;

    // LIMPIEZA DE RESPUESTA (Para evitar "Invalid response")
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}') + 1;
    if (start !== -1 && end !== -1) {
      content = content.substring(start, end);
    }

    return new Response(content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Error de conexión", hasError: false, fix: "" }), { status: 500 });
  }
}