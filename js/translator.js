/**
 * Función principal de traducción
 * @param {string} from - Idioma de origen ('es' o 'en')
 * @param {string} to - Idioma de destino ('en' o 'es')
 */
async function handleTranslate(from, to) {
    const inputId = (from === 'es') ? 'in-es-at' : 'in-en-at';
    const outputId = (from === 'es') ? 'out-es-at' : 'out-en-at';
    
    const inputEl = document.getElementById(inputId);
    const outputEl = document.getElementById(outputId);

    if (!inputEl || !outputEl) return;

    const text = inputEl.value.trim();
    
    // Si no hay texto, no hacemos nada
    if (!text) {
        outputEl.innerText = "";
        return;
    }

    // Feedback visual mientras traduce
    outputEl.innerText = (from === 'es') ? "Traduciendo..." : "Translating...";

    try {
        // Usamos la API de MyMemory (gratuita y sin registro para este volumen)
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await response.json();
        
        if (data.responseData) {
            outputEl.innerText = data.responseData.translatedText;
        } else {
            outputEl.innerText = "Error en la respuesta.";
        }
    } catch (error) {
        outputEl.innerText = "Error de conexión.";
        console.error("Translation Error:", error);
    }
}

/**
 * Función auxiliar para copiar el resultado al portapapeles
 */
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    if (!text || text === "Traduciendo..." || text === "Translating...") return;
    
    navigator.clipboard.writeText(text).then(() => {
        alert("Copiado al portapapeles");
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}