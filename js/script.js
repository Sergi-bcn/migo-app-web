async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        addChatMessage(data.response, 'migo');
    } catch (e) {
        addChatMessage("Connection error.", 'migo');
    }
}

function addChatMessage(text, type) {
    const chat = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<span class="msg-content">${text}</span>`;
    chat.appendChild(div);
    
    // Auto-scroll al final
    chat.scrollTop = chat.scrollHeight;
}

function togglePopup(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}