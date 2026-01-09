// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Only POST allowed" });

    const { message } = req.body;
    // IMPORTANTE: En Vercel la KEY debe llamarse GROQ_API_KEY
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: "Falta la API Key en Vercel Settings." });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "You are Migo, a friendly English tutor. Respond in English. If the user makes a grammar mistake, add a section at the very end of your message starting with 'CORRECTION:' followed by the improvement. If there are no mistakes, do not add the correction section." 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: "Groq Error: " + data.error.message });
        }

        const fullContent = data.choices[0].message.content;
        let reply = fullContent;
        let correction = "¡Perfecto! Sin errores gramaticales detectados.";

        if (fullContent.includes('CORRECTION:')) {
            const parts = fullContent.split('CORRECTION:');
            reply = parts[0].trim();
            correction = parts[1].trim();
        }

        return res.status(200).json({ reply, correction });

    } catch (error) {
        return res.status(500).json({ reply: "Error crítico de conexión con el servidor." });
    }
}