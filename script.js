function toggleTranslator() {
    const el = document.getElementById('translator-panel');
    el.classList.toggle('active');
}

function toggleRecord() {
    const el = document.getElementById('record-panel');
    el.classList.toggle('active');
    // Prueba de error al abrir
    if(el.classList.contains('active')) {
        addError("I has a problem", "I have a problem");
    }
}

function toggleFocus() {
    const el = document.getElementById('focus-panel');
    el.classList.toggle('active');
}

function addError(bad, good) {
    const container = document.getElementById('error-log-container');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'error-box';
    div.innerHTML = `<span class="wrong">${bad}</span><span class="correct">${good}</span>`;
    container.prepend(div);
}