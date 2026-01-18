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
            Respond ONLY in this JSON format: {"hasError": boolean, "reply": "string", "fix": "string"}` 
          },
          ...messages.map(m => ({
            role: m.role === 'migo' ? 'assistant' : 'user',
            content: m.text
          }))
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Limpieza de seguridad por si la IA envía texto basura
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}') + 1;
    if (start !== -1 && end !== -1) {
      content = content.substring(start, end);
    }

    return new Response(content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Migo Connection Error:", error);
    return new Response(
      JSON.stringify({ 
        reply: "Sorry, I'm having trouble connecting right now. Try again!", 
        hasError: false, 
        fix: "" 
      }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}