export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ reply: "Only POST allowed" });

    const { message } = req.body;
    const apiKey = process.env.migo_api_key;

    if (!apiKey) {
        return res.status(500).json({ reply: "Falta la API Key en Vercel Settings." });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "You are Migo, a friendly English tutor. Respond in English. If the user makes a grammar mistake, add a section at the very end of your message starting with 'CORRECTION:'" 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ reply: "OpenAI Error: " + data.error.message });
        }

        const fullContent = data.choices[0].message.content;
        let reply = fullContent;
        let correction = "No mistakes found!";

        if (fullContent.includes('CORRECTION:')) {
            const parts = fullContent.split('CORRECTION:');
            reply = parts[0].trim();
            correction = parts[1].trim();
        }

        return res.status(200).json({ reply, correction });

    } catch (error) {
        return res.status(500).json({ reply: "Fatal Server Error" });
    }
}