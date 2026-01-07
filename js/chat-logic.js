let currentMigoConfig = { rigor: 'Estricto / Strict', estilo: 'Normal' };

function writeLog(msg) {
    const log = document.getElementById('log-content');
    if(log) log.innerHTML = `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>` + log.innerHTML;
}

async function togglePopup(event, popupId) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const popup = document.getElementById(popupId);
    if (!popup) return;

    if (popup.innerHTML.trim() !== "") { popup.innerHTML = ""; return; }
    
    // Cerrar otros popups abiertos
    document.querySelectorAll('.popup-modal').forEach(p => p.innerHTML = "");

    // Ruta absoluta para Vercel
    const file = (popupId === 'popup-config') ? '/htmlmodules/windows/wconfig.html' : '/htmlmodules/windows/wtranslator.html';

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`404: No se encontró ${file}`);
        popup.innerHTML = await response.text();
        
        // Estilo forzado de ventana modular
        const card = popup.querySelector('div');
        if (card) {
            card.style.borderRadius = "15px";
            card.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
            card.style.border = "2px solid #f39c12";
            card.style.background = "white";
            card.style.padding = "10px";
        }
    } catch (err) {
        writeLog(err.message);
        popup.innerHTML = `<div style="background:white; padding:15px; border:1px solid red; border-radius:10px;">⚠️ Error cargando ventana</div>`;
    }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input || !input.value.trim()) return;

    const text = input.value;
    document.querySelectorAll('.popup-modal').forEach(p => p.innerHTML = "");

    renderBubble(text, true); // Usuario
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, config: currentMigoConfig })
        });
        const data = await response.json();
        renderBubble(data.reply, false); // Migo
    } catch (e) {
        writeLog("Error en la respuesta de la IA");
        renderBubble("Error de conexión.", false);
    }
}

function renderBubble(text, isUser) {
    const chatBox = document.getElementById('chat-box');
    const msg = document.createElement('div');
    
    // Diseño 16px, Izquierda, Sombra
    msg.style.cssText = `
        align-self: flex-start !important; 
        background: ${isUser ? '#f39c12' : '#ffffff'} !important; 
        color: ${isUser ? 'white' : '#1e293b'} !important; 
        padding: 12px 18px !important; 
        border-radius: 18px 18px 18px 2px !important; 
        margin-bottom: 10px !important; 
        max-width: 80% !important; 
        font-size: 16px !important; 
        text-align: left !important; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.05) !important;
        border: ${isUser ? 'none' : '1px solid #e2e8f0'} !important;
        word-wrap: break-word !important;
    `;
    
    msg.innerText = text;
    chatBox.appendChild(msg);
    
    // Scroll automático al último mensaje
    chatBox.scrollTop = chatBox.scrollHeight;
}