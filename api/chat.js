export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { messages, modo, rigor } = await req.json();
    
    // Obtenemos el último texto del usuario de forma ultra-segura
    const lastMsg = messages[messages.length - 1];
    const userText = lastMsg.text || lastMsg.content || "";

    // Si por alguna razón el texto está vacío, evitamos enviar la petición para que Groq no de error
    if (!userText.trim()) {
      return new Response(JSON.stringify({ 
        reply: "I'm sorry, I didn't hear anything. Could you type something?", 
        hasError: false, 
        fix: "" 
      }));
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
          { 
            role: "system", 
            content: `You are Migo, a friendly English teacher. Mode: ${modo}. Rigor: ${rigor}. 
            Respond ONLY in JSON format: {"hasError": boolean, "reply": "string", "fix": "string"}` 
          },
          { 
            role: "user", 
            content: userText // Aquí es donde Groq pedía el campo 'content'
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        reply: "Migo is having a technical issue. Please try again.", 
        hasError: false, 
        fix: "" 
      }));
    }

    // Enviamos la respuesta de la IA al frontend
    return new Response(data.choices[0].message.content, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      reply: "Connection Error. Check your internet or API Key.", 
      hasError: false, 
      fix: "" 
    }));
  }
}