let currentMigoConfig = { rigor: 'Estricto', estilo: 'Normal' };

// TRADUCCIÓN GOOGLE DIRECTA
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;

    outputDiv.innerText = "Translating...";
    
    const sl = mode === 'es-en' ? 'es' : 'en';
    const tl = mode === 'es-en' ? 'en' : 'es';

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(sourceText)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data[0] && data[0][0]) {
            outputDiv.innerText = data[0][0][0];
            outputDiv.style.color = "#2d3748";
        }
    } catch (e) {
        outputDiv.innerText = "Error: Check connection";
    }
}

// ACTUALIZAR CONFIGURACIÓN Y USUARIO
function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    
    // UI: Botones Verdes
    const buttons = event.target.parentElement.querySelectorAll('.conf-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Sincronizar Ventana Usuario
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerText = `${currentMigoConfig.rigor} / ${currentMigoConfig.estilo}`;
    }
}

// CHAT PRINCIPAL
function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    if (!input.value.trim()) return;

    const msg = document.createElement('div');
    msg.className = 'message user-msg';
    msg.innerText = input.value;
    chatBox.appendChild(msg);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}