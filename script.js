// Configuración de la API de Groq con tu clave
const API_KEY = "";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function sendMessage() {
    const userInputField = document.getElementById('user-input');
    const userInput = userInputField.value.trim();
    
    if (!userInput) return;

    // Mostrar mensaje del usuario en la pantalla
    appendMessage('user', userInput);
    userInputField.value = '';

    // Instrucciones detalladas para que la IA actúe como Migo
    const systemPrompt = `You are Migo, a friendly and helpful English tutor. 
    Follow this structure for every response:
    1. Check for grammar or spelling errors.
    2. Suggest a natural/native way to say the same thing.
    3. Reply to the user's message to keep the conversation going.
    
    CRITICAL: You must format your response exactly like this:
    CORRECTION: [List errors or say "None"]
    NATURAL: [Native-sounding version]
    MIGO: [Your conversational reply]`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userInput }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const fullResponse = data.choices[0].message.content;
        
        // Procesar y mostrar la respuesta formateada
        displayFormattedResponse(fullResponse);

    } catch (error) {
        console.error("Error de Migo:", error);
        appendMessage('migo', "Oops! I lost my connection. Please check if your API key is still active or try again in a moment.");
    }
}

function displayFormattedResponse(text) {
    // Usamos expresiones regulares para extraer cada sección del texto de la IA
    const correctionMatch = text.match(/CORRECTION:\s*([\s\S]*?)(?=NATURAL:|$)/i);
    const naturalMatch = text.match(/NATURAL:\s*([\s\S]*?)(?=MIGO:|$)/i);
    const migoMatch = text.match(/MIGO:\s*([\s\S]*)/i);

    const correction = correctionMatch ? correctionMatch[1].trim() : "No major errors found!";
    const natural = naturalMatch ? naturalMatch[1].trim() : "Your sentence is already quite natural.";
    const reply = migoMatch ? migoMatch[1].trim() : text;

    const formattedHTML = `
        <div class="correction-box">
            <p><strong>📝 Correction:</strong> ${correction}</p>
            <p><strong>✨ Natural Way:</strong> <em>${natural}</em></p>
        </div>
        <div class="migo-text">
            <p>${reply}</p>
        </div>
    `;
    
    appendMessage('migo', formattedHTML);
}

function appendMessage(sender, content) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerHTML = content;
    
    chatBox.appendChild(msgDiv);
    
    // Auto-scroll hacia abajo para ver el último mensaje
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Permitir enviar el mensaje al presionar "Enter"
document.getElementById('user-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});