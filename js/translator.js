async function handleTranslate(from, to) {
    const inputId = (from === 'es') ? 'in-es-at' : 'in-en-at';
    const outputId = (from === 'es') ? 'out-es-at' : 'out-en-at';
    
    const inputEl = document.getElementById(inputId);
    const outputEl = document.getElementById(outputId);

    if (!inputEl || !outputEl) return;

    const text = inputEl.value.trim();
    if (!text) return;

    outputEl.innerText = "...";

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await response.json();
        
        if (data.responseData) {
            outputEl.innerText = data.responseData.translatedText;
        } else {
            outputEl.innerText = "Error";
        }
    } catch (error) {
        outputEl.innerText = "Error de red";
        console.error("Translation error:", error);
    }
}