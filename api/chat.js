export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { message } = req.body;

  try {
    // Aquí conectamos con la IA (ejemplo de lógica de respuesta)
    // En una app real, aquí llamarías a Google Gemini o OpenAI
    
    // Simulamos una respuesta de la IA que detecta un error
    const aiResponse = {
      translation: "Él va a la escuela",
      mistake: message.includes("He go") ? "He go" : null,
      correction: message.includes("He go") ? "He goes" : null
    };

    res.status(200).json(aiResponse);
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
}
