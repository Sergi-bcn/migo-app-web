let isBlocked = false;
let requiredText = "";
let currentRigor = "relaxed";

// Función para abrir y cerrar ventanas (Popups)
function togglePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const isVisible = (el.style.display === 'block');
    el.style.display = isVisible ? 'none' : 'block';
    
    updatePositions();
}

// Gestiona el desplazamiento de la ventana de modos si el traductor está abierto
function updatePositions() {
    const modesPopup = document.getElementById('menu-modes');
    const modesBtn = document.getElementById('menu-modes-btn');
    const transPopup = document.getElementById('panel-translator');
    
    const isTransOpen = (transPopup.style.display === 'block');
    const isModesOpen = (modesPopup.style.display === 'block');

    if (isTransOpen && isModesOpen) {
        modesPopup.classList.add('shifted-left');
        modesBtn.classList.add('shifted-btn');
    } else {
        modesPopup.classList.remove('shifted-left');
        modesBtn.classList.remove('shifted-btn');
    }
}

// Detectar Enter en el chat
function handleChatEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Copiar texto de los mensajes del chat
function copyText(btn) {
    const text = btn.parentElement.querySelector('.msg-content').innerText;
    navigator.clipboard.writeText(text);
    const originalSvg = btn.innerHTML;
    btn.innerHTML = `<span style="font-size:10px; font-weight:800; color:var(--verde)">OK</span>`;
    setTimeout(() => btn.innerHTML = originalSvg, 1500);
}

// Limpiar áreas del traductor
function clearTrans(lang) {
    document.getElementById(`in-${lang}`).value = "";
    document.getElementById(lang === 'es' ? 'out-en' : 'out-es').innerText = "";
}

// Seleccionar opciones de Rigor o Estilo
function selectOption(el, targetId, value) {
    const parent = el.parentElement;
    Array.from(parent.children).forEach(child => {
        if(child.classList) child.classList.remove('active');
    });
    el.classList.add('active');
    document.getElementById(targetId).innerText = el.innerText;
    if (targetId === 'status-rigor') currentRigor = value;
}

// Detectar Enter en el traductor
function handleTransEnter(event, sl, tl) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        translateNow(sl, tl);
    }
}

// Lógica de traducción (Google API)
async function translateNow(sl, tl) {
    const text = document.getElementById(`in-${sl}`).value.trim();
    const out = document.getElementById(sl === 'es' ? 'out-en' : 'out-es');
    if (!text) return;
    out.innerText = "...";
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        out.innerText = data[0].map(s => s[0]).join('');
    } catch (e) { out.innerText = "Error."; }
}

// Copiar resultado del traductor
function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    if (text && text !== "...") {
        navigator.clipboard.writeText(text);
    }
}

// Enviar mensaje al Chat
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    input.value = '';

    if (isBlocked) {
        if (text.toLowerCase() === requiredText.toLowerCase()) {
            isBlocked = false;
            requiredText = "";
            addChatMessage("Perfect! Let's continue.", 'migo');
        } else {
            addChatMessage(`Please type: "${requiredText}"`, 'migo', true);
        }
        return;
    }

    try {
        // Simulación de respuesta o llamada a tu API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, rigor: currentRigor })
        });
        const data = await response.json();
        
        if (data.wrong && data.right) {
            isBlocked = true;
            requiredText = data.right;
            addChatMessage(data.reply, 'migo', true);
            logCorrection(data.wrong, data.right);
        } else {
            addChatMessage(data.reply, 'migo');
        }
    } catch (e) { 
        console.error(e);
        // Respuesta de cortesía si no hay API conectada
        setTimeout(() => {
            addChatMessage("I'm listening! Keep practicing your English.", 'migo');
        }, 500);
    }
}

// Añadir burbuja de chat al DOM
function addChatMessage(text, type, isError = false) {
    const chat = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type} ${isError ? 'error-msg' : ''}`;
    div.innerHTML = `
        <span class="msg-content">${text}</span>
        <button class="copy-msg-btn" onclick="copyText(this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
    `;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// Registrar errores en el panel izquierdo
function logCorrection(wrong, right) {
    const log = document.getElementById('correction-log');
    const div = document.createElement('div');
    div.style.marginBottom = "15px";
    div.style.animation = "fadeIn 0.5s ease";
    div.innerHTML = `<div style="color:red; text-decoration:line-through; font-size:12px; font-weight:700;">${wrong}</div>
                     <div style="color:green; font-weight:800; font-size:14px;">➔ ${right}</div>`;
    log.prepend(div);
}