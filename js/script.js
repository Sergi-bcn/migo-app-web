// ABRIR Y CERRAR VENTANAS
function togglePopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    
    const isVisible = popup.style.display === 'block';
    
    // Cerrar otros abiertos
    document.querySelectorAll('.popup-migo, .mini-profile-card').forEach(p => p.style.display = 'none');
    
    // Toggle
    popup.style.display = isVisible ? 'none' : 'block';
}

// TRADUCTOR
async function translateNow(from, to) {
    const text = document.getElementById(`in-${from}`).value.trim();
    const out = document.getElementById(`out-${to}`);
    if (!text) return;

    out.innerText = "Translating...";
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await res.json();
        out.innerText = data.responseData.translatedText;
    } catch (e) {
        out.innerText = "Error.";
    }
}

// CHAT
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
        if (data.response) {
            addChatMessage(data.response, 'migo');
        }
    } catch (e) {
        addChatMessage("Error connecting to Migo.", 'migo');
    }
}

function addChatMessage(text, type) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<span class="msg-content">${text}</span>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function handleChatEnter(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }
function handleTransEnter(e, f, t) { if (e.key === 'Enter') { e.preventDefault(); translateNow(f, t); } }