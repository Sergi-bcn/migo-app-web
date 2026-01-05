/**
 * chat-logic.js - Gestión de configuración, traducción y funcionalidad de chat
 */

let currentMigoConfig = {
    rigor: 'Estricto / Strict',
    estilo: 'Normal'
};

// Función para actualizar la configuración de la conversación
function updateConfig(type, value, event) {
    // 1. Actualizar estado interno
    currentMigoConfig[type] = value;
    
    // 2. Gestionar UI de botones (Selección Verde)
    const btnPulsado = event.currentTarget;
    const contenedorPadre = btnPulsado.parentElement;
    const botonesDelGrupo = contenedorPadre.querySelectorAll('.conf-btn');
    
    botonesDelGrupo.forEach(btn => btn.classList.remove('active'));
    btnPulsado.classList.add('active');

    // 3. Notificar al sistema de usuario (Funcionalidad explícita)
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>RIGOR LEVEL / NIVEL DE RIGOR:</strong> ${currentMigoConfig.rigor}</div>
            <div><strong>CHAT STYLE / ESTILO DE CHAT:</strong> ${currentMigoConfig.estilo}</div>
        `;
    }
    
    console.log(`Configuración actualizada: Rigor=${currentMigoConfig.rigor}, Estilo=${currentMigoConfig.estilo}`);
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

// Envío de mensajes de chat
function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input || !input.value.trim()) return;

    // Crear burbuja de mensaje del usuario
    const msg = document.createElement('div');
    msg.className = 'message user-msg';
    msg.innerText = input.value;
    chatBox.appendChild(msg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulación de respuesta basada en configuración (funcionalidad de conversación)
    setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'message migo-msg';
        reply.innerText = `[Modo ${currentMigoConfig.estilo} activo]: Entendido.`;
        chatBox.appendChild(reply);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}