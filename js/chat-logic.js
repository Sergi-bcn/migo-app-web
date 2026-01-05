/**
 * chat-logic.js - Motor Google Translate (Gratis)
 */
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;

    outputDiv.innerText = "Translating...";
    outputDiv.style.color = "#f39c12";

    const sl = mode === 'es-en' ? 'es' : 'en'; // Source Language
    const tl = mode === 'es-en' ? 'en' : 'es'; // Target Language

    try {
        // Usamos el endpoint oficial de Google Translate (vía script fetch)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(sourceText)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Google devuelve un array anidado: data[0][0][0] es la traducción
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            outputDiv.innerText = data[0][0][0];
            outputDiv.style.color = "#2d3748";
        } else {
            outputDiv.innerText = "Error en formato";
        }
    } catch (error) {
        console.error("Error Google Trans:", error);
        outputDiv.innerText = "Connection Error";
        outputDiv.style.color = "#ff5c5c";
    }
}

// Lógica de configuración (Rigor y Estilo)
let currentMigoConfig = { rigor: 'Estricto', estilo: 'Normal' };

function updateConfig(type, value, event) {
    currentMigoConfig[type] = value;
    
    // UI Update
    const buttons = event.target.parentElement.querySelectorAll('.conf-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Sincronizar con ventana de usuario
    const userStatus = document.getElementById('user-config-status');
    if (userStatus) {
        userStatus.innerText = `${currentMigoConfig.rigor} / ${currentMigoConfig.estilo}`;
    }
}