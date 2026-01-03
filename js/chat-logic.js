let currentRigor = 'relaxed';

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const text = input.value.trim();

    if (!text) return;

    // Mostrar mensaje del usuario
    appendMessage('user', text);
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, rigor: currentRigor })
        });

        const data = await response.json();
        
        // Mostrar respuesta de Migo
        appendMessage('bot', data.reply);
        
        // Si hay correcciones, mostrarlas
        if (data.correction) {
            updateCorrections(data.original, data.correction, data.explanation);
        }

    } catch (error) {
        console.error("Error:", error);
        appendMessage('bot', "Sorry, I'm having connection issues.");
    }
}

function appendMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${role}-msg`;
    div.innerHTML = `<div class="msg-content">${text}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updateCorrections(original, corrected, explanation) {
    const list = document.getElementById('corrections-list');
    const item = document.createElement('div');
    item.className = 'correction-item';
    item.innerHTML = `
        <p class="wrong">❌ ${original}</p>
        <p class="right">✅ ${corrected}</p>
        <p class="exp">${explanation}</p>
    `;
    list.prepend(item);
}