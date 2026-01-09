// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { message } = req.body;
    const apiKey = process.env.migo_api_key;

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
                        content: "You are Migo, a friendly English tutor. Respond in English. If the user makes a grammar mistake, add a section at the very end of your message starting with the word 'CORRECTION:' followed by the improvement. If there are no mistakes, do not add the correction section." 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        const fullContent = data.choices[0].message.content;

        // Separamos la respuesta de la corrección
        let reply = fullContent;
        let correction = "Keep it up! Your English is great.";

        if (fullContent.includes('CORRECTION:')) {
            const parts = fullContent.split('CORRECTION:');
            reply = parts[0].trim();
            correction = parts[1].trim();
        }

        return res.status(200).json({ 
            reply: reply, 
            correction: correction 
        });

    } catch (error) {
        return res.status(500).json({ reply: "Error connecting to AI.", correction: "Service unavailable." });
    }
}