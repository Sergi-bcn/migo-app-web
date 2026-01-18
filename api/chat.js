export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();
    const lastMessage = messages[messages.length - 1].text;

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
            content: `You are Migo, a teacher. Mode: ${modo}. Rigor: ${rigor}. 
            Respond ONLY with this JSON structure: {"hasError": false, "reply": "Your message", "fix": ""}` 
          },
          { role: "user", content: lastMessage }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return new Response(JSON.stringify({ reply: `Groq Error: ${err.error?.message || 'Invalid Key'}`, hasError: false, fix: "" }));
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Retornamos el contenido tal cual, el frontend se encargará de leerlo
    return new Response(content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Connection failed. Please check GROQ_API_KEY in Vercel.", hasError: false, fix: "" }));
  }
}