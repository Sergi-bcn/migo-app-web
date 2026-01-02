let isBlocked = false;
let requiredText = "";
let currentRigor = "relaxed";

// ============================================
// VENTANAS EMERGENTES (ADAPTADO)
// ============================================

function togglePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Usar CLASES CSS en lugar de style.display
    el.classList.toggle('show-popup');
    updatePositions(); // Solo si necesitas desplazar
}

function updatePositions() {
    const modesPopup = document.getElementById('menu-modes');
    const transPopup = document.getElementById('panel-translator');
    
    const isTransOpen = transPopup.classList.contains('show-popup');
    const isModesOpen = modesPopup.classList.contains('show-popup');

    if (isTransOpen && isModesOpen) {
        modesPopup.classList.add('shifted-left');
    } else {
        modesPopup.classList.remove('shifted-left');
    }
}

// ============================================
// SELECCIÓN DE OPCIONES (FUNCIONAL)
// ============================================

function selectOption(el, targetId, value) {
    // 1. Encontrar el CONTENEDOR de las opciones (#menu-modes)
    const menu = document.getElementById('menu-modes');
    if (!menu) return;
    
    // 2. Quitar 'active' de TODAS las opciones del menú
    const allOptions = menu.querySelectorAll('.opt-migo');
    allOptions.forEach(opt => {
        opt.classList.remove('active');
    });
    
    // 3. Añadir 'active' a la opción clickeada
    el.classList.add('active');
    
    // 4. Actualizar el texto en el panel de perfil
    if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.textContent = el.textContent;
        }
    }
    
    // 5. Actualizar la variable global del rigor
    if (value && targetId === 'status-rigor') {
        currentRigor = value;
        console.log('Rigor cambiado a:', currentRigor);
    }
}

// ============================================
// FUNCIONES DEL CHAT (IGUALES)
// ============================================

function handleChatEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function copyText(btn) {
    const text = btn.parentElement.querySelector('.msg-content').innerText;
    navigator.clipboard.writeText(text);
    const originalSvg = btn.innerHTML;
    btn.innerHTML = `<span style="font-size:10px; font-weight:800; color:var(--verde)">OK</span>`;
    setTimeout(() => btn.innerHTML = originalSvg, 1500);
}

// ============================================
// FUNCIONES DEL TRADUCTOR (IGUALES)
// ============================================

function clearTrans(lang) {
    document.getElementById(`in-${lang}`).value = "";
    document.getElementById(lang === 'es' ? 'out-en' : 'out-es').innerText = "";
}

function handleTransEnter(event, sl, tl) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        translateNow(sl, tl);
    }
}

async function translateNow(sl, tl) {
    const text = document.getElementById(`in-${sl}`).value.trim();
    const out = document.getElementById(sl === 'es' ? 'out-en' : 'out-es');
    if (!text) return;
    out.innerText = "...";
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        out.innerText = data[0].map(s => s[0]).join('');
    } catch (e) { 
        out.innerText = "Error."; 
    }
}

function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    if (text && text !== "...") {
        navigator.clipboard.writeText(text);
    }
}

// ============================================
// FUNCIONES DE CHAT CON API (IGUALES)
// ============================================

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
        setTimeout(() => {
            addChatMessage("I'm listening! Keep practicing your English.", 'migo');
        }, 500);
    }
}

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

function logCorrection(wrong, right) {
    const log = document.getElementById('correction-log');
    const div = document.createElement('div');
    div.style.marginBottom = "15px";
    div.style.animation = "fadeIn 0.5s ease";
    div.innerHTML = `<div style="color:red; text-decoration:line-through; font-size:12px; font-weight:700;">${wrong}</div>
                     <div style="color:green; font-weight:800; font-size:14px;">➔ ${right}</div>`;
    log.prepend(div);
}