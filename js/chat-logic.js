/**
 * chat-logic.js - Motor Google Translate y Registro de Configuración
 */

// Estado global de la configuración
let currentMigoConfig = {
    rigor: 'Estricto',
    estilo: 'Normal'
};

// MOTOR DE TRADUCCIÓN GOOGLE (Gratis y sin errores de "murciano")
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText || !sourceText.trim()) return;

    outputDiv.innerText = "Translating...";
    outputDiv.style.color = "#f39c12";

    const sl = mode === 'es-en' ? 'es' : 'en';
    const tl = mode === 'es-en' ? 'en' : 'es';

    try {
        // Vinculación directa con el motor de Google Translate
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(sourceText)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            outputDiv.innerText = data[0][0][0];
            outputDiv.style.color = "#2d3748";
        }
    } catch (error) {
        console.error("Google Trans Error:", error);
        outputDiv.innerText = "Connection Error";
        outputDiv.style.color = "#ff5c5c";
    }
}

// FUNCIÓN PARA ACTUALIZAR CONFIGURACIÓN Y REGISTRAR EN VENTANA DE USUARIO
function updateConfig(type, value, event) {
    // 1. Guardar en el objeto global
    currentMigoConfig[type] = value;
    
    // 2. Cambiar visualmente los botones (iluminar en verde)
    const buttons = event.target.parentElement.querySelectorAll('.conf-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 3. Escribir el registro en la ventana de usuario (ID: user-config-status)
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerText = `${currentMigoConfig.rigor} / ${currentMigoConfig.estilo}`;
    }
}

// Función básica para el chat principal
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