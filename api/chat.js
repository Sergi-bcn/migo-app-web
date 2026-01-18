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
            content: `You are Migo, a helpful English teacher. Mode: ${modo}. Rigor: ${rigor}.
            
            TASK:
            1. Analyze the user's last message for grammar or spelling mistakes.
            2. If there's a mistake: set "hasError": true and in "fix" explain the error simply (e.g., "You wrote 'he go', but it should be 'he goes' because...").
            3. If it's correct: set "hasError": false and "fix": "".
            4. Always provide a natural "reply" to the conversation.

            Respond ONLY in JSON: {"hasError": boolean, "reply": "string", "fix": "string"}` 
          },
          { role: "user", content: String(userText) }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5
      })
    });

    const data = await response.json();
    return new Response(data.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ reply: "Error", hasError: false, fix: "" }));
  }
}