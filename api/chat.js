// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Only POST allowed" });

    const { message, rigor, style } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ reply: "Error: Falta la API Key en Vercel." });
    }

    const systemPrompt = `You are Migo, a friendly English tutor. 
    Current user preference: Rigor Level is ${rigor} and Chat Style is ${style}.
    Respond in English. If the user makes a grammar mistake, you MUST add a section at the very end starting with 'CORRECTION:' followed by the improvement.`;

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
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        const fullContent = data.choices[0].message.content;
        
        let reply = fullContent;
        let correction = "¡Perfecto! No he detectado errores.";

        if (fullContent.includes('CORRECTION:')) {
            const parts = fullContent.split('CORRECTION:');
            reply = parts[0].trim();
            correction = parts[1].trim();
        }

        return res.status(200).json({ reply, correction });

    } catch (error) {
        return res.status(500).json({ reply: "Error crítico de servidor." });
    }
}