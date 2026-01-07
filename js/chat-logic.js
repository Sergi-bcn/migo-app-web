let currentMigoConfig = { rigor: 'Estricto / Strict', estilo: 'Normal' };

// Función para el log de errores lateral estable
function writeToLog(msg) {
    const log = document.getElementById('log-content');
    if(log) {
        const div = document.createElement('div');
        div.style.marginBottom = "8px";
        div.style.paddingBottom = "5px";
        div.style.borderBottom = "1px solid #f1f5f9";
        div.innerHTML = `<small style="color:#f39c12;">${new Date().toLocaleTimeString()}</small> ${msg}`;
        log.prepend(div);
    }
}

async function togglePopup(event, popupId) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const popup = document.getElementById(popupId);
    if (!popup) return;

    if (popup.innerHTML.trim() !== "") { popup.innerHTML = ""; return; }
    document.querySelectorAll('.popup-modal').forEach(p => p.innerHTML = "");

    const file = (popupId === 'popup-config') ? '/htmlmodules/windows/wconfig.html' : '/htmlmodules/windows/wtranslator.html';

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error ${response.status}: No se encontró ${file}`);
        popup.innerHTML = await response.text();
        
        // Estilo premium para las ventanas cargadas
        const card = popup.querySelector('div');
        if (card) {
            card.style.borderRadius = "20px";
            card.style.boxShadow = "0 15px 40px rgba(0,0,0,0.2)";
            card.style.border = "2px solid #f39c12";
            card.style.background = "white";
            card.style.padding = "10px";
        }
    } catch (err) {
        writeToLog(err.message);
    }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input || !input.value.trim()) return;

    const text = input.value;
    document.querySelectorAll('.popup-modal').forEach(p => p.innerHTML = "");

    renderBubble(text, true);
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, config: currentMigoConfig })
        });
        const data = await response.json();
        renderBubble(data.reply, false);
    } catch (e) {
        writeToLog("Error API: " + e.message);
        renderBubble("Error de conexión.", false);
    }
}

function renderBubble(text, isUser) {
    const chatBox = document.getElementById('chat-box');
    const msg = document.createElement('div');
    msg.style.cssText = `
        align-self: flex-start !important; 
        background: ${isUser ? '#f39c12' : '#ffffff'} !important; 
        color: ${isUser ? 'white' : '#1e293b'} !important; 
        padding: 14px 20px !important; 
        border-radius: 18px 18px 18px 4px !important; 
        margin-bottom: 10px !important; 
        max-width: 80% !important; 
        font-size: 16px !important; 
        text-align: left !important; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important;
        border: ${isUser ? 'none' : '1px solid #e2e8f0'} !important;
        line-height: 1.5 !important;
    `;
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}