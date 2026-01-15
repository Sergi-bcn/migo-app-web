export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { messages, modo } = await req.json();

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `You are Migo, a friendly English teacher for people in need. Be encouraging. Mode: ${modo}. Format JSON: {"reply": "...", "fix": "..."}` },
        ...messages
      ],
      response_format: { type: "json_object" }
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}