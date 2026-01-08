let currentMigoConfig = { rigor: 'Estricto / Strict', estilo: 'Normal' };

function writeLog(msg) {
    const log = document.getElementById('log-content');
    if(log) {
        const div = document.createElement('div');
        div.style.padding = "5px 0";
        div.style.borderBottom = "1px solid #f1f5f9";
        div.innerHTML = `<small style="color:#f39c12;">${new Date().toLocaleTimeString()}</small> ${msg}`;
        log.prepend(div);
    }
}

async function togglePopup(event, popupId) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const popup = document.getElementById(popupId);
    if (!popup || popup.innerHTML.trim() !== "") { if(popup) popup.innerHTML = ""; return; }
    
    document.querySelectorAll('.popup-modal').forEach(p => p.innerHTML = "");

    const file = (popupId === 'popup-config') ? '/htmlmodules/windows/wconfig.html' : '/htmlmodules/windows/wtranslator.html';

    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error("No se pudo cargar");
        popup.innerHTML = await response.text();
        
        const card = popup.querySelector('div');
        if (card) {
            card.style.cssText = "border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); border:2px solid #f39c12; background:white; padding:15px;";
        }
    } catch (err) { writeLog(err.message); }
}

async function sendMessage() {
    const input = document.getElementById('user-input');
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
    } catch (e) { writeLog("Error de API"); }
}

function renderBubble(text, isUser) {
    const chatBox = document.getElementById('chat-box');
    const msg = document.createElement('div');
    
    msg.style.cssText = `
        align-self: ${isUser ? 'flex-end' : 'flex-start'}; 
        background: ${isUser ? '#f39c12' : '#ffffff'}; 
        color: ${isUser ? 'white' : '#1e293b'}; 
        padding: 12px 18px; 
        border-radius: 18px 18px ${isUser ? '4px 18px' : '18px 4px'}; 
        margin-bottom: 8px; 
        max-width: 80%; 
        font-size: 16px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        border: ${isUser ? 'none' : '1px solid #e2e8f0'};
    `;
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}