// --- CONFIGURACIÓN DEL CHAT ---
async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    
    if (!text) return;

    // 1. Añadir mensaje del usuario a la interfaz
    addChatMessage(text, 'user');
    input.value = '';

    try {
        // 2. Llamada a la API en Vercel
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (data.response) {
            // 3. Añadir respuesta de Migo
            addChatMessage(data.response, 'migo');
            
            // 4. Si hay correcciones, añadirlas al log lateral
            if (data.correction && data.correction !== "null") {
                addCorrection(text, data.correction);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        addChatMessage("Sorry, I'm having trouble connecting. / Lo siento, tengo problemas de conexión.", 'migo');
    }
}

// --- UTILIDADES DE INTERFAZ ---

function addChatMessage(text, type) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    // Estructura con botón de copiar (como en tu local)
    div.innerHTML = `
        <span class="msg-content">${text}</span>
        <button class="copy-msg-btn" onclick="copyText(this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        </button>
    `;
    
    chatBox.appendChild(div);
    
    // Auto-scroll hacia abajo
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addCorrection(original, fixed) {
    const log = document.getElementById('correction-log');
    const entry = document.createElement('div');
    entry.className = 'correction-entry'; // Asegúrate de tener este estilo en tu CSS
    entry.innerHTML = `
        <p style="color: #ff5252; margin: 0; font-size: 0.9em;">✗ ${original}</p>
        <p style="color: #4caf50; margin: 0; font-weight: bold;">✓ ${fixed}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
    `;
    log.prepend(entry);
}

// --- POPUPS ---
function togglePopup(id) {
    const popup = document.getElementById(id);
    const isVisible = popup.style.display === 'block';
    
    // Cerrar todos los popups antes de abrir uno nuevo
    document.querySelectorAll('.popup-migo, .mini-profile-card').forEach(p => p.style.display = 'none');
    
    popup.style.display = isVisible ? 'none' : 'block';
}

// --- TRADUCTOR ---
async function translateNow(from, to) {
    const text = document.getElementById(`in-${from}`).value;
    const output = document.getElementById(`out-${to}`);
    
    if (!text) return;
    output.innerText = "Translating...";

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await response.json();
        output.innerText = data.responseData.translatedText;
    } catch (error) {
        output.innerText = "Error translating.";
    }
}

// --- COPIAR TEXTO ---
function copyText(btn) {
    const text = btn.previousElementSibling.innerText;
    navigator.clipboard.writeText(text);
    
    // Efecto visual simple
    const originalColor = btn.style.color;
    btn.style.color = "#4caf50";
    setTimeout(() => btn.style.color = originalColor, 1000);
}

// --- CONTROL DE TECLADO ---
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