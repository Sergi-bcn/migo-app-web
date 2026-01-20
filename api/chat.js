export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();
    const lastMsg = messages[messages.length - 1];
    const userText = lastMsg.text || lastMsg.content || "";

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
            Check user grammar/spelling. 
            - If error: "hasError": true, "fix": "Brief explanation", "blocked": true (only if rigor is Strict).
            - If correct: "hasError": false, "fix": "", "blocked": false.
            Respond ONLY JSON: {"hasError": boolean, "reply": "string", "fix": "string", "blocked": boolean}` 
          },
          { role: "user", content: String(userText) }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return new Response(data.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ reply: "Error", hasError: false, fix: "", blocked: false }));
  }
}