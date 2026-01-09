// api/chat.js
export default async function handler(req, res) {
    const { message } = req.body;
    const apiKey = process.env.migo_api_key; // Aquí Vercel coge tu llave automáticamente

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
                    { role: "system", content: "Eres Migo, un tutor de inglés amable. Responde siempre en inglés de forma breve y, si el usuario comete un error, añade una corrección gramatical al final precedida por 'CORRECTION:'" },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        const fullText = data.choices[0].message.content;
        
        // Separar la respuesta de la corrección
        const parts = fullText.split('CORRECTION:');
        
        res.status(200).json({ 
            reply: parts[0].trim(),
            correction: parts[1] ? parts[1].trim() : "¡Vas muy bien!"
        });
    } catch (error) {
        res.status(500).json({ error: "Error de conexión" });
    }
}