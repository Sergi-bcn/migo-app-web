/**
 * chat-logic.js - Conversación Real (API) y Gestión de UI
 */

let currentMigoConfig = {
    rigor: 'Estricto / Strict',
    estilo: 'Normal'
};

function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    const btnPulsado = event.currentTarget;
    const botonesDelGrupo = btnPulsado.parentElement.querySelectorAll('.conf-btn');
    botonesDelGrupo.forEach(btn => btn.classList.remove('active'));
    btnPulsado.classList.add('active');

    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerHTML = `<div><strong>RIGOR:</strong> ${currentMigoConfig.rigor}</div><div><strong>STYLE:</strong> ${currentMigoConfig.estilo}</div>`;
    }
}

// Función principal de conversación fluida
async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input || !input.value.trim()) return;

    const userText = input.value;

    // 1. Cierre automático de ventanas del header al enviar
    const popups = document.querySelectorAll('.popup-modal');
    popups.forEach(p => p.innerHTML = '');

    // 2. Renderizar mensaje de usuario (A la izquierda, letra 17px)
    const userMsg = document.createElement('div');
    userMsg.style.cssText = "align-self: flex-start; background: #f39c12; color: white; padding: 12px 18px; border-radius: 15px 15px 15px 0; margin-bottom: 15px; max-width: 85%; font-size: 17px; font-weight: 500;";
    userMsg.innerText = userText;
    chatBox.appendChild(userMsg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Petición real a la AI (Vercel API)
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: userText,
                config: currentMigoConfig 
            })
        });

        const data = await response.json();
        renderMigoResponse(data.reply || "Lo siento, hubo un error en la conexión.");
    } catch (error) {
        console.error("Error API:", error);
        renderMigoResponse("Error al conectar con la AI.");
    }
}

function renderMigoResponse(text) {
    const chatBox = document.getElementById('chat-box');
    const migoMsg = document.createElement('div');
    migoMsg.style.cssText = "align-self: flex-start; background: #f1f5f9; color: #4a5568; padding: 12px 18px; border-radius: 15px 15px 15px 0; margin-bottom: 15px; max-width: 85%; font-size: 17px; border: 1px solid #edf2f7;";
    migoMsg.innerText = text;
    chatBox.appendChild(migoMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función Traductora
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;
    outputDiv.innerText = "...";

    try {
        const sl = mode === 'es-en' ? 'es' : 'en';
        const tl = mode === 'es-en' ? 'en' : 'es';
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(sourceText)}`;
        const response = await fetch(url);
        const data = await response.json();
        outputDiv.innerText = data[0][0][0];
    } catch (e) {
        outputDiv.innerText = "Error";
    }
}