/**
 * chat-logic.js - Lógica de traducción y Chat
 */

async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;

    outputDiv.innerText = "Traduciendo...";
    outputDiv.style.color = "#f39c12";

    const sourceLang = mode === 'es-en' ? 'es' : 'en';
    const targetLang = mode === 'es-en' ? 'en' : 'es';

    try {
        // Usamos la API pública de MyMemory (gratuita y sin registro)
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`);
        const data = await response.json();
        
        if(data.responseData) {
            outputDiv.innerText = data.responseData.translatedText;
            outputDiv.style.color = "#2d3748";
        } else {
            outputDiv.innerText = "Error en respuesta";
        }
    } catch (error) {
        console.error("Error:", error);
        outputDiv.innerText = "Error de conexión";
        outputDiv.style.color = "#ff5c5c";
    }
}

// Función para el chat principal (opcional si la necesitas)
function sendMessage() {
    const input = document.getElementById('user-input');
    if (!input.value.trim()) return;
    console.log("Mensaje enviado:", input.value);
    input.value = '';
}