/**
 * Lógica de la IA y Correcciones
 */

let currentRigor = "relaxed";
let isBlocked = false;
let requiredText = "";

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // Si el sistema está bloqueado, verificamos si el usuario escribió la corrección
    if (isBlocked) {
        if (text.toLowerCase() === requiredText.toLowerCase()) {
            isBlocked = false;
            requiredText = "";
            addChatMessage(text, 'user');
            addChatMessage("¡Correcto! Continuemos.", 'migo');
            input.value = '';
        } else {
            addChatMessage(text, 'user');
            addChatMessage(`Aún no es correcto. Por favor, escribe exactamente: "${requiredText}"`, 'migo');
            input.value = '';
        }
        return;
    }

    addChatMessage(text, 'user');
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();

        if (data.wrong) {
            logCorrection(data.wrong, data.right);
            
            if (currentRigor === 'strict') {
                isBlocked = true;
                requiredText = data.right;
                addChatMessage(`${data.reply}. **Modo Estricto:** Escribe la frase corregida para continuar.`, 'migo');
            } else {
                addChatMessage(`${data.reply} (Tip: ${data.right})`, 'migo');
            }
        } else {
            addChatMessage(data.reply, 'migo');
        }
    } catch (e) {
        addChatMessage("Migo tiene problemas de conexión ahora mismo.", 'migo');
    }
}

function addChatMessage(text, type) {
    const chat = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `
        <span class="msg-content">${text}</span>
        <button class="copy-msg-btn" onclick="copyText(this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function logCorrection(wrong, right) {
    const log = document.getElementById('correction-log');
    if (log.innerText.includes("CORRECCIONES")) log.innerHTML = "";
    
    const div = document.createElement('div');
    div.className = "log-entry";
    div.style.marginBottom = "15px";
    div.style.padding = "10px";
    div.style.borderBottom = "1px solid #eee";
    
    div.innerHTML = `
        <div style="color:#ff5252; text-decoration:line-through; font-size:12px;">${wrong}</div>
        <div style="color:#4caf50; font-weight:800; margin-top:4px;">➜ ${right}</div>
        <div style="font-size:10px; color:#bbb; margin-top:4px;">${new Date().toLocaleTimeString()}</div>
    `;
    log.prepend(div);
}