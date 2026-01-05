// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, config } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // Modelo rápido y eficiente de Groq
        messages: [
          { 
            role: "system", 
            content: `Eres Migo, un asistente inteligente. Tu rigor es ${config.rigor} y tu estilo de chat es ${config.estilo}. Responde siempre de forma auténtica y fluida.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: 'Error al conectar con Groq' });
  }
}