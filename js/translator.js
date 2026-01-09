async function handleTranslate(from, to) {
    const inputId = (from === 'es') ? 'in-es-at' : 'in-en-at';
    const outputId = (from === 'es') ? 'out-es-at' : 'out-en-at';
    
    const inputEl = document.getElementById(inputId);
    const outputEl = document.getElementById(outputId);

    if (!inputEl || !outputEl) {
        console.error("No se encontraron los elementos de traducción");
        return;
    }

    const text = inputEl.value.trim();
    if (!text) {
        outputEl.innerText = "";
        return;
    }

    outputEl.innerText = "...";

    try {
        // Usamos una URL de API directa y limpia
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            outputEl.innerText = data.responseData.translatedText;
        } else {
            outputEl.innerText = "No se pudo traducir.";
        }
    } catch (error) {
        outputEl.innerText = "Error de red o límite alcanzado.";
        console.error("Error detallado:", error);
    }
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    if (!text || text === "...") return;
    
    navigator.clipboard.writeText(text).then(() => {
        // Opcional: Podrías cambiar el icono brevemente a un check
    }).catch(err => {
        console.error('No se pudo copiar: ', err);
    });
}