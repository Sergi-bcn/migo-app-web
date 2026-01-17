export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return new Response(JSON.stringify({ reply: "API Key missing." }), { status: 500 });
    }

    const formattedMessages = messages.map(m => ({
      role: m.role === 'migo' ? 'assistant' : m.role,
      content: m.content || m.text
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
            content: `You are Migo, a friendly English teacher. Mode: ${modo}. Rigor: ${rigor}. 
            CRITICAL RULE: If the user makes ANY grammar or spelling mistake, you MUST:
            1. Set "hasError" to true.
            2. In "reply", explain the mistake briefly and kindly in English, then tell them: "Please rewrite it correctly to continue!"
            3. In "fix", provide ONLY the perfectly corrected sentence.
            If there is NO mistake:
            1. Set "hasError" to false.
            2. Continue the conversation normally in "reply".
            3. "fix" can be empty.
            Format: {"reply": "...", "fix": "...", "hasError": true/false}` 
          },
          ...formattedMessages
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return new Response(data.choices[0].message.content, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw new Error("Invalid response");
  } catch (error) {
    return new Response(JSON.stringify({ reply: "Migo Error: " + error.message }), { status: 500 });
  }
}