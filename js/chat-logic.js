/**
 * chat-logic.js - Gestión de conversación, configuración y traducción
 */

let currentMigoConfig = {
    rigor: 'Estricto / Strict',
    estilo: 'Normal'
};

function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    
    const btnPulsado = event.currentTarget;
    const contenedorPadre = btnPulsado.parentElement;
    const botonesDelGrupo = contenedorPadre.querySelectorAll('.conf-btn');
    
    botonesDelGrupo.forEach(btn => btn.classList.remove('active'));
    btnPulsado.classList.add('active');

    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>RIGOR LEVEL / NIVEL DE RIGOR:</strong> ${currentMigoConfig.rigor}</div>
            <div><strong>CHAT STYLE / ESTILO DE CHAT:</strong> ${currentMigoConfig.estilo}</div>
        `;
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    
    if (!input || !input.value.trim()) return;

    // 1. Mensaje del Usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-msg';
    userMsg.style.cssText = "align-self: flex-end; background: #f39c12; color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; margin-bottom: 10px; max-width: 80%; font-size: 15px;";
    userMsg.innerText = input.value;
    chatBox.appendChild(userMsg);

    const textoEnviado = input.value;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Respuesta de Migo: "entendido"
    setTimeout(() => {
        const migoMsg = document.createElement('div');
        migoMsg.className = 'message migo-msg';
        migoMsg.style.cssText = "align-self: flex-start; background: #f1f5f9; color: #4a5568; padding: 10px 15px; border-radius: 15px 15px 15px 0; margin-bottom: 10px; max-width: 80%; font-size: 15px; border: 1px solid #edf2f7;";
        migoMsg.innerText = "entendido";
        chatBox.appendChild(migoMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}

// Motor de traducción
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;
    outputDiv.innerText = "Translating / Traduciendo...";

    try {
        const sl = mode === 'es-en' ? 'es' : 'en';
        const tl = mode === 'es-en' ? 'en' : 'es';
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(sourceText)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data[0] && data[0][0]) {
            outputDiv.innerText = data[0][0][0];
            outputDiv.style.color = "#2d3748";
        }
    } catch (e) {
        outputDiv.innerText = "Error";
    }
}