/**
 * Lógica del Traductor de Migo
 */

async function translateNow(sl, tl) {
    const text = document.getElementById(`in-${sl}`).value.trim();
    const out = document.getElementById(sl === 'es' ? 'out-en' : 'out-es');
    if (!text) return;

    out.innerText = "Translating...";
    
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        const translatedText = data[0].map(s => s[0]).join('');
        out.innerText = translatedText;
    } catch (e) {
        console.error("Translation error:", e);
        out.innerText = "Error al traducir.";
    }
}

function clearTrans(lang) {
    document.getElementById(`in-${lang}`).value = "";
    const outId = lang === 'es' ? 'out-en' : 'out-es';
    document.getElementById(outId).innerText = "";
}

function handleTransEnter(event, sl, tl) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        translateNow(sl, tl);
    }
}

function copyToClipboard(id) {
    const text = document.getElementById(id).innerText;
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
}