// api/chat.js
export default async function handler(req, res) {
  // Solo permitir peticiones POST
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
        model: "mixtral-8x7b-32768",
        messages: [
          { 
            role: "system", 
            content: `Eres Migo. Rigor: ${config.rigor}. Estilo: ${config.estilo}. Responde de forma auténtica.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de Groq:", data);
      return res.status(response.status).json({ error: data.error?.message || "Error en Groq API" });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "No se pudo conectar con el servidor de la AI." });
  }
}