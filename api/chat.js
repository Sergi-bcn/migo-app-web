export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();

    // Reducimos el historial al mínimo para asegurar que no haya errores de buffer
    const minimalHistory = messages.slice(-3).map(m => ({
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
          ...minimalHistory
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error('API_REJECTED');

    const data = await response.json();
    return new Response(data.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        reply: "Migo está descansando. Revisa la API KEY en el panel de Vercel.", 
        hasError: false, 
        fix: "" 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}