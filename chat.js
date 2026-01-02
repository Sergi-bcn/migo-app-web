const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  const apiKey = process.env.migo_api_key;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Eres Migo, un tutor de inglés. Si hay error gramatical responde JSON: {\"wrong\": \"...\", \"right\": \"...\", \"reply\": \"...\"}. Si no hay error, responde JSON: {\"reply\": \"...\"}."
          },
          { role: "user", content: message }
        ]
      },
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    );

    const content = response.data.choices[0].message.content;
    res.status(200).json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ reply: "Connection Error with AI. / Error de IA." });
  }
};