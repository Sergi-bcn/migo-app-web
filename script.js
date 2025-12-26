let apiKey = localStorage.getItem('migo_api_key') || "";

function setupKey() {
    const key = prompt("Pega aquí tu Groq API Key:", apiKey);
    if (key) {
        apiKey = key;
        localStorage.setItem('migo_api_key', key);
        alert("API Key guardada!");
    }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text || !apiKey) return;

    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // MODELO ACTUALIZADO
                messages: [
                    { role: "system", content: "You are Migo, a strict English tutor. If the user makes a mistake, start with 'CORRECTION:'." },
                    { role: "user", content: text }
                ]
            })
        });
        const data = await response.json();
        appendMessage('migo', data.choices[0].message.content);
    } catch (e) { appendMessage('migo', "Error de conexión. Revisa tu API Key."); }
}

function appendMessage(sender, text) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });