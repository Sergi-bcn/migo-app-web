// --- FUNCIONES DE POPUPS (Traductor, Perfil, Modos) ---
function togglePopup(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    
    // Si el popup está oculto, lo mostramos; si no, lo ocultamos
    const isVisible = popup.style.display === 'block';
    
    // Opcional: Cerrar otros popups abiertos para que no se solapen
    document.querySelectorAll('.popup-migo, .mini-profile-card').forEach(p => {
        p.style.display = 'none';
    });

    popup.style.display = isVisible ? 'none' : 'block';
}

// --- TRADUCTOR ---
async function translateNow(from, to) {
    const inputField = document.getElementById(`in-${from}`);
    const outputField = document.getElementById(`out-${to}`);
    const text = inputField.value.trim();

    if (!text) return;
    outputField.innerText = "Translating...";

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await response.json();
        outputField.innerText = data.responseData.translatedText;
    } catch (error) {
        outputField.innerText = "Error.";
    }
}

// --- CHAT Y CONEXIÓN CON API ---
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    
    if (!text) return;

    // Añadir mensaje del usuario
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
            if (data.correction && data.correction !== "null") {
                addCorrection(text, data.correction);
            }
        }
    } catch (error) {
        addChatMessage("Connection error with Migo.", 'migo');
    }
}

function addChatMessage(text, type) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `
        <span class="msg-content">${text}</span>
        <button class="copy-msg-btn" onclick="copyText(this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
    `;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addCorrection(original, fixed) {
    const log = document.getElementById('correction-log');
    const entry = document.createElement('div');
    entry.style.marginBottom = "15px";
    entry.innerHTML = `
        <div style="color: #ff5252; font-size: 0.85em;">✗ ${original}</div>
        <div style="color: #4caf50; font-weight: bold;">✓ ${fixed}</div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
    `;
    log.prepend(entry);
}

// --- TECLADO ---
function handleChatEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function handleTransEnter(event, from, to) {
    if (event.key === 'Enter') {
        event.preventDefault();
        translateNow(from, to);
    }
}

function copyText(btn) {
    const text = btn.previousElementSibling.innerText;
    navigator.clipboard.writeText(text);
}