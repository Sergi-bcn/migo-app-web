/**
 * chat-logic.js - Gestión de configuración y traducción
 */

let currentMigoConfig = {
    rigor: 'Estricto',
    estilo: 'Normal'
};

function updateConfig(type, value, event) {
    // 1. Actualizar el valor en el objeto global
    currentMigoConfig[type] = value;
    
    // 2. Gestionar la iluminación verde (clase .active)
    // Buscamos el contenedor padre directo del botón pulsado para no afectar a la otra sección
    const parentContainer = event.currentTarget.parentElement;
    const siblingButtons = parentContainer.querySelectorAll('.conf-btn');
    
    // Quitamos el verde de los botones del mismo grupo
    siblingButtons.forEach(btn => btn.classList.remove('active'));
    
    // Ponemos en verde el botón pulsado
    event.currentTarget.classList.add('active');

    // 3. Registrar el cambio en la ventana de usuario
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerText = `${currentMigoConfig.rigor} / ${currentMigoConfig.estilo}`;
    }
}

// Motor de traducción Google
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;
    outputDiv.innerText = "Translating...";

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