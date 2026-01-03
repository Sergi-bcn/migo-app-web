const axios = require('axios');

export default async function handler(req, res) {
    // Solo permitimos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message, rigor } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are Migo, a friendly English tutor. 
                    Rigor level: ${rigor}. 
                    If rigor is strict, point out every mistake. 
                    If relaxed, just keep the conversation going unless the error is big.
                    Always respond in this JSON format:
                    { 
                      "reply": "your response in English", 
                      "correction": "corrected version if any", 
                      "explanation": "short explanation in Spanish", 
                      "original": "user's text" 
                    }`
                },
                { role: "user", content: message }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: { 
                'Authorization': `Bearer ${apiKey}`, 
                'Content-Type': 'application/json' 
            }
        });

        const botResponse = JSON.parse(response.data.choices[0].message.content);
        res.status(200).json(botResponse);

    } catch (error) {
        console.error("Error en la API:", error.response?.data || error.message);
        res.status(500).json({ error: "Error al conectar con la IA" });
    }
}