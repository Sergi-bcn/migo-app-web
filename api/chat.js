export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();
    const lastMessage = messages[messages.length - 1].text;

    // Verificación interna: Si no hay API KEY, avisamos directamente
    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ reply: "Falta la API KEY en Vercel Settings.", hasError: false, fix: "" }));
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
          { role: "system", content: `You are Migo, a teacher. JSON ONLY: {"hasError": false, "reply": "Hi!", "fix": ""}` },
          { role: "user", content: lastMessage }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data.choices[0].message.content), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Error de conexión con Groq.", hasError: false, fix: "" }));
  }
}