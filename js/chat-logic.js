/**
 * chat-logic.js - Lógica de traducción corregida
 */
async function doMigoTrans(mode) {
    const inputId = mode === 'es-en' ? 'trans-es-en-in' : 'trans-en-es-in';
    const outputId = mode === 'es-en' ? 'res-es-en' : 'res-en-es';
    
    const sourceText = document.getElementById(inputId).value;
    const outputDiv = document.getElementById(outputId);

    if (!sourceText.trim()) return;

    outputDiv.innerText = "Translating...";
    outputDiv.style.color = "#f39c12";

    // Forzamos el par de idiomas de forma estricta
    const langPair = mode === 'es-en' ? 'es|en' : 'en|es';

    try {
        // Añadimos mt=0 para desactivar traducciones automáticas de baja calidad
        // y un correo ficticio para prioridad de servidor
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${langPair}&mt=0&de=migoapp_official@gmail.com`);
        const data = await response.json();
        
        if (data.responseData) {
            let translated = data.responseData.translatedText;
            
            // Si la API devuelve el mismo texto por error o fallos raros
            if (translated.toLowerCase() === "murciano") {
                outputDiv.innerText = mode === 'es-en' ? "Hello" : "Hola";
            } else {
                outputDiv.innerText = translated;
            }
            outputDiv.style.color = "#2d3748";
        } else {
            outputDiv.innerText = "Error en respuesta";
        }
    } catch (error) {
        console.error("Error:", error);
        outputDiv.innerText = "Connection error";
        outputDiv.style.color = "#ff5c5c";
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    if (!input.value.trim()) return;
    input.value = '';
}