// Función única para abrir y cerrar cualquier panel
function togglePanel(id) {
    const panel = document.getElementById(id);
    if (panel) {
        panel.classList.toggle('active');
        
        // Si abrimos el record, metemos un error de ejemplo
        if (id === 'record-panel' && panel.classList.contains('active')) {
            addErrorSample();
        }
    }
}

// Conectamos los botones principales
window.onload = () => {
    document.getElementById('btn-translator').onclick = () => togglePanel('translator-panel');
    document.getElementById('btn-record').onclick = () => togglePanel('record-panel');
    document.getElementById('btn-settings').onclick = () => togglePanel('focus-panel');
};

function addErrorSample() {
    const container = document.getElementById('error-log-container');
    if (container && container.children.length === 0) {
        const box = document.createElement('div');
        box.className = 'error-box';
        box.innerHTML = `<span class="wrong">Mistake: I has a dog</span><span class="correct">Correction: I have a dog</span>`;
        container.appendChild(box);
    }
}