export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, rigor } = req.body;

    const systemPrompt =
        rigor === "strict"
            ? "You are a strict English teacher. Correct mistakes and force repetition."
            : "You are a friendly English tutor.";

    try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await groqRes.json();
        const reply = data.choices[0].message.content;

        res.status(200).json({ reply });

    } catch (err) {
        res.status(500).json({ error: "Groq API error" });
    }
}
