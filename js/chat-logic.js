async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // Añadir mensaje del usuario a la pantalla
    appendMessage('user', text);
    input.value = '';

    try {
        // Llamada a la API que creamos arriba
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: text, 
                rigor: 'relaxed' // Puedes cambiar esto según el nivel elegido
            })
        });

        const data = await response.json();
        
        // Añadir respuesta de Migo a la pantalla
        appendMessage('bot', data.reply);
        
        // Si hay una corrección, mostrarla en el panel lateral
        if (data.correction && data.correction !== text) {
            updateCorrectionsList(data.original, data.correction, data.explanation);
        }

    } catch (error) {
        console.error("Error:", error);
        appendMessage('bot', "I'm sorry, I'm having trouble connecting right now.");
    }
}

function appendMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}-msg`;
    msgDiv.innerHTML = `<div class="msg-content">${text}</div>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updateCorrectionsList(orig, corrected, exp) {
    const list = document.getElementById('corrections-list');
    const card = document.createElement('div');
    card.className = 'correction-card';
    card.innerHTML = `
        <p style="color: red;"><s>${orig}</s></p>
        <p style="color: green;">${corrected}</p>
        <small>${exp}</small>
    `;
    list.prepend(card);
}

function handleChatEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}