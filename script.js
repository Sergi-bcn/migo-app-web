function togglePanel(id) {
    const panel = document.getElementById(id);
    if (panel) {
        panel.classList.toggle('active');
        
        // Al abrir el historial, mostramos cómo queda el rectángulo de error
        if (id === 'record-panel' && panel.classList.contains('active')) {
            addError("I has a pencil", "I have a pencil");
        }
    }
}

function addError(bad, good) {
    const container = document.getElementById('error-log-container');
    if (!container) return;
    
    // Evitamos duplicar el ejemplo
    if (container.innerHTML.includes(bad)) return;

    const div = document.createElement('div');
    div.className = 'error-box';
    div.innerHTML = `
        <span class="wrong">Mistake: ${bad}</span>
        <span class="correct">Correction: ${good}</span>
    `;
    container.prepend(div);
}

// Asignar eventos a los botones al cargar la página
window.onload = () => {
    document.getElementById('btn-translator').onclick = () => togglePanel('translator-panel');
    document.getElementById('btn-record').onclick = () => togglePanel('record-panel');
    document.getElementById('btn-settings').onclick = () => togglePanel('focus-panel');
};