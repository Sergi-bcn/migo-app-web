export default async function handler(req, res) {
  // 1. Validar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Validar que la API KEY existe en el entorno
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Falta la variable GROQ_API_KEY en Vercel.' });
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
        model: "llama-3.3-70b-versatile", // Modelo actualizado y potente de Groq
        messages: [
          { 
            role: "system", 
            content: `Eres Migo. Estilo: ${config.estilo}. Rigor: ${config.rigor}. Responde siempre en el idioma que te hable el usuario.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Error de Groq' });
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al conectar con la AI.' });
  }
}